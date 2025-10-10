import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import ProtectedPage from "@/features/auth/components/ProtectedPage";
import { GalleryAlbumForm } from "@/features/gallery-albums/components/GalleryAlbumForm";
import { GalleryAlbumDetailType } from "@/features/gallery-albums/types";
import { apiClient } from "@/lib/apiClient";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";

export default function GalleryAlbumDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [galleryAlbum, setGalleryAlbum] = useState<GalleryAlbumDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchGalleryAlbum();
    }
  }, [slug]);

  const fetchGalleryAlbum = async () => {
    try {
      const response = await apiClient.get(`/gallery-albums/${slug}`);
      setGalleryAlbum(response.data.data);
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

  if (!galleryAlbum) {
    return <div>Data tidak ditemukan</div>;
  }

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

GalleryAlbumDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
