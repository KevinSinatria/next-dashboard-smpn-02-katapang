import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import ProtectedPage from "@/features/auth/components/ProtectedPage";
import { RoleForm } from "@/features/roles/components/RoleForm";
import { RoleType } from "@/features/roles/types";
import { apiClient } from "@/lib/apiClient";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";

export default function EditRolePage() {
  const router = useRouter();
  const { id } = router.query;
  const [role, setRole] = useState<RoleType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchRole();
    }
  }, [id]);

  const fetchRole = async () => {
    try {
      const response = await apiClient.get(`/roles/${id}`);
      setRole(response.data.data);
    } catch (error) {
      console.error(error);
      router.push('/404');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!role) {
    return <div>Data tidak ditemukan</div>;
  }

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

EditRolePage.getLayout = function getLayout(page: ReactElement) {
  return (
    <DashboardLayout>
      {page}
    </DashboardLayout>
  );
};