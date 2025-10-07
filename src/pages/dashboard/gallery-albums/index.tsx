import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useHeader } from "@/contexts/HeaderContext";
import { GalleryAlbumsDataTable } from "@/features/gallery-albums/components/GalleryAlbumsDataTable";
import { ReactElement, useEffect } from "react";

function GalleryAlbumsContent() {
  const { setTitle } = useHeader();
  useEffect(() => {
    setTitle("Kelola Album Galeri");
  }, [setTitle]);

  return (
    <div>
      <div>
        <GalleryAlbumsDataTable />
      </div>
    </div>
  );
}

export default function GalleryAlbumsPage() {
  return (
    <GalleryAlbumsContent />
  );
}

GalleryAlbumsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <DashboardLayout>
      {page}
    </DashboardLayout>
  );
};
