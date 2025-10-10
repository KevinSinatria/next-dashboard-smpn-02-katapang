import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import ProtectedPage from "@/features/auth/components/ProtectedPage";
import { SchoolStatForm } from "@/features/school-stats/components/SchoolStatForm";
import { SchoolStatType } from "@/features/school-stats/types";
import { apiClient } from "@/lib/apiClient";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";

export default function EditSchoolStatPage() {
  const router = useRouter();
  const { id } = router.query;
  const [schoolStat, setSchoolStat] = useState<SchoolStatType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchSchoolStat();
    }
  }, [id]);

  const fetchSchoolStat = async () => {
    try {
      const response = await apiClient.get(`/school-stats/${id}`);
      setSchoolStat(response.data.data);
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

  if (!schoolStat) {
    return <div>Data tidak ditemukan</div>;
  }

  const breadcrumbItems = [
    { label: "Statistik Sekolah", href: "/dashboard/school-stats" },
    { label: `Edit: ${schoolStat.year}` },
  ];

  return (
    <ProtectedPage>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="mt-6">
        <SchoolStatForm initialData={schoolStat} />
      </div>
    </ProtectedPage>
  );
}

EditSchoolStatPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <DashboardLayout>
      {page}
    </DashboardLayout>
  );
};