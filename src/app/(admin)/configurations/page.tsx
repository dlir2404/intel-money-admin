import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ConfigsTable from "@/components/tables/ConfigsTable";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Configurations",
}

export default function Configurations() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Configurations" />
            <div className="space-y-6">
                <ConfigsTable />
            </div>
        </div>
    );
}