import React, { useState } from 'react';
import { toast } from "sonner";
import { Settings, Bell, User, Shield, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

const SettingsPage = () => {
  const { user } = useAuth();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [browserNotifications, setBrowserNotifications] = useState(false);
  const [autoApproveLeads, setAutoApproveLeads] = useState(false);
  const [apiKey, setApiKey] = useState("•••••••••••••••••••••••••••••");
  const [saving, setSaving] = useState(false);

  const handleSaveSettings = () => {
    setSaving(true);
    // Simulate saving settings
    setTimeout(() => {
      setSaving(false);
      toast.success("Settings saved successfully");
    }, 800);
  };

  const handleResetAPIKey = () => {
    // Simulate API key reset
    setTimeout(() => {
      setApiKey("hl_" + Math.random().toString(36).substring(2, 15));
      toast.success("API key reset successfully");
    }, 500);
  };

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="general">
            <Settings className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="account">
            <User className="mr-2 h-4 w-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="api">
            <Shield className="mr-2 h-4 w-4" />
            API
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure general application settings.
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
                  <Label htmlFor="theme">Timezone</Label>
                  <p className="text-sm text-muted-foreground">
                    Set your preferred timezone for reporting.
                  </p>
                </div>
                <select className="flex h-10 w-64 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option>America/New_York (EDT)</option>
                  <option>America/Chicago (CDT)</option>
                  <option>America/Denver (MDT)</option>
                  <option>America/Los_Angeles (PDT)</option>
                  <option>UTC</option>
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
              <CardTitle>Lead Management</CardTitle>
              <CardDescription>
                Configure how leads are processed in the system.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Default Repeat Call Window</Label>
                  <p className="text-sm text-muted-foreground">
                    Default number of days to check for repeat calls.
                  </p>
                </div>
                <Input 
                  type="number" 
                  className="w-20" 
                  defaultValue="30" 
                  min="1" 
                  max="365"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Default Call Duration Threshold</Label>
                  <p className="text-sm text-muted-foreground">
                    Minimum call duration in seconds to qualify a lead.
                  </p>
                </div>
                <Input 
                  type="number" 
                  className="w-20" 
                  defaultValue="60" 
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
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Control how and when you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications for important events.
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
                    Receive browser notifications when you're online.
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
                  {["Lead disputed", "Campaign created", "Lead approved", "New form submission", "New call received"].map((event) => (
                    <div key={event} className="flex items-center space-x-2">
                      <input type="checkbox" id={event.replace(/\s+/g, '-').toLowerCase()} defaultChecked className="rounded border-gray-300" />
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
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Manage your account details and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue={user?.email?.split('@')[0] || "User"} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue={user?.email || "user@example.com"} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" defaultValue="Your Agency" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleSaveSettings} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your account password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Change Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
              <CardDescription>
                Manage your API keys and integration settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">HighLevel API Key</Label>
                <div className="flex">
                  <Input 
                    id="api-key" 
                    value={apiKey} 
                    readOnly 
                    className="font-mono text-sm rounded-r-none"
                  />
                  <Button 
                    variant="outline" 
                    className="rounded-l-none" 
                    onClick={() => {
                      navigator.clipboard.writeText(apiKey);
                      toast.success("API key copied to clipboard");
                    }}
                  >
                    Copy
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Your API key is used to authenticate requests to the HighLevel API.
                </p>
              </div>
              
              <div className="space-y-2 pt-4">
                <Button variant="outline" onClick={handleResetAPIKey}>
                  Reset API Key
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Resetting your API key will invalidate your current key. Any applications
                  using this key will need to be updated.
                </p>
              </div>
              
              <div className="space-y-2 pt-4">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input id="webhook-url" defaultValue="https://your-app.com/api/webhook" />
                <p className="text-sm text-muted-foreground mt-2">
                  This URL will receive webhook events from HighLevel.
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
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>
                Manage your billing information and subscription details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-md">
                <div className="flex justify-between mb-2">
                  <div className="font-semibold">Current Plan</div>
                  <div className="text-primary">Professional</div>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <div>Next billing date</div>
                  <div>May 15, 2025</div>
                </div>
              </div>
              
              <div className="space-y-2 pt-4">
                <Label>Payment Method</Label>
                <div className="flex items-center space-x-4 p-4 border rounded-md">
                  <div className="h-10 w-16 bg-muted rounded flex items-center justify-center">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-medium">Visa ending in 4242</div>
                    <div className="text-sm text-muted-foreground">Expires 12/2025</div>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-auto">
                    Update
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2 pt-4">
                <Label>Billing Address</Label>
                <div className="p-4 border rounded-md">
                  <p>Your Agency Inc.</p>
                  <p>123 Marketing St</p>
                  <p>San Francisco, CA 94107</p>
                  <p>United States</p>
                  <Button variant="ghost" size="sm" className="mt-2 px-0">
                    Edit Address
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View Billing History</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
