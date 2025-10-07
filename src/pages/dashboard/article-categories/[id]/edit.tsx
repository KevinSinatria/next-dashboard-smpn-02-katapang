import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import ProtectedPage from "@/features/auth/components/ProtectedPage";
import { ArticleCategoryForm } from "@/features/article-categories/components/ArticleCategoryForm";
import { ArticleCategoryType } from "@/features/article-categories/types";
import { apiClient } from "@/lib/apiClient";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ReactElement } from "react";

interface EditArticleCategoryPageProps {
  articleCategory: ArticleCategoryType;
}

export default function EditArticleCategoryPage({
  articleCategory,
}: EditArticleCategoryPageProps) {
  const breadcrumbItems = [
    { label: "Kategori Artikel", href: "/dashboard/article-categories" },
    { label: `Edit: ${articleCategory.name}` },
  ];

  return (
    <ProtectedPage>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="mt-6">
        <ArticleCategoryForm initialData={articleCategory} />
      </div>
    </ProtectedPage>
  );
}

export async function getServerSideProps(context: { params: { id: string } }) {
  const { id } = context.params;
  try {
    const response = await apiClient.get(`/article-categories/${id}`);
    return {
      props: {
        articleCategory: response.data.data,
      },
    };
  } catch {
    return { notFound: true };
  }
}

EditArticleCategoryPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
