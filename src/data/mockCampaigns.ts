
export type Campaign = {
  id: string;
  name: string;
  description: string;
  source_type: "form" | "call" | "facebook" | "survey";
  source_types?: string[]; // Add this new array property
  leads: number;
  status: "active" | "paused";
  created_at: string;
};

export const mockCampaigns: Campaign[] = [
  {
    id: "campaign-1",
    name: "Website Contact Form",
    description: "Leads captured from the website contact form",
    source_type: "form",
    source_types: ["form"], // Add source_types array
    leads: 42,
    status: "active",
    created_at: "2025-03-15T12:00:00Z"
  },
  {
    id: "campaign-2",
    name: "Google Ads Phone Calls",
    description: "Phone calls from Google Ads campaigns",
    source_type: "call",
    source_types: ["call"], // Add source_types array
    leads: 28,
    status: "active",
    created_at: "2025-03-10T09:30:00Z"
  },
  {
    id: "campaign-3",
    name: "Facebook Lead Generation",
    description: "Leads from Facebook lead gen forms",
    source_type: "facebook",
    source_types: ["facebook"], // Add source_types array
    leads: 17,
    status: "active",
    created_at: "2025-03-05T14:15:00Z"
  },
  {
    id: "campaign-4",
    name: "Customer Survey",
    description: "Responses from customer satisfaction survey",
    source_type: "survey",
    source_types: ["survey"], // Add source_types array
    leads: 53,
    status: "paused",
    created_at: "2025-02-28T11:45:00Z"
  }
];
