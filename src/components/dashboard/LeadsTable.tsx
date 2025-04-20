
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Lead } from "@/types/lead";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Phone, FileText, Facebook, Clock } from "lucide-react";

interface LeadsTableProps {
  leads: Lead[];
  loading?: boolean;
  onApprove?: (leadId: string) => void;
  onDispute?: (leadId: string) => void;
}

export function LeadsTable({ 
  leads, 
  loading = false,
  onApprove,
  onDispute
}: LeadsTableProps) {
  // Function to display formatted date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return `${date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    })}, ${date.toLocaleTimeString("en-US", { 
      hour: "numeric", 
      minute: "numeric", 
      hour12: true 
    })}`;
  };
  
  // Function to render source icon based on source type
  const renderSourceIcon = (source: string) => {
    switch(source) {
      case "call":
        return <Phone className="h-4 w-4 mr-1" />;
      case "form":
        return <FileText className="h-4 w-4 mr-1" />;
      case "facebook":
        return <Facebook className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };
  
  // Function to render lead status badge
  const renderLeadStatusBadge = () => {
    return (
      <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
        New Lead
      </Badge>
    );
  };
  
  // Function to render call status
  const renderCallStatus = (lead: Lead) => {
    if (lead.call_status === "missed") {
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
          <Clock className="h-3 w-3 mr-1" /> Missed
        </Badge>
      );
    }
    return "N/A";
  };
  
  // Function to render approval status
  const renderApprovalStatus = (lead: Lead) => {
    switch (lead.approval_status) {
      case "approved":
        return (
          <span className="flex items-center text-green-600">
            <Check className="h-4 w-4 mr-1" /> Approved
          </span>
        );
      case "disputed":
        return (
          <span className="flex items-center text-red-600">
            <X className="h-4 w-4 mr-1" /> Disputed
          </span>
        );
      default:
        return (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center text-green-600 border-green-600 hover:bg-green-50"
              onClick={() => onApprove && onApprove(lead.id)}
            >
              <Check className="h-3.5 w-3.5 mr-1" />
              Approve
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center text-red-600 border-red-600 hover:bg-red-50"
              onClick={() => onDispute && onDispute(lead.id)}
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Dispute
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="relative w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date & Time</TableHead>
            <TableHead>Contact Name</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Call Status</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Lead Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                Loading leads...
              </TableCell>
            </TableRow>
          )}
          {!loading && leads.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                No leads found.
              </TableCell>
            </TableRow>
          )}
          {!loading &&
            leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>{formatDate(lead.created_at)}</TableCell>
                <TableCell className="font-medium">{lead.contact_name || "Unknown"}</TableCell>
                <TableCell>{lead.phone_number || lead.contact_phone || "N/A"}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {renderSourceIcon(lead.source)}
                    <span className="capitalize">{lead.source}</span>
                  </div>
                </TableCell>
                <TableCell>{renderCallStatus(lead)}</TableCell>
                <TableCell>
                  {lead.duration ? `${Math.floor(lead.duration / 60)}:${(lead.duration % 60).toString().padStart(2, '0')}` : "N/A"}
                </TableCell>
                <TableCell>{renderLeadStatusBadge()}</TableCell>
                <TableCell>{renderApprovalStatus(lead)}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
