
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Settings, Bell, User, Shield, CreditCard, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";

const CampaignSettings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [browserNotifications, setBrowserNotifications] = useState(false);
  const [autoApproveLeads, setAutoApproveLeads] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load campaign data
  useEffect(() => {
    const fetchCampaign = async () => {
      setLoading(true);
      // Mock data for development
      setTimeout(() => {
        setCampaign({
          id,
          name: `Campaign ${id}`,
          description: "This is a sample campaign for testing",
          source_types: ["call", "form"],
          status: "active",
          created_at: new Date().toISOString(),
          auto_approve: false,
          repeat_call_window: 30,
          min_call_duration: 60,
          notificationSettings: {
            email: true,
            browser: false,
            events: ["lead_disputed", "lead_approved"]
          }
        });
        
        // Set states based on loaded campaign
        setAutoApproveLeads(campaign?.auto_approve || false);
        setEmailNotifications(campaign?.notificationSettings?.email || true);
        setBrowserNotifications(campaign?.notificationSettings?.browser || false);
        
        setLoading(false);
      }, 500);
    };

    fetchCampaign();
  }, [id]);

  const handleSaveSettings = () => {
    setSaving(true);
    // Simulate saving settings
    setTimeout(() => {
      setSaving(false);
      toast.success("Campaign settings saved successfully");
    }, 800);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="container mx-auto">
          <div className="flex items-center mb-8">
            <Button variant="ghost" onClick={() => navigate(`/campaigns/${id}`)} className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Campaign
            </Button>
          </div>
          <div className="h-32 bg-white rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate(`/campaigns/${id}`)} className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Campaign
            </Button>
            <h1 className="text-3xl font-bold">{campaign?.name} Settings</h1>
          </div>
        </div>

        <Tabs defaultValue="general" className="w-full space-y-6">
          <TabsList className="mb-6">
            <TabsTrigger value="general">
              <Settings className="mr-2 h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="billing">
              <CreditCard className="mr-2 h-4 w-4" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="access">
              <User className="mr-2 h-4 w-4" />
              Access
            </TabsTrigger>
            <TabsTrigger value="integration">
              <Shield className="mr-2 h-4 w-4" />
              Integration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Details</CardTitle>
                <CardDescription>
                  Edit your campaign information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input id="name" defaultValue={campaign?.name} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" defaultValue={campaign?.description} />
                </div>
                
                <div className="flex items-center justify-between mt-6">
                  <div className="space-y-0.5">
                    <Label htmlFor="status">Campaign Status</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable or disable this campaign.
                    </p>
                  </div>
                  <Switch
                    id="status"
                    checked={campaign?.status === "active"}
                    onCheckedChange={(checked) => {
                      setCampaign({...campaign, status: checked ? "active" : "inactive"});
                    }}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Lead Management</CardTitle>
                <CardDescription>
                  Configure how leads are processed in this campaign.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-approve">Auto Approve Leads</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically approve leads that pass your filter rules.
                    </p>
                  </div>
                  <Switch
                    id="auto-approve"
                    checked={autoApproveLeads}
                    onCheckedChange={setAutoApproveLeads}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Repeat Call Window</Label>
                    <p className="text-sm text-muted-foreground">
                      Number of days to check for repeat calls.
                    </p>
                  </div>
                  <Input 
                    type="number" 
                    className="w-20" 
                    defaultValue={campaign?.repeat_call_window || 30} 
                    min="1" 
                    max="365"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Call Duration Threshold</Label>
                    <p className="text-sm text-muted-foreground">
                      Minimum call duration in seconds to qualify a lead.
                    </p>
                  </div>
                  <Input 
                    type="number" 
                    className="w-20" 
                    defaultValue={campaign?.min_call_duration || 60} 
                    min="1" 
                    max="3600"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Notifications</CardTitle>
                <CardDescription>
                  Control how and when you receive notifications for this campaign.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications for this campaign's events.
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="browser-notifications">Browser Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive browser notifications for this campaign.
                    </p>
                  </div>
                  <Switch
                    id="browser-notifications"
                    checked={browserNotifications}
                    onCheckedChange={setBrowserNotifications}
                  />
                </div>
                
                <div className="mt-6">
                  <Label className="mb-2 block">Notification Events</Label>
                  <div className="space-y-2">
                    {["Lead disputed", "Lead approved", "New form submission", "New call received"].map((event) => (
                      <div key={event} className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id={event.replace(/\s+/g, '-').toLowerCase()} 
                          defaultChecked={campaign?.notificationSettings?.events?.includes(
                            event.replace(/\s+/g, '_').toLowerCase()
                          )} 
                          className="rounded border-gray-300" 
                        />
                        <label htmlFor={event.replace(/\s+/g, '-').toLowerCase()} className="text-sm">{event}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Weekly Reports</CardTitle>
                <CardDescription>
                  Configure automated reports for this campaign.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="weekly-report">Weekly Campaign Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Send automated weekly reports for this campaign.
                    </p>
                  </div>
                  <Switch
                    id="weekly-report"
                    defaultChecked={true}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="report-recipients">Email Recipients</Label>
                  <Input id="report-recipients" placeholder="email@example.com, client@company.com" />
                  <p className="text-sm text-muted-foreground">
                    Separate multiple email addresses with commas.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Billing</CardTitle>
                <CardDescription>
                  Configure billing settings for this campaign.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="billing-model">Billing Model</Label>
                  <select id="billing-model" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option>Per Lead</option>
                    <option>Fixed Monthly</option>
                    <option>Pre-paid Credits</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lead-price">Lead Price</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                      $
                    </span>
                    <Input id="lead-price" type="number" defaultValue="10.00" min="0" step="0.01" className="rounded-l-none" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="billing-cycle">Billing Cycle</Label>
                  <select id="billing-cycle" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option>Weekly</option>
                    <option>Bi-weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
                <CardDescription>
                  Client details for billing purposes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="client-name">Client Name</Label>
                  <Input id="client-name" defaultValue="Acme Corp" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="client-email">Client Email</Label>
                  <Input id="client-email" type="email" defaultValue="billing@acme.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="client-address">Billing Address</Label>
                  <Textarea id="client-address" defaultValue="123 Business St, Suite 100, New York, NY 10001" />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="access" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Access</CardTitle>
                <CardDescription>
                  Manage who can access this campaign.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <Label>Team Members</Label>
                  <div className="border rounded-md divide-y">
                    {["Alex Smith", "Jamie Taylor", "Sam Wilson"].map((member) => (
                      <div key={member} className="flex items-center justify-between p-4">
                        <div>
                          <p className="font-medium">{member}</p>
                          <p className="text-sm text-muted-foreground">{member.toLowerCase().replace(' ', '.')}@youragency.com</p>
                        </div>
                        <select className="h-8 rounded-md border border-input bg-background px-2 text-xs">
                          <option>Admin</option>
                          <option>Editor</option>
                          <option>Viewer</option>
                        </select>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Team Member
                  </Button>
                </div>
                
                <div className="space-y-2 mt-6">
                  <Label>Client Access</Label>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="font-medium">Enable Client Portal</p>
                      <p className="text-sm text-muted-foreground">
                        Allow client to view and approve leads.
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="mt-4 p-4 border rounded-md">
                    <p className="font-medium">Client Portal Link</p>
                    <div className="flex mt-2">
                      <Input 
                        value="https://app.leadfire.com/client/abc123" 
                        readOnly 
                        className="font-mono text-sm rounded-r-none"
                      />
                      <Button 
                        variant="outline" 
                        className="rounded-l-none" 
                        onClick={() => {
                          navigator.clipboard.writeText("https://app.leadfire.com/client/abc123");
                          toast.success("Link copied to clipboard");
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" size="sm">
                        Send Invite Email
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="integration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>HighLevel Integration</CardTitle>
                <CardDescription>
                  Connect this campaign to your HighLevel account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <div className="flex">
                    <Input 
                      id="webhook-url" 
                      value="https://api.leadfire.com/webhook/campaign-123" 
                      readOnly 
                      className="font-mono text-sm rounded-r-none"
                    />
                    <Button 
                      variant="outline" 
                      className="rounded-l-none" 
                      onClick={() => {
                        navigator.clipboard.writeText("https://api.leadfire.com/webhook/campaign-123");
                        toast.success("Webhook URL copied to clipboard");
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Use this webhook URL in HighLevel to send form submissions to this campaign.
                  </p>
                </div>
                
                <div className="space-y-2 pt-4">
                  <Label>Source Settings</Label>
                  <div className="border rounded-md p-4">
                    <p className="text-sm font-medium">Forms Connected</p>
                    <div className="mt-2 space-y-2">
                      {campaign?.source_types.includes("form") ? (
                        ["Contact Form", "Lead Capture Form"].map((form) => (
                          <div key={form} className="flex items-center justify-between bg-muted p-2 rounded-md">
                            <span>{form}</span>
                            <Button variant="ghost" size="sm" className="h-6 text-red-500 hover:text-red-700 p-0">
                              Remove
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No forms connected yet.</p>
                      )}
                    </div>
                    <Button variant="outline" size="sm" className="mt-3">
                      <Plus className="h-3 w-3 mr-2" />
                      Connect Form
                    </Button>
                  </div>
                  
                  <div className="border rounded-md p-4 mt-4">
                    <p className="text-sm font-medium">Phone Numbers Connected</p>
                    <div className="mt-2 space-y-2">
                      {campaign?.source_types.includes("call") ? (
                        ["+1 (555) 123-4567", "+1 (555) 987-6543"].map((phone) => (
                          <div key={phone} className="flex items-center justify-between bg-muted p-2 rounded-md">
                            <span>{phone}</span>
                            <Button variant="ghost" size="sm" className="h-6 text-red-500 hover:text-red-700 p-0">
                              Remove
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No phone numbers connected yet.</p>
                      )}
                    </div>
                    <Button variant="outline" size="sm" className="mt-3">
                      <Plus className="h-3 w-3 mr-2" />
                      Connect Phone Number
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CampaignSettings;
