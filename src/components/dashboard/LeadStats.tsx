
import { Card, CardContent } from "@/components/ui/card";
import { Phone, FileText, AlertTriangle, FileCheck } from "lucide-react";

interface LeadStatsProps {
  leadCount: number;
  callCount: number;
  submitCount: number;
  disputeCount: number;
}

export function LeadStats({ leadCount, callCount, submitCount, disputeCount }: LeadStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="flex items-center justify-between pt-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">LEADS</p>
            <h3 className="text-3xl font-bold">{leadCount}</h3>
          </div>
          <div className="bg-gray-100 p-3 rounded-full">
            <FileText className="h-6 w-6 text-blue-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex items-center justify-between pt-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">CALLS</p>
            <h3 className="text-3xl font-bold">{callCount}</h3>
          </div>
          <div className="bg-gray-100 p-3 rounded-full">
            <Phone className="h-6 w-6 text-blue-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex items-center justify-between pt-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">SUBMITS</p>
            <h3 className="text-3xl font-bold">{submitCount}</h3>
          </div>
          <div className="bg-gray-100 p-3 rounded-full">
            <FileCheck className="h-6 w-6 text-green-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex items-center justify-between pt-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">DISPUTES</p>
            <h3 className="text-3xl font-bold">{disputeCount}</h3>
          </div>
          <div className="bg-gray-100 p-3 rounded-full">
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
