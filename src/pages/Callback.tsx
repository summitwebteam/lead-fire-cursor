
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Callback() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [connectionData, setConnectionData] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const addLog = (message: string) => {
    console.log(message);
    setLogs((prev) => [...prev, `[${new Date().toISOString()}] ${message}`]);
  };

  const isValidUUID = (uuid: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  useEffect(() => {
    async function handleCallback() {
      const params = new URLSearchParams(location.search);
      const code = params.get("code");
      const userId = params.get("state");

      addLog("Callback page loaded");
      addLog(`Current URL: ${window.location.href}`);
      addLog(`URL Parameters: ${JSON.stringify(Object.fromEntries(params.entries()))}`);

      if (!code) {
        addLog("Missing code parameter");
        setError("Missing authorization code. Please try again.");
        setLoading(false);
        return;
      }

      if (!userId || !isValidUUID(userId)) {
        addLog("❌ No state parameter (user ID) received");
        setError("Missing user identification. Please try again.");
        setLoading(false);
        return;
      }

      try {
        addLog("Calling edge function to exchange token...");
        const response = await fetch("/functions/v1/exchange-highlevel-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, userId }),
        });

        const data = await response.json();

        if (!response.ok) {
          addLog(`❌ Error from edge function: ${JSON.stringify(data)}`);
          setError(data?.error || "Token exchange failed.");
        } else {
          addLog("✅ Successfully obtained tokens from HighLevel");
          addLog(`Token data received: ${JSON.stringify(data)}`);
          setConnectionData(data);

          // Fetch installed locations
          addLog("Fetching installed locations...");
          const locationsResponse = await supabase.functions.invoke("fetch-installed-locations", {
            body: {
              userId,
              accessToken: data.access_token,
              companyId: data.company_id
            }
          });

          if (locationsResponse.error) {
            addLog(`❌ Error fetching locations: ${locationsResponse.error.message}`);
          } else {
            addLog(`✅ Successfully fetched locations: ${JSON.stringify(locationsResponse.data)}`);
          }

          toast.success("HighLevel connected successfully");
          navigate("/dashboard");
        }
      } catch (err: any) {
        addLog(`❌ Unexpected error: ${err.message}`);
        setError("Unexpected error. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    handleCallback();
  }, [location, navigate]);

  return (
    <div className="flex flex-col gap-4 p-6 max-w-xl mx-auto">
      {loading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" /> Connecting to HighLevel...
        </div>
      ) : error ? (
        <>
          <div className="border p-4 rounded bg-red-50 border-red-300 text-red-800">
            <strong>Connection Error</strong>
            <p className="mt-2">{error}</p>
          </div>
          <div className="bg-muted text-muted-foreground text-sm border rounded p-4 font-mono whitespace-pre-wrap">
            {logs.join("\n")}
          </div>
          <Button onClick={() => navigate("/")}>Return to Dashboard</Button>
        </>
      ) : null}
    </div>
  );
}
