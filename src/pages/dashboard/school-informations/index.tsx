import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import ProtectedPage from "@/features/auth/components/ProtectedPage";
import { SchoolInformationForm } from "@/features/school-information/components/SchoolInformationForm";
import { SchoolInformationType } from "@/features/school-information/types";
import { apiClient } from "@/lib/apiClient";
import { ReactElement, useState } from "react";

interface SchoolInformationPageProps {
  schoolInformation: SchoolInformationType;
}

export default function SchoolInformationPage({
  schoolInformation,
}: SchoolInformationPageProps) {
  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Informasi Sekolah", href: "/dashboard/school-informations" },
  ];
  const [schoolInformationData, setSchoolInformationData] =
    useState(schoolInformation);

  const fetchData = async () => {
    try {
      const response = await apiClient.get(`/school-informations`);
      setSchoolInformationData(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ProtectedPage>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="mt-6">
        <SchoolInformationForm
          initialData={schoolInformationData}
          refetch={fetchData}
        />
      </div>
    </ProtectedPage>
  );
}

export async function getServerSideProps() {
  try {
    const response = await apiClient.get(`/school-informations`);
    return {
      props: {
        schoolInformation: response.data.data,
      },
    };
  } catch {
    return { notFound: true };
  }
}

SchoolInformationPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <DashboardLayout>
      {page}
    </DashboardLayout>
  );
};