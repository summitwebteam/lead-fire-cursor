import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CampaignList } from "@/components/campaigns/CampaignList";
import { CreateCampaignDialog } from "@/components/campaigns/CreateCampaignDialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Json } from "@/integrations/supabase/types";

// Define the Campaign type based on our Supabase schema
export interface Campaign {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  status: string;
  filter_rules?: Json | null;
  form_ids?: string[] | null;
  phone_number_ids?: string[] | null;
  updated_at?: string | null;
  user_id?: string | null;
  // Add computed properties that aren't in the database
  source_types: string[];
  source_type?: string;
  leads?: number;
}

const Campaigns = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Fetch campaigns from Supabase
  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['campaigns', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        toast.error('Failed to load campaigns');
        console.error("Error fetching campaigns:", error);
        return [];
      }
      
      // Transform data to match the Campaign interface
      return data.map(campaign => ({
        ...campaign,
        // Add source_types as a computed property based on form_ids and phone_number_ids
        source_types: getSourceTypes(campaign),
        // Set default leads count if missing
        leads: 0, // This would be replaced with actual count in a real implementation
      })) as Campaign[];
    },
    enabled: !!user,
  });

  // Helper function to determine source types from campaign data
  const getSourceTypes = (campaign: any): string[] => {
    const types: string[] = [];
    
    if (campaign.phone_number_ids && campaign.phone_number_ids.length > 0) {
      types.push("call");
    }
    
    if (campaign.form_ids && campaign.form_ids.length > 0) {
      types.push("form");
    }
    
    // Use source_type if it exists for backward compatibility
    if (campaign.source_type && !types.includes(campaign.source_type)) {
      types.push(campaign.source_type);
    }
    
    // Default to "form" if nothing else is specified
    if (types.length === 0) {
      types.push("form");
    }
    
    return types;
  };
  
  // Create campaign mutation
  const createCampaignMutation = useMutation({
    mutationFn: async (newCampaign: Omit<Campaign, 'id' | 'created_at' | 'user_id' | 'leads' | 'source_type'>) => {
      if (!user) throw new Error('User not authenticated');
      
      const campaignToInsert = {
        name: newCampaign.name,
        description: newCampaign.description,
        status: newCampaign.status || 'active',
        user_id: user.id,
        // Store the source_types array in the database
        source_types: Array.isArray(newCampaign.source_types) ? newCampaign.source_types : [],
        form_ids: newCampaign.form_ids,
        phone_number_ids: newCampaign.phone_number_ids,
        filter_rules: newCampaign.filter_rules,
      };
      
      const { data, error } = await supabase
        .from('campaigns')
        .insert(campaignToInsert)
        .select()
        .single();
      
      if (error) {
        console.error("Error creating campaign:", error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      toast.success('Campaign created successfully');
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      setIsCreateDialogOpen(false);
    },
    onError: (error) => {
      toast.error('Failed to create campaign');
      console.error("Error in createCampaignMutation:", error);
    }
  });

  const handleCreateCampaign = (newCampaign: Omit<Campaign, 'id' | 'leads' | 'created_at' | 'source_type'>) => {
    createCampaignMutation.mutate(newCampaign);
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel('campaigns-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'campaigns',
        filter: `user_id=eq.${user.id}`,
      }, () => {
        // Refresh campaigns when changes occur
        queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Campaigns</h1>
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          disabled={isLoading || !user}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>
      
      <p className="text-muted-foreground">
        Campaigns help you organize and track leads from different sources.
        Create a campaign to start collecting and qualifying leads.
      </p>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <CampaignList 
          campaigns={campaigns} 
          onCreateCampaign={() => setIsCreateDialogOpen(true)}
        />
      )}
      
      <CreateCampaignDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
        onCreateCampaign={handleCreateCampaign}
        isCreating={createCampaignMutation.isPending}
      />
    </div>
  );
};

export default Campaigns;
