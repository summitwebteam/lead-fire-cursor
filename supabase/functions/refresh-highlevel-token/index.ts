
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const HIGHLEVEL_CLIENT_ID = "67ea091c7f3a391193a2118a-m8wnz1e4";
const HIGHLEVEL_CLIENT_SECRET = "be894b27-e488-4965-acd8-90cfbfd6cfde";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Token refresh function called");
    
    // Parse request body
    let requestData;
    try {
      requestData = await req.json();
      console.log("Request data:", JSON.stringify(requestData));
    } catch (e) {
      console.error("Failed to parse request body:", e);
      return new Response(
        JSON.stringify({ error: "Invalid request format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const { refresh_token, location_id } = requestData;

    if (!refresh_token) {
      console.error("Missing required parameter: refresh_token");
      return new Response(
        JSON.stringify({ error: "Missing refresh token" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Refresh token received for location: ${location_id || 'global'}`);
    
    // Prepare form data for token request
    const formData = new URLSearchParams();
    formData.append("client_id", HIGHLEVEL_CLIENT_ID);
    formData.append("client_secret", HIGHLEVEL_CLIENT_SECRET);
    formData.append("grant_type", "refresh_token");
    formData.append("refresh_token", refresh_token);

    console.log("Sending token refresh request to HighLevel...");
    
    // Make the token exchange request
    const tokenResponse = await fetch("https://services.leadconnectorhq.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json"
      },
      body: formData.toString()
    });

    // Get the full response text
    const responseText = await tokenResponse.text();
    console.log(`HighLevel response status: ${tokenResponse.status}`);
    console.log(`HighLevel response body: ${responseText}`);
    
    // Try to parse the response as JSON
    let tokenData;
    try {
      tokenData = JSON.parse(responseText);
      
      if (tokenData.error) {
        console.error(`Token refresh error: ${tokenData.error} - ${tokenData.error_description || ""}`);
        return new Response(
          JSON.stringify({ 
            error: "HighLevel token refresh error", 
            details: tokenData 
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      console.log("Token refreshed successfully");
      
      // Add the locationId if provided
      if (location_id) {
        tokenData.locationId = location_id;
      }
      
    } catch (e) {
      console.error(`Failed to parse response as JSON: ${e.message}`);
      return new Response(
        JSON.stringify({ 
          error: "Invalid response from HighLevel", 
          details: responseText 
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Returning refreshed token data to client");
    return new Response(
      JSON.stringify(tokenData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Function error:", error.message, error.stack);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
