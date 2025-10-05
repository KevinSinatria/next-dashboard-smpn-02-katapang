import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useHeader } from "@/contexts/HeaderContext";
import { SchoolStatsDataTable } from "@/features/school-stats/components/SchoolStatsDataTable";
import { ReactElement, useEffect } from "react";

function SchoolStatsContent() {
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle("Kelola Statistik Sekolah");
  }, [setTitle]);
  
  return (
    <div>
      <SchoolStatsDataTable />
    </div>
  );
}

export default function SchoolStatsPage() {
  return (
    <SchoolStatsContent />
  );
}

SchoolStatsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <DashboardLayout>
      {page}
    </DashboardLayout>
  );
};