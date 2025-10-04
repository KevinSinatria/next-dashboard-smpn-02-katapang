import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useHeader } from "@/contexts/HeaderContext";
import { PersonnelsDataTable } from "@/features/personnels/components/PersonnelsDataTable";
import { useEffect } from "react";

function PersonnelsContent() {
  const { setTitle } = useHeader();
  useEffect(() => {
    setTitle("Kelola Personil");
  }, [setTitle]);

  return (
    <div>
      <PersonnelsDataTable />
    </div>
  );
}

export default function PersonnelsPage() {
  return (
    <DashboardLayout>
      <PersonnelsContent />
    </DashboardLayout>
  );
}
