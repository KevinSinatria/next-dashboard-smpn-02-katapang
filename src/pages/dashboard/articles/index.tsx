import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useHeader } from "@/contexts/HeaderContext";
import { ArticlesDataTable } from "@/features/articles/components/ArticlesDataTable";
import { ReactElement, useEffect } from "react";

function ArticlesContent() {
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle("Kelola Artikel");
  }, [setTitle]);

  return (
    <div>
      <div>
        <ArticlesDataTable />
      </div>
    </div>
  );
}

export default function ArticlesPage() {
  return <ArticlesContent />;
}

ArticlesPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
