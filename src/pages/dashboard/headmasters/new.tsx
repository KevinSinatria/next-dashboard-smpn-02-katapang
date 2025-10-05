import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import ProtectedPage from "@/features/auth/components/ProtectedPage";
import { HeadmasterForm } from "@/features/headmasters/components/HeadmasterForm";
import { ReactElement } from "react";

export default function NewHeadmasterPage() {
  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Kepala Sekolah", href: "/dashboard/headmasters" },
    { label: "Buat Baru" },
  ];

  return (
    <ProtectedPage>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="mt-6">
        <HeadmasterForm />
      </div>
    </ProtectedPage>
  );
}

NewHeadmasterPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <DashboardLayout>
      {page}
    </DashboardLayout>
  );
};