import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useHeader } from "@/contexts/HeaderContext";
import { HeadmastersDataTable } from "@/features/headmasters/components/HeadmastersDataTable";
import { useEffect } from "react";

function HeadmastersContent() {
  const { setTitle } = useHeader();
  useEffect(() => {
    setTitle("Kelola Kepala Sekolah");
  }, [setTitle]);

  return (
    <div>
      <HeadmastersDataTable />
    </div>
  );
}

export default function HeadmastersPage() {
  return (
    <DashboardLayout>
      <HeadmastersContent />
    </DashboardLayout>
  );
}
