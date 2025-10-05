import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import ProtectedPage from "@/features/auth/components/ProtectedPage";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { SchoolStatForm } from "@/features/school-stats/components/SchoolStatForm";
import { ReactElement } from "react";

export default function NewSchoolStatPage() {
  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Statistik Sekolah", href: "/dashboard/school-stats" },
    { label: "Buat Baru" },
  ];

  return (
    <ProtectedPage>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="mt-6">
        <SchoolStatForm />
      </div>
    </ProtectedPage>
  );
}

NewSchoolStatPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
