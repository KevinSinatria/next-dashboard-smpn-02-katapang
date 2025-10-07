import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import ProtectedPage from "@/features/auth/components/ProtectedPage";
import { ArticleForm } from "@/features/articles/components/ArticleForm";
import { ReactElement } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function NewArticlePage() {
  const breadcrumbItems = [
    { label: "Artikel", href: "/dashboard/articles" },
    { label: "Buat Baru" },
  ];
  
  return (
    <ProtectedPage>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="mt-6">
        <ArticleForm />
      </div>
    </ProtectedPage>
  );
}

NewArticlePage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};