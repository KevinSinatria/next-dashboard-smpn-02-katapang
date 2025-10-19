import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useHeader } from "@/contexts/HeaderContext";
import { UsersDataTable } from "@/features/users/components/UserDataTable";
import { ReactElement, useEffect } from "react";

function UsersContent() {
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle("Kelola Users");
  }, [setTitle]);

  return (
    <div>
      <div>
        <UsersDataTable />
      </div>
    </div>
  );
}

export default function UsersPage() {
  return <UsersContent />;
}

UsersPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
