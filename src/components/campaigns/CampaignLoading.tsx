
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function CampaignLoading() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => navigate("/campaigns")} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Campaigns
          </Button>
        </div>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading campaign details...</span>
        </div>
      </div>
    </div>
  );
}
