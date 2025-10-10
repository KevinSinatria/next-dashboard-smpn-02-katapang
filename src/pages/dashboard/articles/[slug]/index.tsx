import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import ProtectedPage from "@/features/auth/components/ProtectedPage";
import { ArticleForm } from "@/features/articles/components/ArticleForm";
import { ArticleDetailType } from "@/features/articles/types";
import { apiClient } from "@/lib/apiClient";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";

export default function ArticleDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [article, setArticle] = useState<ArticleDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const fetchArticle = async () => {
    try {
      const response = await apiClient.get(`/articles/${slug}`);
      setArticle(response.data.data);
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

  if (!article) {
    return <div>Data tidak ditemukan</div>;
  }

  const breadcrumbItems = [
    { label: "Artikel", href: "/dashboard/articles" },
    { label: `Detail: ${article.title}` },
  ];

  return (
    <ProtectedPage>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="mt-6">
        <ArticleForm initialData={article} readOnly={true} />
      </div>
    </ProtectedPage>
  );
}

ArticleDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};