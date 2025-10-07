import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import ProtectedPage from "@/features/auth/components/ProtectedPage";
import { GalleryAlbumForm } from "@/features/gallery-albums/components/GalleryAlbumForm";
import { GalleryAlbumDetailType } from "@/features/gallery-albums/types";
import { apiClient } from "@/lib/apiClient";
import { ReactElement } from "react";

interface GalleryAlbumDetailPageProps {
  galleryAlbum: GalleryAlbumDetailType;
}

export default function GalleryAlbumDetailPage({
  galleryAlbum,
}: GalleryAlbumDetailPageProps) {
  const breadcrumbItems = [
    { label: "Album Galeri", href: "/dashboard/gallery-albums" },
    { label: `Detail: ${galleryAlbum.name}` },
  ];

  return (
    <ProtectedPage>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="mt-6">
        <GalleryAlbumForm initialData={galleryAlbum} readOnly={true} />
      </div>
    </ProtectedPage>
  );
}

export async function getServerSideProps(context: { params: { slug: string } }) {
  const { slug } = context.params;
  try {
    const response = await apiClient.get(`/gallery-albums/${slug}`);
    return {
      props: {
        galleryAlbum: response.data.data,
      },
    };
  } catch {
    return { notFound: true };
  }
}

GalleryAlbumDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
