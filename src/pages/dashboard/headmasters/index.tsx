import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useHeader } from "@/contexts/HeaderContext";
import { HeadmastersDataTable } from "@/features/headmasters/components/HeadmastersDataTable";
import { ReactElement, useEffect } from "react";

function HeadmastersContent() {
  const { setTitle } = useHeader();
  useEffect(() => {
    setTitle("Kelola Kepala Sekolah");
  }, [setTitle]);

  return (
    <div>
      <div>
        <HeadmastersDataTable />
      </div>
    </div>
  );
}

export default function HeadmastersPage() {
  return (
    <HeadmastersContent />
  );
}

HeadmastersPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <DashboardLayout>
      {page}
    </DashboardLayout>
  );
};