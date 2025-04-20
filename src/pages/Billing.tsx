
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

const Billing = () => {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">Billing & Payments</h1>
      <p className="text-muted-foreground">
        Manage your billing settings, view invoices, and track payments.
      </p>
      
      <Card>
        <CardHeader>
          <CardTitle>Billing Management</CardTitle>
          <CardDescription>
            This page is under construction. Soon you'll be able to manage billing and payment information here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40 bg-muted/30 rounded-md">
            <div className="flex flex-col items-center gap-2">
              <DollarSign className="h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground">Billing features coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Billing;
