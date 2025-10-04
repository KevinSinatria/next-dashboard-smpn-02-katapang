import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useHeader } from "@/contexts/HeaderContext";
import { GalleryAlbumsDataTable } from "@/features/gallery-albums/components/GalleryAlbumsDataTable";
import { useEffect } from "react";

function GalleryAlbumsContent() {
  const { setTitle } = useHeader();
  useEffect(() => {
    setTitle("Kelola Album Galeri");
  }, [setTitle]);

  return (
    <div>
      <GalleryAlbumsDataTable />
    </div>
  );
}

export default function GalleryAlbumsPage() {
  return (
    <DashboardLayout>
      <GalleryAlbumsContent />
    </DashboardLayout>
  );
}
