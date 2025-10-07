import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import ProtectedPage from "@/features/auth/components/ProtectedPage";
import { RoleForm } from "@/features/roles/components/RoleForm";
import { RoleType } from "@/features/roles/types";
import { apiClient } from "@/lib/apiClient";
import { ReactElement } from "react";

interface EditRolePageProps {
  role: RoleType;
}

export default function EditRolePage({ role }: EditRolePageProps) {
  const breadcrumbItems = [
    { label: "Roles", href: "/dashboard/roles" },
    { label: `Edit: ${role.name}` },
  ];

  return (
    <ProtectedPage>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="mt-6">
        <RoleForm initialData={role} />
      </div>
    </ProtectedPage>
  );
}

export async function getServerSideProps(context: { params: { id: string } }) {
  const { id } = context.params;
  try {
    const response = await apiClient.get(`/roles/${id}`);
    return {
      props: {
        role: response.data.data,
      },
    };
  } catch {
    return { notFound: true };
  }
}

EditRolePage.getLayout = function getLayout(page: ReactElement) {
  return (
    <DashboardLayout>
      {page}
    </DashboardLayout>
  );
};