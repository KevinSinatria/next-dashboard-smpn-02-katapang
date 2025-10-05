import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import ProtectedPage from "@/features/auth/components/ProtectedPage";
import { RoleForm } from "@/features/roles/components/RoleForm";
import { ReactElement } from "react";

export default function NewRolePage() {
  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Roles", href: "/dashboard/roles" },
    { label: "Buat Baru" },
  ];
  
  return (
    <ProtectedPage>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="mt-6">
        <RoleForm />
      </div>
    </ProtectedPage>
  );
}

NewRolePage.getLayout = function getLayout(page: ReactElement) {
  return (
    <DashboardLayout>
      {page}
    </DashboardLayout>
  );
};
