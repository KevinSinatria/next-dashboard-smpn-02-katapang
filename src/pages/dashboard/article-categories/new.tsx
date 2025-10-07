import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import ProtectedPage from "@/features/auth/components/ProtectedPage";
import { ArticleCategoryForm } from "@/features/article-categories/components/ArticleCategoryForm";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ReactElement } from "react";

export default function NewArticleCategoryPage() {
  const breadcrumbItems = [
    { label: "Kategori Artikel", href: "/dashboard/article-categories" },
    { label: "Buat Baru" },
  ];
  
  return (
    <ProtectedPage>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="mt-6">
        <ArticleCategoryForm />
      </div>
    </ProtectedPage>
  );
}

NewArticleCategoryPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <DashboardLayout>
      {page}
    </DashboardLayout>
  );
};