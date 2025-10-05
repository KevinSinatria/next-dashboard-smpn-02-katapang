import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import ProtectedPage from "@/features/auth/components/ProtectedPage";
import { SchoolStatForm } from "@/features/school-stats/components/SchoolStatForm";

export default function NewSchoolStatPage() {
  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Statistik Sekolah", href: "/dashboard/school-stats" },
    { label: "Buat Baru" },
  ];
  
  return (
    <ProtectedPage>
      <DashboardLayout>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="mt-6">
          <SchoolStatForm />
        </div>
      </DashboardLayout>
    </ProtectedPage>
  );
}