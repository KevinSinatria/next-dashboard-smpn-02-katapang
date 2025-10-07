import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useHeader } from "@/contexts/HeaderContext";
import { RolesDataTable } from "@/features/roles/components/RolesDataTable";
import { ReactElement, useEffect } from "react";

function RolesContent() {
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle("Kelola Roles");
  }, [setTitle]);

  return (
    <div>
      <div>
        <RolesDataTable />
      </div>
    </div>
  );
}

export default function RolesPage() {
  return (
    <RolesContent />
  );
}

RolesPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <DashboardLayout>
      {page}
    </DashboardLayout>
  );
};