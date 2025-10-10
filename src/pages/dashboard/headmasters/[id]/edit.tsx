import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import ProtectedPage from "@/features/auth/components/ProtectedPage";
import { HeadmasterForm } from "@/features/headmasters/components/HeadmasterForm";
import { HeadmasterDetailType } from "@/features/headmasters/types";
import { apiClient } from "@/lib/apiClient";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";

export default function EditHeadmasterPage() {
  const router = useRouter();
  const { id } = router.query;
  const [headmaster, setHeadmaster] = useState<HeadmasterDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchHeadmaster();
    }
  }, [id]);

  const fetchHeadmaster = async () => {
    try {
      const response = await apiClient.get(`/headmasters/${id}`);
      setHeadmaster(response.data.data);
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

  if (!headmaster) {
    return <div>Data tidak ditemukan</div>;
  }

  const breadcrumbItems = [
    { label: "Kepala Sekolah", href: "/dashboard/headmasters" },
    { label: `Edit: ${headmaster.name}` },
  ];

  return (
    <ProtectedPage>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="mt-6">
        <HeadmasterForm initialData={headmaster} />
      </div>
    </ProtectedPage>
  );
}

EditHeadmasterPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <DashboardLayout>
      {page}
    </DashboardLayout>
  );
};