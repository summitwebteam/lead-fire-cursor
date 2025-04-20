
import { useState } from "react";
import { useParams } from "react-router-dom";
import { DateRange } from "react-day-picker";
import { subDays } from "date-fns";
import { CampaignHeader } from "@/components/campaigns/CampaignHeader";
import { CampaignLoading } from "@/components/campaigns/CampaignLoading";
import { CampaignNotFound } from "@/components/campaigns/CampaignNotFound";
import { CampaignContent } from "@/components/campaigns/CampaignContent";
import { useCampaignData } from "@/hooks/useCampaignData";

export default function CampaignDetails() {
  const { id } = useParams();
  
  // Set default date range to last 30 days
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  // Use our custom hook to handle data fetching and processing
  const {
    campaign,
    campaignLoading,
    filteredLeads,
    stats,
    activeFilter,
    setActiveFilter,
    activeStatusFilter,
    setActiveStatusFilter,
    handleExportCSV,
    leadsLoading
  } = useCampaignData({ id, dateRange });

  if (campaignLoading) {
    return <CampaignLoading />;
  }

  if (!campaign && !campaignLoading) {
    return <CampaignNotFound />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <CampaignHeader campaign={campaign} id={id || ""} />

        <CampaignContent
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          stats={stats}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          activeStatusFilter={activeStatusFilter}
          onStatusFilterChange={setActiveStatusFilter}
          onExportCSV={handleExportCSV}
          filteredLeads={filteredLeads}
          leadsLoading={leadsLoading}
        />
      </div>
    </div>
  );
}
