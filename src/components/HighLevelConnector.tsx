import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface HighLevelConnectorProps {
  userId: string;
  onConnectionSuccess?: (connection: any) => void;
}

export function HighLevelConnector({ userId, onConnectionSuccess }: HighLevelConnectorProps) {
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    async function checkConnection() {
      if (!userId) return;
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(userId)) return;

      try {
        // Check if we have a connection for this user
        const { data, error } = await supabase
          .from("user_connections")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (data) {
          setIsConnected(true);
          onConnectionSuccess?.(data);
        }
      } catch (error) {
        console.error("Failed to check connection status", error);
      }
    }

    checkConnection();
  }, [userId]);

  const handleConnect = async () => {
    if (!userId) {
      toast.error("No user ID found. Please log in.");
      return;
    }

    setLoading(true);

    const clientId = "67ea091c7f3a391193a2118a-m8wnz1e4";
    const redirectUri = "https://a228c1c2-052f-46d0-913b-af38f9f14b82.lovableproject.com/auth/callback";
    const authUrl = https://marketplace.gohighlevel.com/oauth/chooselocation?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${userId};

    window.location.href = authUrl;
  };

  return (
    <div className="space-y-2">
      {isConnected ? (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle size={20} /> Connected to HighLevel
        </div>
      ) : (
        <Button disabled={loading} onClick={handleConnect}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Connect to HighLevel
        </Button>
      )}
    </div>
  );
}
