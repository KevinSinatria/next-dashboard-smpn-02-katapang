import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useHeader } from "@/contexts/HeaderContext";
import { ArticleCategoriesDataTable } from "@/features/article-categories/components/ArticleCategoriesDataTable";
import { ReactElement, useEffect } from "react";

function ArticleCategoriesContent() {
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle("Kelola Kategori Artikel");
  }, [setTitle]);

  return (
    <div>
      <div>
        <ArticleCategoriesDataTable />
      </div>
    </div>
  );
}

export default function ArticleCategoriesPage() {
  return (
    <ArticleCategoriesContent />
  );
}

ArticleCategoriesPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <DashboardLayout>
      {page}
    </DashboardLayout>
  );
};