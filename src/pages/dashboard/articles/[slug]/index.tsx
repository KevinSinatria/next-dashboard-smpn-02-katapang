import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import ProtectedPage from "@/features/auth/components/ProtectedPage";
import { ArticleForm } from "@/features/articles/components/ArticleForm";
import { ArticleDetailType } from "@/features/articles/types";
import { apiClient } from "@/lib/apiClient";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ReactElement } from "react";

interface ArticleDetailPageProps {
  article: ArticleDetailType;
}

export default function ArticleDetailPage({ article }: ArticleDetailPageProps) {
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

export async function getServerSideProps(context: { params: { slug: string } }) {
  const { slug } = context.params;
  try {
    const response = await apiClient.get(`/articles/${slug}`);
    return {
      props: {
        article: response.data.data,
      },
    };
  } catch {
    return { notFound: true };
  }
}

ArticleDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};