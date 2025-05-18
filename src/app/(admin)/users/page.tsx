import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UsersTable from "@/hooks/tables/UsersTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Users management",
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="All Users" />
      <div className="space-y-6">
          <UsersTable />
      </div>
    </div>
  );
}
