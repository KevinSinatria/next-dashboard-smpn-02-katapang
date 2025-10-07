import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import ProtectedPage from "@/features/auth/components/ProtectedPage";
import { PersonnelForm } from "@/features/personnels/components/PersonnelForm";
import { PersonnelDetailType } from "@/features/personnels/types";
import { apiClient } from "@/lib/apiClient";
import { ReactElement } from "react";

interface PersonnelDetailPageProps {
    personnel: PersonnelDetailType;
}

export default function PersonnelDetailPage({ personnel }: PersonnelDetailPageProps) {
  const breadcrumbItems = [
    { label: "Personil", href: "/dashboard/personnels" },
    { label: `Detail: ${personnel.name}` },
  ];

  return (
    <ProtectedPage>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="mt-6">
        <PersonnelForm initialData={personnel} readOnly={true} />
      </div>
    </ProtectedPage>
  );
}

export async function getServerSideProps(context: { params: { id: string } }) {
  const { id } = context.params;
  try {
    const response = await apiClient.get(`/personnel/${id}`);
    return {
      props: {
        personnel: response.data.data,
      },
    };
  } catch {
    return { notFound: true };
  }
}

PersonnelDetailPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <DashboardLayout>
      {page}
    </DashboardLayout>
  );
};