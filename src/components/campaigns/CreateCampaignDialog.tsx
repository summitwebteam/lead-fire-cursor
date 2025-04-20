
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Phone, Facebook, ClipboardList } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define the form schema with Zod
const formSchema = z.object({
  name: z.string().min(3, { message: "Campaign name must be at least 3 characters" }),
  description: z.string().min(5, { message: "Please provide a brief description" }),
  source_types: z.array(z.enum(["form", "call", "facebook", "survey"])).min(1, {
    message: "Select at least one source type",
  }),
  selectedForms: z.array(z.string()).optional(),
  selectedPhoneNumbers: z.array(z.string()).optional(),
  selectedSurveys: z.array(z.string()).optional(),
  status: z.enum(["active", "paused"]).default("active"),
});

type FormValues = z.infer<typeof formSchema>;

// Mock data for development
// In a real implementation, these would be fetched from HighLevel API
const mockHighLevelForms = [
  { id: "form-1", name: "Contact Form" },
  { id: "form-2", name: "Appointment Request" },
  { id: "form-3", name: "Newsletter Subscription" },
  { id: "form-4", name: "Job Application" },
];

const mockHighLevelPhoneNumbers = [
  { id: "phone-1", number: "+1 (555) 123-4567", label: "Main Office" },
  { id: "phone-2", number: "+1 (555) 987-6543", label: "Sales Team" },
  { id: "phone-3", number: "+1 (555) 555-5555", label: "Support Line" },
];

const mockHighLevelSurveys = [
  { id: "survey-1", name: "Customer Satisfaction" },
  { id: "survey-2", name: "Product Feedback" },
  { id: "survey-3", name: "Website Experience" },
];

interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateCampaign: (campaign: any) => void;
  isCreating?: boolean;
}

export function CreateCampaignDialog({ 
  open, 
  onOpenChange, 
  onCreateCampaign,
  isCreating = false
}: CreateCampaignDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      source_types: ["form"],
      selectedForms: [],
      selectedPhoneNumbers: [],
      selectedSurveys: [],
      status: "active",
    }
  });
  
  const sourceTypes = form.watch("source_types");
  
  // Reset selected items when source types change
  useEffect(() => {
    if (!sourceTypes.includes("form")) {
      form.setValue("selectedForms", []);
    }
    if (!sourceTypes.includes("call")) {
      form.setValue("selectedPhoneNumbers", []);
    }
    if (!sourceTypes.includes("survey")) {
      form.setValue("selectedSurveys", []);
    }
  }, [sourceTypes, form]);

  const onSubmit = (values: FormValues) => {
    // Prepare campaign data with selected resources
    const campaign = {
      name: values.name,
      description: values.description,
      source_types: values.source_types,
      status: values.status,
      // In a real implementation, we would also save these IDs to link them to the campaign
      form_ids: values.selectedForms,
      phone_number_ids: values.selectedPhoneNumbers,
    };
    
    onCreateCampaign(campaign);
  };

  const toggleSourceType = (checked: boolean, value: "form" | "call" | "facebook" | "survey") => {
    const currentValues = form.getValues("source_types");
    
    if (checked) {
      form.setValue("source_types", [...currentValues, value]);
    } else {
      form.setValue(
        "source_types",
        currentValues.filter((type) => type !== value),
        { shouldValidate: true }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Campaign</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Website Contact Form" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description of this campaign" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="source_types"
              render={() => (
                <FormItem className="space-y-3">
                  <FormLabel>Lead Sources (Select all that apply)</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50">
                        <Checkbox 
                          id="form" 
                          checked={sourceTypes.includes("form")}
                          onCheckedChange={(checked) => toggleSourceType(checked as boolean, "form")}
                        />
                        <Label htmlFor="form" className="flex items-center cursor-pointer">
                          <FileText className="h-4 w-4 text-blue-500 mr-2" />
                          Form Submissions
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50">
                        <Checkbox 
                          id="call" 
                          checked={sourceTypes.includes("call")}
                          onCheckedChange={(checked) => toggleSourceType(checked as boolean, "call")}
                        />
                        <Label htmlFor="call" className="flex items-center cursor-pointer">
                          <Phone className="h-4 w-4 text-green-500 mr-2" />
                          Phone Calls
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50">
                        <Checkbox 
                          id="facebook" 
                          checked={sourceTypes.includes("facebook")}
                          onCheckedChange={(checked) => toggleSourceType(checked as boolean, "facebook")}
                        />
                        <Label htmlFor="facebook" className="flex items-center cursor-pointer">
                          <Facebook className="h-4 w-4 text-blue-600 mr-2" />
                          Facebook Leads
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50">
                        <Checkbox 
                          id="survey" 
                          checked={sourceTypes.includes("survey")}
                          onCheckedChange={(checked) => toggleSourceType(checked as boolean, "survey")}
                        />
                        <Label htmlFor="survey" className="flex items-center cursor-pointer">
                          <ClipboardList className="h-4 w-4 text-purple-500 mr-2" />
                          Surveys
                        </Label>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* HighLevel Forms selector (visible when form is selected) */}
            {sourceTypes.includes("form") && (
              <FormField
                control={form.control}
                name="selectedForms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Forms from HighLevel</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-1 gap-2 border rounded-md p-3">
                        {mockHighLevelForms.map((formItem) => (
                          <div key={formItem.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={formItem.id}
                              checked={field.value?.includes(formItem.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...(field.value || []), formItem.id]);
                                } else {
                                  field.onChange(
                                    field.value?.filter((id) => id !== formItem.id) || []
                                  );
                                }
                              }}
                            />
                            <Label htmlFor={formItem.id}>{formItem.name}</Label>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* HighLevel Phone Numbers selector (visible when call is selected) */}
            {sourceTypes.includes("call") && (
              <FormField
                control={form.control}
                name="selectedPhoneNumbers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Phone Numbers from HighLevel</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-1 gap-2 border rounded-md p-3">
                        {mockHighLevelPhoneNumbers.map((phone) => (
                          <div key={phone.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={phone.id}
                              checked={field.value?.includes(phone.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...(field.value || []), phone.id]);
                                } else {
                                  field.onChange(
                                    field.value?.filter((id) => id !== phone.id) || []
                                  );
                                }
                              }}
                            />
                            <Label htmlFor={phone.id}>
                              {phone.label}: {phone.number}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* HighLevel Surveys selector (visible when survey is selected) */}
            {sourceTypes.includes("survey") && (
              <FormField
                control={form.control}
                name="selectedSurveys"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Surveys from HighLevel</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-1 gap-2 border rounded-md p-3">
                        {mockHighLevelSurveys.map((survey) => (
                          <div key={survey.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={survey.id}
                              checked={field.value?.includes(survey.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...(field.value || []), survey.id]);
                                } else {
                                  field.onChange(
                                    field.value?.filter((id) => id !== survey.id) || []
                                  );
                                }
                              }}
                            />
                            <Label htmlFor={survey.id}>{survey.name}</Label>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? 'Creating...' : 'Create Campaign'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
