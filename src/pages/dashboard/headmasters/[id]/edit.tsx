import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import ProtectedPage from "@/features/auth/components/ProtectedPage";
import { HeadmasterForm } from "@/features/headmasters/components/HeadmasterForm";
import { HeadmasterDetailType } from "@/features/headmasters/types";
import { apiClient } from "@/lib/apiClient";
import { ReactElement } from "react";

interface EditHeadmasterPageProps {
  headmaster: HeadmasterDetailType;
}

export default function EditHeadmasterPage({
  headmaster,
}: EditHeadmasterPageProps) {
  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
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

export async function getServerSideProps(context: { params: { id: string } }) {
  const { id } = context.params;
  try {
    const response = await apiClient.get(`/headmasters/${id}`);
    return {
      props: {
        headmaster: response.data.data,
      },
    };
  } catch {
    return { notFound: true };
  }
}

EditHeadmasterPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <DashboardLayout>
      {page}
    </DashboardLayout>
  );
};