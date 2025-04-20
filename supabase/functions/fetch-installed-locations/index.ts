
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const APP_ID = "67ea091c7f3a391193a2118a-m8wnz1e4";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, accessToken, companyId } = await req.json();

    if (!accessToken || !companyId) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Fetching installed locations for company:", companyId);

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
      const error = await response.text();
      console.error('Failed to fetch installed locations:', error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch installed locations", details: error }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("Installed locations data:", data);
    
    // Store each location in the database
    if (data.locations?.length > 0) {
      for (const location of data.locations) {
        const { error: upsertError } = await supabase.from("highlevel_locations").upsert({
          location_id: location.locationId,
          company_id: companyId,
          user_id: userId,
          location_name: location.name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (upsertError) {
          console.error('Error storing location:', upsertError);
        }
      }
    }

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
