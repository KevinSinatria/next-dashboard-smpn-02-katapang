import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import ProtectedPage from "@/features/auth/components/ProtectedPage";
import { PersonnelForm } from "@/features/personnels/components/PersonnelForm";
import { PersonnelDetailType } from "@/features/personnels/types";
import { apiClient } from "@/lib/apiClient";

interface EditPersonnelPageProps {
    personnel: PersonnelDetailType;
}

export default function EditPersonnelPage({ personnel }: EditPersonnelPageProps) {
  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Personnels", href: "/dashboard/personnels" },
    { label: `Edit: ${personnel.name}` },
  ];

  return (
    <ProtectedPage>
      <DashboardLayout>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="mt-6">
          <PersonnelForm initialData={personnel} />
        </div>
      </DashboardLayout>
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
