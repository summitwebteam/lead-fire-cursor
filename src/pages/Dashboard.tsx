
import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { subDays, differenceInDays } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HighLevelConnector } from "@/components/HighLevelConnector";
import { DateRangePicker } from "@/components/dashboard/DateRangePicker";
import { LeadStats } from "@/components/dashboard/LeadStats";
import { LeadChart } from "@/components/dashboard/LeadChart";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { LeadsTable } from "@/components/dashboard/LeadsTable";
import { Loader2, Columns } from "lucide-react";
import { toast } from "sonner";
import { LeadsColumnEditor, type ColumnConfig } from "@/components/dashboard/LeadsColumnEditor";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { mockCampaigns } from "@/data/mockCampaigns";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [connection, setConnection] = useState<any>(null);
  const [connectionLoading, setConnectionLoading] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeStatusFilter, setActiveStatusFilter] = useState("all");
  const [activeCampaign, setActiveCampaign] = useState("all");
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [disputeLeadId, setDisputeLeadId] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState(mockCampaigns);
  
  // Set default date range to last 30 days
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  // Mock user ID for development
  const mockUserId = "dev-user-123";

  // Handle connection success - now a function that will check for connections in useEffect
  const handleConnectionSuccess = (newConnection: any) => {
    setConnection(newConnection);
    // Mock leads data for development
    const mockLeads = generateMockLeads(30);
    setLeads(mockLeads);
  };

  // Check for existing connection on component mount
  useEffect(() => {
    // In a real implementation, this would check the database for existing connections
    // For now, we'll just set connection loading to false
    setConnectionLoading(false);
  }, []);

  const handleExportCSV = () => {
    toast.message("Export Started", {
      description: "Your CSV file is being generated and will download shortly.",
    });
    
    setTimeout(() => {
      toast.message("Export Complete", {
        description: "Your leads data has been exported successfully.",
      });
    }, 1500);
  };

  // Generate mock leads data for development with repeat detection
  const generateMockLeads = (count: number) => {
    const sources = ["call", "form", "facebook"];
    const statuses = ["answered", "missed", "voicemail"];
    const devices = ["mobile", "desktop", "tablet"];
    const approvalStatuses = ["pending", "approved", "disputed"];
    const mockLeads = [];
    
    // Create a map to track phone numbers and their last contact dates
    const phoneContactMap = new Map();
    const emailContactMap = new Map();
    
    for (let i = 0; i < count; i++) {
      const createdDate = new Date();
      createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 60)); // Spread over last 60 days
      const source = sources[Math.floor(Math.random() * sources.length)];
      
      // Generate contact info
      const phoneNumber = `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      const email = `contact${i}@example.com`;
      
      // Randomly assign to a campaign
      const campaignId = i % 3 === 0 ? "all" : campaigns[Math.floor(Math.random() * campaigns.length)].id;
      
      // Check if this is a repeat lead within 30 days
      const isRepeatPhone = phoneContactMap.has(phoneNumber);
      const isRepeatEmail = emailContactMap.has(email);
      
      let isRepeat = isRepeatPhone || isRepeatEmail;
      let lastContactDate = null;
      let repeatWithinThreshold = false;
      let qualified = true;
      
      if (isRepeatPhone) {
        lastContactDate = phoneContactMap.get(phoneNumber);
        const daysDifference = differenceInDays(createdDate, new Date(lastContactDate));
        repeatWithinThreshold = daysDifference <= 30;
        
        // Automatically disqualify if it's a repeat within 30 days
        if (repeatWithinThreshold) {
          qualified = false;
        }
      } else if (isRepeatEmail) {
        lastContactDate = emailContactMap.get(email);
        const daysDifference = differenceInDays(createdDate, new Date(lastContactDate));
        repeatWithinThreshold = daysDifference <= 30;
        
        // Automatically disqualify if it's a repeat within 30 days
        if (repeatWithinThreshold) {
          qualified = false;
        }
      }
      
      // Add or update contact info in our tracking maps
      phoneContactMap.set(phoneNumber, createdDate.toISOString());
      emailContactMap.set(email, createdDate.toISOString());
      
      // Create the lead object with repeat status information
      mockLeads.push({
        id: `lead-${i}`,
        location_id: "mock-location-123",
        campaign_id: campaignId,
        contact_name: `Contact ${i + 1}`,
        phone_number: phoneNumber,
        contact_email: email,
        source: source,
        call_status: source === "call" ? statuses[Math.floor(Math.random() * statuses.length)] : undefined,
        duration: source === "call" ? Math.floor(Math.random() * 300) : undefined,
        first_time: !isRepeat,
        device_type: devices[Math.floor(Math.random() * devices.length)],
        qualified: qualified,
        created_at: createdDate.toISOString(),
        approval_status: repeatWithinThreshold ? "pending" : approvalStatuses[Math.floor(Math.random() * approvalStatuses.length)],
        repeat_status: isRepeat,
        repeat_within_threshold: repeatWithinThreshold,
        last_contact_date: lastContactDate,
      });
    }
    
    // Sort by date descending (newest first)
    return mockLeads.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  // Generate some initial mock data
  useEffect(() => {
    const mockLeads = generateMockLeads(30);
    setLeads(mockLeads);
  }, []);

  // Handle lead approval
  const handleLeadApprove = (leadId: string) => {
    setLeads(leads.map(lead => 
      lead.id === leadId 
        ? { ...lead, approval_status: "approved", qualified: true } 
        : lead
    ));
    
    toast.message("Lead Approved", {
      description: "This lead has been marked as qualified."
    });
  };
  
  // Handle lead dispute (open modal)
  const handleLeadDispute = (leadId: string) => {
    setDisputeLeadId(leadId);
    setIsDisputeModalOpen(true);
  };
  
  // Handle dispute submission
  const handleDisputeSubmit = () => {
    if (!disputeLeadId) return;
    
    if (!disputeReason.trim()) {
      toast.error("Please provide a reason for disputing this lead.");
      return;
    }
    
    setLeads(leads.map(lead => 
      lead.id === disputeLeadId 
        ? { ...lead, approval_status: "disputed", qualified: false, dispute_reason: disputeReason } 
        : lead
    ));
    
    setIsDisputeModalOpen(false);
    setDisputeReason("");
    setDisputeLeadId(null);
    
    toast.message("Lead Disputed", {
      description: "This lead has been marked as disputed."
    });
  };

  // Filter leads based on active filters
  const filteredLeads = leads.filter(lead => {
    // First filter by campaign
    const passesCampaignFilter = 
      activeCampaign === "all" ? true : 
      lead.campaign_id === activeCampaign;
    
    // Then filter by source type
    const passesSourceFilter = 
      activeFilter === "all" ? true :
      activeFilter === "calls" ? lead.source === "call" :
      activeFilter === "forms" ? lead.source === "form" :
      activeFilter === "facebook" ? lead.source === "facebook" : true;
    
    // Then filter by approval status
    const passesStatusFilter = 
      activeStatusFilter === "all" ? true :
      activeStatusFilter === lead.approval_status;
    
    return passesCampaignFilter && passesSourceFilter && passesStatusFilter;
  });

  // Calculate stats
  const stats = {
    leads: filteredLeads.length,
    calls: filteredLeads.filter(lead => lead.source === "call").length,
    submits: filteredLeads.filter(lead => lead.source === "form").length,
    disputes: filteredLeads.filter(lead => lead.approval_status === "disputed").length,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Lead Funnel Dashboard</h1>
        </div>

        {connectionLoading ? (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-2" />
                <p>Checking HighLevel connection...</p>
              </div>
            </CardContent>
          </Card>
        ) : !connection ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Connect to HighLevel</CardTitle>
              <CardDescription>
                First, you need to connect your HighLevel account to get started. Click the button below to authorize this app with your HighLevel account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HighLevelConnector userId={mockUserId} />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-2xl font-bold">All Leads</h2>
              <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
            </div>
            
            <LeadStats 
              leadCount={stats.leads}
              callCount={stats.calls}
              submitCount={stats.submits}
              disputeCount={stats.disputes}
            />

            <FilterBar 
              activeFilter={activeFilter} 
              activeStatusFilter={activeStatusFilter}
              activeCampaign={activeCampaign}
              campaigns={campaigns}
              onFilterChange={setActiveFilter}
              onStatusFilterChange={setActiveStatusFilter}
              onCampaignChange={setActiveCampaign}
              onExportCSV={handleExportCSV} 
            />
            
            <Card>
              <CardContent className="pt-6">
                <LeadChart dateRange={dateRange} leads={filteredLeads} />
              </CardContent>
            </Card>
            
            <div className="flex justify-end mb-2">
              <Button variant="outline" size="sm">
                <Columns className="h-4 w-4 mr-2" />
                Columns
              </Button>
            </div>
            
            <LeadsTable 
              leads={filteredLeads} 
              loading={loadingLeads}
              onApprove={handleLeadApprove}
              onDispute={handleLeadDispute}
            />
          </div>
        )}
      </div>
      
      {/* Dispute Modal */}
      <Dialog open={isDisputeModalOpen} onOpenChange={setIsDisputeModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Dispute Lead</DialogTitle>
            <DialogDescription>
              Please provide a reason for disputing this lead.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Textarea
              placeholder="Enter dispute reason"
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDisputeModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="default"
              onClick={handleDisputeSubmit}
            >
              Submit Dispute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
