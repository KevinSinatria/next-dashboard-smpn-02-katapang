import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import ProtectedPage from "@/features/auth/components/ProtectedPage";
import { PersonnelForm } from "@/features/personnels/components/PersonnelForm";

export default function NewPersonnelPage() {
  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Personnels", href: "/dashboard/personnels" },
    { label: "Buat Baru" },
  ];
  
  return (
    <ProtectedPage>
      <DashboardLayout>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="mt-6">
          <PersonnelForm />
        </div>
      </DashboardLayout>
    </ProtectedPage>
  );
}
