import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import ProtectedPage from "@/features/auth/components/ProtectedPage";
import { SchoolStatForm } from "@/features/school-stats/components/SchoolStatForm";
import { SchoolStatType } from "@/features/school-stats/types";
import { apiClient } from "@/lib/apiClient";
import { ReactElement } from "react";

interface EditSchoolStatPageProps {
  schoolStat: SchoolStatType;
}

export default function EditSchoolStatPage({ schoolStat }: EditSchoolStatPageProps) {
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

export async function getServerSideProps(context: { params: { id: string } }) {
  const { id } = context.params;
  try {
    const response = await apiClient.get(`/school-stats/${id}`);
    return {
      props: {
        schoolStat: response.data.data,
      },
    };
  } catch {
    return { notFound: true };
  }
}

EditSchoolStatPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <DashboardLayout>
      {page}
    </DashboardLayout>
  );
};