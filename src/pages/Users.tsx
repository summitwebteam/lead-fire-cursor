
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Users = () => {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">Users & Access Management</h1>
      <p className="text-muted-foreground">
        Manage user accounts and control access to campaigns and features.
      </p>
      
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            This page is under construction. Soon you'll be able to manage users, roles, and permissions here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40 bg-muted/30 rounded-md">
            <p className="text-muted-foreground">User management features coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
