import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import ProtectedPage from "@/features/auth/components/ProtectedPage";
import { ArticleCategoryForm } from "@/features/article-categories/components/ArticleCategoryForm";
import { ArticleCategoryType } from "@/features/article-categories/types";
import { apiClient } from "@/lib/apiClient";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";

export default function EditArticleCategoryPage() {
  const router = useRouter();
  const { id } = router.query;
  const [articleCategory, setArticleCategory] = useState<ArticleCategoryType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchArticleCategory();
    }
  }, [id]);

  const fetchArticleCategory = async () => {
    try {
      const response = await apiClient.get(`/article-categories/${id}`);
      setArticleCategory(response.data.data);
    } catch (error) {
      console.error(error);
      router.push('/404');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!articleCategory) {
    return <div>Data tidak ditemukan</div>;
  }

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

EditArticleCategoryPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
