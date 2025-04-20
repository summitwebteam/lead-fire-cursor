
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Phone, FileText, Clock, RefreshCcw } from "lucide-react";

interface CampaignFilterRulesProps {
  campaignId: string;
  onSave: (filters: any) => void;
  initialFilters?: any;
}

export function CampaignFilterRules({ campaignId, onSave, initialFilters = {} }: CampaignFilterRulesProps) {
  const [filters, setFilters] = useState({
    minCallDuration: initialFilters.minCallDuration || 30,
    callTypes: initialFilters.callTypes || ["answered"],
    requireEmail: initialFilters.requireEmail || false,
    requirePhone: initialFilters.requirePhone || true,
    excludeRepeatCallers: initialFilters.excludeRepeatCallers || true, // Now default to true
    repeatThresholdDays: initialFilters.repeatThresholdDays || 30, // Default to 30 days
  });

  const handleSave = () => {
    onSave(filters);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Lead Qualification Rules</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-blue-500" />
                <Label htmlFor="call-duration">Minimum Call Duration</Label>
              </div>
              <span className="text-sm font-medium">{filters.minCallDuration} seconds</span>
            </div>
            <Slider
              id="call-duration"
              min={0}
              max={120}
              step={5}
              value={[filters.minCallDuration]}
              onValueChange={(value) => setFilters({ ...filters, minCallDuration: value[0] })}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Only count calls longer than this duration as qualified leads
            </p>
          </div>

          <Separator />

          <div>
            <div className="flex items-center mb-2">
              <Phone className="w-4 h-4 mr-2 text-blue-500" />
              <Label htmlFor="call-types">Call Types to Include</Label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {["answered", "missed", "voicemail"].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Switch
                    id={`call-type-${type}`}
                    checked={filters.callTypes.includes(type)}
                    onCheckedChange={(checked) => {
                      const newTypes = checked
                        ? [...filters.callTypes, type]
                        : filters.callTypes.filter((t: string) => t !== type);
                      setFilters({ ...filters, callTypes: newTypes });
                    }}
                  />
                  <Label htmlFor={`call-type-${type}`} className="capitalize">{type}</Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center mb-2">
              <FileText className="w-4 h-4 mr-2 text-green-500" />
              <Label>Form Submission Rules</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="require-email"
                checked={filters.requireEmail}
                onCheckedChange={(checked) => setFilters({ ...filters, requireEmail: checked })}
              />
              <Label htmlFor="require-email">Require Email Address</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="require-phone"
                checked={filters.requirePhone}
                onCheckedChange={(checked) => setFilters({ ...filters, requirePhone: checked })}
              />
              <Label htmlFor="require-phone">Require Phone Number</Label>
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-center mb-2">
              <RefreshCcw className="w-4 h-4 mr-2 text-amber-500" />
              <Label>Repeat Lead Handling</Label>
            </div>
            
            <div className="flex items-center space-x-2 mb-4">
              <Switch
                id="exclude-repeat"
                checked={filters.excludeRepeatCallers}
                onCheckedChange={(checked) => setFilters({ ...filters, excludeRepeatCallers: checked })}
              />
              <Label htmlFor="exclude-repeat">
                Exclude Repeat Contacts
                <span className="block text-xs text-muted-foreground">
                  Automatically filter out repeat leads
                </span>
              </Label>
            </div>

            <div className={filters.excludeRepeatCallers ? "ml-7" : "ml-7 opacity-50"}>
              <Label htmlFor="threshold-days" className="mb-1 block text-sm">
                Repeat threshold period
              </Label>
              <div className="flex items-center gap-2">
                <Select
                  value={filters.repeatThresholdDays.toString()}
                  onValueChange={(value) => setFilters({ ...filters, repeatThresholdDays: parseInt(value) })}
                  disabled={!filters.excludeRepeatCallers}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Days" />
                  </SelectTrigger>
                  <SelectContent>
                    {[7, 14, 30, 60, 90].map((days) => (
                      <SelectItem key={days} value={days.toString()}>
                        {days} days
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm">days</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Leads from the same contact within this period will not qualify
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button onClick={handleSave} className="w-full">
            <Check className="w-4 h-4 mr-2" />
            Save Filter Rules
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
