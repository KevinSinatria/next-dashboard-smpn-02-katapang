import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import ProtectedPage from "@/features/auth/components/ProtectedPage";
import { PersonnelForm } from "@/features/personnels/components/PersonnelForm";
import { ReactElement } from "react";

export default function NewPersonnelPage() {
  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Personnels", href: "/dashboard/personnels" },
    { label: "Buat Baru" },
  ];
  
  return (
    <ProtectedPage>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="mt-6">
        <PersonnelForm />
      </div>
    </ProtectedPage>
  );
}

NewPersonnelPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <DashboardLayout>
      {page}
    </DashboardLayout>
  );
};