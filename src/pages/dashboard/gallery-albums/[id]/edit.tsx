import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import ProtectedPage from "@/features/auth/components/ProtectedPage";
import { GalleryAlbumForm } from "@/features/gallery-albums/components/GalleryAlbumForm";
import { GalleryAlbumDetailType } from "@/features/gallery-albums/types";
import { apiClient } from "@/lib/apiClient";

interface GalleryAlbumDetailPageProps {
  galleryAlbum: GalleryAlbumDetailType;
}

export default function GalleryAlbumEditPage({
  galleryAlbum,
}: GalleryAlbumDetailPageProps) {
  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Album Galeri", href: "/dashboard/gallery-albums" },
    { label: `Edit: ${galleryAlbum.name}` },
  ];

  return (
    <ProtectedPage>
      <DashboardLayout>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="mt-6">
          <GalleryAlbumForm initialData={galleryAlbum} />
        </div>
      </DashboardLayout>
    </ProtectedPage>
  );
}

export async function getServerSideProps(context: { params: { id: string } }) {
  const { id } = context.params;
  try {
    const response = await apiClient.get(`/gallery-albums/${id}`);
    return {
      props: {
        galleryAlbum: response.data.data,
      },
    };
  } catch {
    return { notFound: true };
  }
}
