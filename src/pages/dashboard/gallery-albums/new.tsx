import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import ProtectedPage from "@/features/auth/components/ProtectedPage";
import { GalleryAlbumForm } from "@/features/gallery-albums/components/GalleryAlbumForm";
import { ReactElement } from "react";

export default function NewGalleryAlbumPage() {
  const breadcrumbItems = [
    { label: "Album Galeri", href: "/dashboard/gallery-albums" },
    { label: "Buat Baru" },
  ];

  return (
    <ProtectedPage>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="mt-6">
        <GalleryAlbumForm />
      </div>
    </ProtectedPage>
  );
}

NewGalleryAlbumPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <DashboardLayout>
      {page}
    </DashboardLayout>
  );
};