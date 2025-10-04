import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import ProtectedPage from "@/features/auth/components/ProtectedPage";
import { ArticleCategoryForm } from "@/features/article-categories/components/ArticleCategoryForm";

export default function NewArticleCategoryPage() {
  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Kategori Artikel", href: "/dashboard/article-categories" },
    { label: "Buat Baru" },
  ];
  
  return (
    <ProtectedPage>
      <DashboardLayout>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="mt-6">
          <ArticleCategoryForm />
        </div>
      </DashboardLayout>
    </ProtectedPage>
  );
}