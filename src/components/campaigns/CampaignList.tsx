
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Phone, Calendar, MoreHorizontal, PlayCircle, PauseCircle, Facebook, ClipboardList } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import type { Campaign } from "@/pages/Campaigns";

interface CampaignListProps {
  campaigns: Campaign[];
  onCreateCampaign?: () => void;
}

export function CampaignList({ campaigns, onCreateCampaign }: CampaignListProps) {
  const navigate = useNavigate();
  
  // Get source icon based on source type
  const getSourceIcon = (source: string) => {
    switch (source) {
      case "call":
        return <Phone className="h-4 w-4" />;
      case "form":
        return <FileText className="h-4 w-4" />;
      case "facebook":
        return <Facebook className="h-4 w-4" />;
      case "survey":
        return <ClipboardList className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // Function to navigate to campaign details
  const viewCampaignDetails = (id: string) => {
    navigate(`/campaigns/${id}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.length === 0 ? (
        <Card className="col-span-full flex flex-col items-center justify-center p-8 text-center border-dashed border-2 border-muted-foreground/20">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle className="text-xl mb-2">No campaigns yet</CardTitle>
          <CardDescription className="max-w-md mb-6">
            Create your first campaign to start tracking leads from different sources
          </CardDescription>
          <Button onClick={onCreateCampaign}>Create Your First Campaign</Button>
        </Card>
      ) : (
        <>
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="overflow-hidden cursor-pointer transition-all hover:shadow-md" onClick={() => viewCampaignDetails(campaign.id)}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{campaign.description}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        viewCampaignDetails(campaign.id);
                      }}>
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit campaign</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Delete campaign</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap space-x-2 mb-3">
                  {(campaign.source_types || []).map((source, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1 text-xs">
                      {getSourceIcon(source)}
                      <span className="capitalize">{source}</span>
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    Created {new Date(campaign.created_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 flex justify-between pt-2">
                <Badge variant={campaign.status === "active" ? "success" : "outline"} className="capitalize">
                  {campaign.status === "active" ? (
                    <PlayCircle className="h-3 w-3 mr-1" />
                  ) : (
                    <PauseCircle className="h-3 w-3 mr-1" />
                  )}
                  {campaign.status}
                </Badge>
                <Button variant="ghost" size="sm" className="h-7" onClick={(e) => {
                  e.stopPropagation();
                  viewCampaignDetails(campaign.id);
                }}>
                  View Leads
                </Button>
              </CardFooter>
            </Card>
          ))}

          {onCreateCampaign && (
            <Card className="overflow-hidden border-dashed border-2 border-muted-foreground/20 flex flex-col items-center justify-center cursor-pointer hover:border-muted-foreground/40 transition-all" onClick={onCreateCampaign}>
              <CardContent className="p-8 text-center">
                <div className="rounded-full bg-muted p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <CardTitle className="text-lg mb-2">Create New Campaign</CardTitle>
                <CardDescription>
                  Set up a new campaign to track and filter leads
                </CardDescription>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
