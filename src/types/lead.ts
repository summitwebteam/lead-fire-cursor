
import { Json } from "@/integrations/supabase/types";

export interface Lead {
  id: string;
  campaign_id: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_name: string | null; // Making this a proper field, not optional
  created_at: string | null;
  duration: number | null;
  location_id: string;
  phone_number: string | null;
  qualified: boolean | null;
  approval_status: "pending" | "approved" | "disputed"; // Adding this property
  raw_data: Json | null;
  source: string;
  source_id: string;
  user_id: string | null;
  call_status?: string; // Optional field for call status
  device_type?: string; // Optional field for device type
  first_time?: boolean; // Optional field for first time contact
}
