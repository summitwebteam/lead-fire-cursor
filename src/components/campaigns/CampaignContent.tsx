
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/dashboard/DateRangePicker";
import { LeadStats } from "@/components/dashboard/LeadStats";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { LeadsTable } from "@/components/dashboard/LeadsTable";
import { LeadChart } from "@/components/dashboard/LeadChart";
import { Card, CardContent } from "@/components/ui/card";
import { Lead } from "@/types/lead";

interface CampaignContentProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  stats: {
    leads: number;
    calls: number;
    submits: number;
    disputes: number;
  };
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  activeStatusFilter: string;
  onStatusFilterChange: (filter: string) => void;
  onExportCSV: () => void;
  filteredLeads: Lead[];
  leadsLoading: boolean;
}

export function CampaignContent({
  dateRange,
  onDateRangeChange,
  stats,
  activeFilter,
  onFilterChange,
  activeStatusFilter,
  onStatusFilterChange,
  onExportCSV,
  filteredLeads,
  leadsLoading
}: CampaignContentProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">Campaign Leads</h2>
        <DateRangePicker dateRange={dateRange} onDateRangeChange={onDateRangeChange} />
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
        onFilterChange={onFilterChange}
        onStatusFilterChange={onStatusFilterChange}
        onExportCSV={onExportCSV} 
      />
      
      <Card>
        <CardContent className="pt-6">
          <LeadChart dateRange={dateRange} leads={filteredLeads} />
        </CardContent>
      </Card>
      
      <LeadsTable 
        leads={filteredLeads} 
        loading={leadsLoading} 
      />
    </div>
  );
}
