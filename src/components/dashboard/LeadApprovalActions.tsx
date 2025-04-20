
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, AlertCircle, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface LeadApprovalActionsProps {
  leadId: string;
  initialStatus?: "pending" | "approved" | "disputed";
  onStatusChange: (leadId: string, status: "approved" | "disputed", reason?: string) => void;
  isDisabled?: boolean;
}

export function LeadApprovalActions({ 
  leadId, 
  initialStatus = "pending", 
  onStatusChange,
  isDisabled = false
}: LeadApprovalActionsProps) {
  const [status, setStatus] = useState<"pending" | "approved" | "disputed">(initialStatus);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");

  const handleApprove = () => {
    if (isDisabled) return;
    
    setStatus("approved");
    onStatusChange(leadId, "approved");
    toast({
      title: "Lead Approved",
      description: "This lead has been marked as qualified."
    });
  };

  const handleOpenDisputeModal = () => {
    if (isDisabled) return;
    setIsDisputeModalOpen(true);
  };

  const handleDisputeSubmit = () => {
    if (!disputeReason.trim()) {
      toast({
        title: "Dispute reason required",
        description: "Please provide a reason for disputing this lead.",
        variant: "destructive",
      });
      return;
    }

    setStatus("disputed");
    onStatusChange(leadId, "disputed", disputeReason);
    setIsDisputeModalOpen(false);
    setDisputeReason("");
    
    toast({
      title: "Lead Disputed",
      description: "This lead has been marked as disputed."
    });
  };

  if (isDisabled) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center text-amber-700 bg-amber-50 px-2 py-1 rounded text-xs">
              <Info className="h-3.5 w-3.5 mr-1" />
              Auto-Filtered
              <span className="sr-only">Lead automatically filtered as repeat within 30 days</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>This lead was automatically filtered out as a repeat within 30 days</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <>
      <div className="flex space-x-2">
        {status === "pending" && (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center text-green-600 border-green-600 hover:bg-green-50"
              onClick={handleApprove}
            >
              <Check className="h-3.5 w-3.5 mr-1" />
              Approve
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center text-red-600 border-red-600 hover:bg-red-50"
              onClick={handleOpenDisputeModal}
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Dispute
            </Button>
          </>
        )}
        
        {status === "approved" && (
          <span className="px-2 py-1 rounded text-xs flex items-center bg-green-100 text-green-800">
            <Check className="h-3 w-3 mr-1" />
            Approved
          </span>
        )}
        
        {status === "disputed" && (
          <span className="px-2 py-1 rounded text-xs flex items-center bg-red-100 text-red-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            Disputed
          </span>
        )}
      </div>

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
    </>
  );
}
