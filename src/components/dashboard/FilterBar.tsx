
import { useState } from "react";
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  Download, 
  FileText, 
  Filter, 
  Phone,
  Facebook,
  ThumbsUp,
  AlertTriangle,
  Clock,
  Search,
  Building
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Campaign } from "@/data/mockCampaigns";

interface FilterBarProps {
  activeFilter: string;
  activeStatusFilter?: string;
  activeCampaign?: string;
  campaigns?: Campaign[];
  onFilterChange: (filter: string) => void;
  onStatusFilterChange?: (filter: string) => void;
  onCampaignChange?: (campaignId: string) => void;
  onExportCSV: () => void;
}

export function FilterBar({ 
  activeFilter, 
  activeStatusFilter = "all",
  activeCampaign = "all",
  campaigns = [],
  onFilterChange, 
  onStatusFilterChange,
  onCampaignChange,
  onExportCSV 
}: FilterBarProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleStatusFilterChange = (value: string) => {
    if (onStatusFilterChange) {
      onStatusFilterChange(value);
    }
  };

  const handleCampaignChange = (value: string) => {
    if (onCampaignChange) {
      onCampaignChange(value);
    }
  };
  
  return (
    <div className="flex flex-wrap justify-between items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
      <div className="flex items-center gap-4 flex-grow flex-wrap">
        <div className="w-full max-w-[200px]">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full h-9"
            />
          </div>
        </div>
        
        <Select 
          value={activeCampaign} 
          onValueChange={handleCampaignChange}
        >
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue placeholder="Select campaign" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Campaigns</SelectLabel>
              <SelectItem value="all">
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-2 text-blue-500" />
                  All Campaigns
                </div>
              </SelectItem>
              {campaigns.map((campaign) => (
                <SelectItem key={campaign.id} value={campaign.id}>
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-blue-500" />
                    {campaign.name}
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        
        <ToggleGroup type="single" value={activeFilter} onValueChange={onFilterChange} variant="outline">
          <ToggleGroupItem value="all" aria-label="All leads" className="h-9 px-3">
            All
          </ToggleGroupItem>
          <ToggleGroupItem value="calls" aria-label="Call leads" className="h-9 px-3">
            <Phone className="h-4 w-4 mr-2" />
            Calls
          </ToggleGroupItem>
          <ToggleGroupItem value="forms" aria-label="Form leads" className="h-9 px-3">
            <FileText className="h-4 w-4 mr-2" />
            Forms
          </ToggleGroupItem>
          <ToggleGroupItem value="facebook" aria-label="Facebook leads" className="h-9 px-3">
            <Facebook className="h-4 w-4 mr-2" />
            Facebook
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex items-center gap-2">
        <Popover open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium">Filter Options</h4>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Approval Status</label>
                <Select 
                  value={activeStatusFilter} 
                  onValueChange={handleStatusFilterChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Approval Status</SelectLabel>
                      <SelectItem value="all">All Leads</SelectItem>
                      <SelectItem value="pending">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-orange-500" />
                          Pending
                        </div>
                      </SelectItem>
                      <SelectItem value="approved">
                        <div className="flex items-center">
                          <ThumbsUp className="h-4 w-4 mr-2 text-green-500" />
                          Approved
                        </div>
                      </SelectItem>
                      <SelectItem value="disputed">
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                          Disputed
                        </div>
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Call Duration</label>
                <Select defaultValue="any">
                  <SelectTrigger>
                    <SelectValue placeholder="Any duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any duration</SelectItem>
                    <SelectItem value="short">Less than 30s</SelectItem>
                    <SelectItem value="medium">30s - 2min</SelectItem>
                    <SelectItem value="long">Over 2min</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setShowAdvancedFilters(false)} 
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => setShowAdvancedFilters(false)}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Apply Filters
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <Button variant="outline" size="sm" onClick={onExportCSV} className="h-9">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>
    </div>
  );
}
