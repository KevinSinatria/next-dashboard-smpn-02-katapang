import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useHeader } from "@/contexts/HeaderContext";
import ProtectedPage from "@/features/auth/components/ProtectedPage";
import { SchoolInformationForm } from "@/features/school-information/components/SchoolInformationForm";
import { SchoolInformationType } from "@/features/school-information/types";
import { apiClient } from "@/lib/apiClient";
import { ReactElement, useEffect, useState } from "react";

export default function SchoolInformationPage() {
  const [schoolInformation, setSchoolInformation] = useState<SchoolInformationType | null>(null);
  const [loading, setLoading] = useState(true);
  const {setTitle} = useHeader();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setTitle("Kelola informasi sekolah")
  })

  const fetchData = async () => {
    try {
      const response = await apiClient.get(`/school-informations`);
      setSchoolInformation(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!schoolInformation) {
    return <div>Data tidak ditemukan</div>;
  }

  return (
    <ProtectedPage>
      <div>
        <SchoolInformationForm
          initialData={schoolInformation}
          refetch={fetchData}
        />
      </div>
    </ProtectedPage>
  );
}

SchoolInformationPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <DashboardLayout>
      {page}
    </DashboardLayout>
  );
};