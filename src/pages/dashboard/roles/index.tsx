import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {  useHeader } from "@/contexts/HeaderContext";
import { RolesDataTable } from "@/features/roles/components/RolesDataTable";
import { useEffect } from "react";

function RolesContent () {
  const { setTitle } = useHeader();

   useEffect(() => {
    setTitle("Kelola Roles");
  }, [setTitle]);
  return (
      <div>
          <RolesDataTable />
      </div>
  )
}

export default function RolesPage() {
  return <DashboardLayout><RolesContent /></DashboardLayout>;
}
