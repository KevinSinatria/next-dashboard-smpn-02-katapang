import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useHeader } from "@/contexts/HeaderContext";
import { ArticleCategoriesDataTable } from "@/features/article-categories/components/ArticleCategoriesDataTable";
import { useEffect } from "react";

function ArticleCategoriesContent() {
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle("Kelola Kategori Artikel");
  }, [setTitle]);
  
  return (
    <div>
      <ArticleCategoriesDataTable />
    </div>
  );
}

export default function ArticleCategoriesPage() {
  return (
    <DashboardLayout>
      <ArticleCategoriesContent />
    </DashboardLayout>
  );
}