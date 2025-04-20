
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function CampaignNotFound() {
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
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h1 className="text-2xl font-bold mb-4">Campaign Not Found</h1>
            <p className="text-muted-foreground mb-6">The campaign you're looking for doesn't exist or you don't have access to it.</p>
            <Button onClick={() => navigate("/campaigns")}>
              View All Campaigns
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
