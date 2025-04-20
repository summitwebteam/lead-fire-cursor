
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Campaign } from "@/pages/Campaigns";
import { Lead } from "@/types/lead";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";

interface UseCampaignDataProps {
  id: string | undefined;
  dateRange: DateRange | undefined;
}

export function useCampaignData({ id, dateRange }: UseCampaignDataProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeStatusFilter, setActiveStatusFilter] = useState("all");

  // Helper function to determine source types from campaign data
  const getSourceTypes = (campaign: any): string[] => {
    const types: string[] = [];
    
    if (campaign.phone_number_ids && campaign.phone_number_ids.length > 0) {
      types.push("call");
    }
    
    if (campaign.form_ids && campaign.form_ids.length > 0) {
      types.push("form");
    }
    
    // Default to "form" if nothing else is specified
    if (types.length === 0) {
      types.push("form");
    }
    
    return types;
  };

  // Helper function to extract contact name from lead data
  const extractContactName = (lead: any): string | null => {
    // Try to extract name from raw_data if available
    if (lead.raw_data && typeof lead.raw_data === 'object') {
      const rawData = lead.raw_data as any;
      
      if (rawData.firstName && rawData.lastName) {
        return `${rawData.firstName} ${rawData.lastName}`;
      }
      
      if (rawData.name) {
        return rawData.name;
      }
      
      if (rawData.fullName) {
        return rawData.fullName;
      }
    }
    
    // Use contact_phone or contact_email as fallback
    return lead.contact_phone || lead.contact_email || null;
  };

  // Fetch campaign details
  const { 
    data: campaign,
    isLoading: campaignLoading,
    error: campaignError
  } = useQuery({
    queryKey: ['campaign', id],
    queryFn: async () => {
      if (!id || !user) throw new Error("Missing campaign ID or user not authenticated");
      
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error("Error fetching campaign:", error);
        throw error;
      }
      
      // Transform data to include source_types
      const transformedData = {
        ...data,
        // Add source_types array derived from campaign data
        source_types: getSourceTypes(data)
      };
      
      return transformedData as Campaign;
    },
    enabled: !!id && !!user,
  });

  // Fetch leads for this campaign
  const { 
    data: leadsData = [],
    isLoading: leadsLoading,
    error: leadsError
  } = useQuery({
    queryKey: ['campaign-leads', id, dateRange],
    queryFn: async () => {
      if (!id || !user) return [];
      
      const from = dateRange?.from?.toISOString();
      const to = dateRange?.to?.toISOString();
      
      let query = supabase
        .from('leads')
        .select('*')
        .eq('campaign_id', id);
      
      // Apply date range filter if available
      if (from && to) {
        query = query.gte('created_at', from).lte('created_at', to);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching leads:", error);
        throw error;
      }
      
      // Transform data to match Lead interface
      return (data || []).map(lead => ({
        ...lead,
        // Always prefer stored contact_name, if not available then extract
        contact_name: lead.contact_name || extractContactName(lead) || "Unknown",
        // Add approval_status based on qualified flag
        approval_status: lead.qualified === true 
          ? "approved" 
          : lead.qualified === false 
          ? "disputed" 
          : "pending",
      })) as Lead[];
    },
    enabled: !!id && !!user && !!campaign,
  });

  // Set up real-time subscription for leads
  useEffect(() => {
    if (!id || !user) return;
    
    const channel = supabase
      .channel('leads-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'leads',
        filter: `campaign_id=eq.${id}`,
      }, () => {
        // Refresh leads when changes occur
        queryClient.invalidateQueries({ queryKey: ['campaign-leads'] });
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, user, queryClient]);

  // Filter leads based on active filter
  const filteredLeads = leadsData.filter(lead => {
    // First filter by source type
    const passesSourceFilter = 
      activeFilter === "all" ? true :
      activeFilter === "calls" ? lead.source === "call" :
      activeFilter === "forms" ? lead.source === "form" :
      activeFilter === "facebook" ? lead.source === "facebook" : true;
    
    // Then filter by approval status
    const passesStatusFilter = 
      activeStatusFilter === "all" ? true :
      activeStatusFilter === lead.approval_status;
    
    return passesSourceFilter && passesStatusFilter;
  });

  // Calculate stats
  const stats = {
    leads: filteredLeads.length,
    calls: filteredLeads.filter(lead => lead.source === "call").length,
    submits: filteredLeads.filter(lead => lead.source === "form").length,
    disputes: filteredLeads.filter(lead => lead.qualified === false).length,
  };

  // Handle CSV export
  const handleExportCSV = () => {
    toast.message("Export Started", {
      description: "Your CSV file is being generated and will download shortly.",
    });
    
    // Simple CSV generation
    const headers = ["Name", "Email", "Phone", "Source", "Date", "Status"];
    const csvContent = filteredLeads.map(lead => 
      [
        lead.contact_name || "Unknown",
        lead.contact_email || "",
        lead.contact_phone || "",
        lead.source,
        lead.created_at ? new Date(lead.created_at).toLocaleDateString() : "",
        lead.approval_status
      ].join(",")
    );
    
    const csv = [headers.join(","), ...csvContent].join("\n");
    
    // Create download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `campaign-leads-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => {
      toast.message("Export Complete", {
        description: "Your leads data has been exported successfully.",
      });
    }, 1500);
  };

  // Handle errors
  useEffect(() => {
    if (campaignError) {
      toast.error("Failed to load campaign details");
      console.error(campaignError);
    }
    
    if (leadsError) {
      toast.error("Failed to load leads");
      console.error(leadsError);
    }
  }, [campaignError, leadsError]);

  return {
    campaign,
    campaignLoading,
    campaignError,
    leadsData,
    leadsLoading,
    leadsError,
    filteredLeads,
    stats,
    activeFilter,
    setActiveFilter,
    activeStatusFilter,
    setActiveStatusFilter,
    handleExportCSV
  };
}
