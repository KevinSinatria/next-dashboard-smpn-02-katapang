import z from "zod";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiClient } from "@/lib/apiClient";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GalleryAlbumDetailType } from "../types";
import {
  ImageItem,
  MultiImageDropzone,
} from "@/components/common/MultiDropzone";
import { useEffect, useState } from "react";

const galleryAlbumSchema = z.object({
  name: z.string().min(1, {
    message: "Nama wajib diisi.",
  }),
  description: z.string().min(1, {
    message: "Deskripsi wajib diisi.",
  }),
});

type galleryAlbumTypeForm = z.infer<typeof galleryAlbumSchema>;

interface GalleryAlbumFormProps {
  initialData?: GalleryAlbumDetailType;
  readOnly?: boolean;
}

export function GalleryAlbumForm({
  initialData,
  readOnly,
}: GalleryAlbumFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;
  const isReadOnly = readOnly && !!initialData;

  const form = useForm<galleryAlbumTypeForm>({
    resolver: zodResolver(galleryAlbumSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const [images, setImages] = useState<ImageItem[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

  useEffect(() => {
    const existingImages = initialData?.photos.map((photo) => ({
      id: photo.id,
      url: photo.photo_url,
    }));

    setImages(existingImages || []);
  }, [initialData]);

  const handleImagesChange = (newImageList: ImageItem[]) => {
    const initialIds = initialData?.photos.map((p) => p.id);
    const currentIdsWithId = newImageList
      .map((item) => item.id)
      .filter((id): id is number => id !== undefined);
    const newDeletedIds = initialIds!.filter(
      (id) => !currentIdsWithId.includes(id)
    );

    setDeletedImageIds(newDeletedIds);
    setImages(newImageList);
  };

  const onSubmit = async (data: galleryAlbumTypeForm) => {
    const formData = new FormData();
    const newFiles = images.filter((item) => item.file);
    newFiles.forEach((item) => {
      formData.append("images", item.file!);
    });

    if (deletedImageIds.length > 0) {
      formData.append("deleted_photo_ids", JSON.stringify(deletedImageIds));
    }

    toast.info("Sedang mengupload gambar, mohon tunggu...");

    try {
      if (isEditMode) {
        await apiClient.put(`/gallery-albums/${initialData.id}`, data);
        await apiClient.put(
          `/gallery-albums/${initialData.id}/photos`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        await apiClient.post(`/gallery-albums`, data);
      }
      toast.success(
        `Album galeri berhasil ${isEditMode ? "diubah" : "ditambahkan"}!`
      );
      router.push("/dashboard/gallery-albums");
    } catch (error) {
      console.log(error);
      if (isEditMode) {
        toast.error("Gagal memperbarui Album galeri");
      } else {
        toast.error("Gagal menambah Album galeri");
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Album Galeri</CardTitle>
        <CardDescription>
          {isEditMode ? "Ubah album galeri" : "Tambah album galeri"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Nama album galeri"
                      {...field}
                      disabled={isReadOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Deskripsi album galeri"
                      {...field}
                      disabled={isReadOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isEditMode && (
              <Card>
                <CardHeader>
                  <CardTitle>Kelola Foto</CardTitle>
                </CardHeader>
                <CardContent>
                  <MultiImageDropzone
                    value={images}
                    onChange={handleImagesChange}
                    maxFiles={15}
                  />
                </CardContent>
              </Card>
            )}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting || isReadOnly}>
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
