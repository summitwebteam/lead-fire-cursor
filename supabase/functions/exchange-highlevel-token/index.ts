
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const HIGHLEVEL_CLIENT_ID = "67ea091c7f3a391193a2118a-m8wnz1e4";
const HIGHLEVEL_CLIENT_SECRET = "be894b27-e488-4965-acd8-90cfbfd6cfde";
const REDIRECT_URI = "https://a228c1c2-052f-46d0-913b-af38f9f14b82.lovableproject.com/auth/callback";
const APP_ID = "67ea091c7f3a391193a2118a-m8wnz1e4";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function fetchInstalledLocations(accessToken: string, companyId: string) {
  const response = await fetch(
    `https://services.leadconnectorhq.com/oauth/installedLocations?companyId=${companyId}&appId=${APP_ID}&limit=1000&isInstalled=true`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Version': '2021-07-28',
      },
    }
  );

  if (!response.ok) {
    console.error('Failed to fetch installed locations:', await response.text());
    throw new Error('Failed to fetch installed locations');
  }

  return await response.json();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, locationId = "global", userId } = await req.json();

    if (!code) {
      return new Response(
        JSON.stringify({ error: "Missing authorization code" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Exchange code for token
    const formData = new URLSearchParams();
    formData.append("client_id", HIGHLEVEL_CLIENT_ID);
    formData.append("client_secret", HIGHLEVEL_CLIENT_SECRET);
    formData.append("grant_type", "authorization_code");
    formData.append("code", code);
    formData.append("redirect_uri", REDIRECT_URI);

    const tokenResponse = await fetch("https://services.leadconnectorhq.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || tokenData.error) {
      return new Response(
        JSON.stringify({ error: "Token exchange failed", details: tokenData }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { access_token, refresh_token } = tokenData;

    // Calculate token expiration (default to 7 days if not provided)
    const expiresIn = tokenData.expires_in || 604800;
    const tokenExpiresAt = new Date();
    tokenExpiresAt.setSeconds(tokenExpiresAt.getSeconds() + expiresIn);

    // Fetch installed locations
    let companyId = tokenData.companyId;
    if (!companyId) {
      // If companyId is not in the token response, we need to fetch it from the installed locations
      try {
        const locationsData = await fetchInstalledLocations(access_token, companyId);
        if (locationsData.locations?.[0]?.companyId) {
          companyId = locationsData.locations[0].companyId;
        }
      } catch (error) {
        console.error('Failed to fetch company ID:', error);
      }
    }

    // Store the connection details in Supabase
    const { error: upsertError } = await supabase.from("user_connections").upsert({
      user_id: userId,
      location_id: locationId,
      access_token,
      refresh_token,
      token_expires_at: tokenExpiresAt.toISOString(),
      company_id: companyId,
      updated_at: new Date().toISOString(),
    });

    if (upsertError) {
      console.error("Failed to save connection:", upsertError);
      return new Response(
        JSON.stringify({ error: "Failed to save connection", details: upsertError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If we have the connection saved, fetch and store all installed locations
    if (companyId) {
      try {
        const locationsData = await fetchInstalledLocations(access_token, companyId);
        
        // Store each location in the database
        if (locationsData.locations?.length > 0) {
          for (const location of locationsData.locations) {
            await supabase.from("highlevel_locations").upsert({
              location_id: location.locationId,
              company_id: companyId,
              user_id: userId,
              location_name: location.name,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
          }
        }
      } catch (error) {
        console.error('Error storing locations:', error);
      }
    }

    return new Response(
      JSON.stringify({ ...tokenData, companyId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: e.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
