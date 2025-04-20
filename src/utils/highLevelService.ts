
import { supabase } from "@/integrations/supabase/client";

export interface HighLevelConnection {
  access_token: string;
  refresh_token: string;
  token_expires_at: string;
  location_id: string;
}

export async function fetchHighLevelData(endpoint: string, connection: HighLevelConnection) {
  try {
    // Check if the token is expired
    const tokenExpiry = new Date(connection.token_expires_at);
    const now = new Date();
    
    if (now > tokenExpiry) {
      // Token is expired, refresh it
      const refreshedConnection = await refreshToken(connection);
      if (!refreshedConnection) {
        throw new Error("Failed to refresh token");
      }
      connection = refreshedConnection;
    }
    
    // Make the request to HighLevel API
    const response = await fetch(`https://services.leadconnectorhq.com${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${connection.access_token}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching HighLevel data from ${endpoint}:`, error);
    throw error;
  }
}

// Helper functions for specific endpoints
export async function fetchForms(connection: HighLevelConnection) {
  const result = await fetchHighLevelData('/v1/forms/', connection);
  return result.forms || [];
}

export async function fetchPhoneNumbers(connection: HighLevelConnection) {
  const result = await fetchHighLevelData('/v1/phoneNumbers/', connection);
  return result.phoneNumbers || [];
}

export async function fetchSurveys(connection: HighLevelConnection) {
  const result = await fetchHighLevelData('/surveys/', connection);
  return result || [];
}

export async function fetchContacts(connection: HighLevelConnection, page = 1, limit = 100) {
  const result = await fetchHighLevelData(`/v1/contacts/?page=${page}&limit=${limit}`, connection);
  return result.contacts || [];
}

// Function to refresh an expired token
async function refreshToken(connection: HighLevelConnection): Promise<HighLevelConnection | null> {
  try {
    // Call the edge function to refresh the token
    const { data, error } = await supabase.functions.invoke('refresh-highlevel-token', {
      body: {
        refresh_token: connection.refresh_token,
        location_id: connection.location_id
      }
    });
    
    if (error || !data || !data.access_token) {
      console.error('Failed to refresh token:', error || 'Invalid response');
      return null;
    }
    
    // Update the token in the database
    const { access_token, refresh_token, expires_in } = data;
    
    // Calculate new expiration time
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expires_in);
    
    // Update the database with the new token
    const { data: updatedConnection, error: updateError } = await supabase
      .from('user_connections')
      .update({
        access_token,
        refresh_token,
        token_expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('location_id', connection.location_id)
      .select()
      .single();
      
    if (updateError) {
      console.error('Failed to update token in database:', updateError);
      return null;
    }
    
    return updatedConnection;
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
}
