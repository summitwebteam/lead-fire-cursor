
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Campaign } from "@/pages/Campaigns";

interface CampaignHeaderProps {
  campaign: Campaign;
  id: string;
}

export function CampaignHeader({ campaign, id }: CampaignHeaderProps) {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate("/campaigns")} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Campaigns
          </Button>
          <h1 className="text-3xl font-bold">{campaign?.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate(`/campaigns/${id}/settings`)} variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Campaign Settings
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Campaign Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">{campaign?.description}</p>
          <div className="flex flex-wrap gap-2">
            {campaign?.source_types.map((type: string) => (
              <Badge key={type} variant="outline" className="bg-blue-50">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Badge>
            ))}
            <Badge variant={campaign?.status === 'active' ? 'success' : 'secondary'}>
              {campaign?.status.charAt(0).toUpperCase() + campaign?.status.slice(1)}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
