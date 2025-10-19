import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import ProtectedPage from "@/features/auth/components/ProtectedPage";
import { UserForm } from "@/features/users/components/UserForm";
import { ReactElement } from "react";

export default function NewUserPage() {
  const breadcrumbItems = [
    { label: "Users", href: "/dashboard/users" },
    { label: "Buat Baru" },
  ];

  return (
    <ProtectedPage>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="mt-6">
        <UserForm />
      </div>
    </ProtectedPage>
  );
}

NewUserPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
