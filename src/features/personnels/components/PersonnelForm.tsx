import { ImageDropzone } from "@/components/common/ImageDropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { apiClient } from "@/lib/apiClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { PersonnelDetailType } from "../types";

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const baseSchema = z.object({
  name: z.string().min(1, { message: "Nama wajib diisi." }),
  active: z.boolean(),
});

const createPersonnelSchema = baseSchema.extend({
  image: z
    .any()
    .refine((file) => file instanceof File, "Gambar wajib diunggah.")
    .refine((file) => file.size <= MAX_FILE_SIZE, `Ukuran gambar maksimal 4MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Format gambar tidak valid."
    ),
});

const editPersonnelSchema = baseSchema.extend({
  image: z
    .any()
    .optional()
    .refine(
      (file) => !file || (file instanceof File && file.size <= MAX_FILE_SIZE),
      `Ukuran gambar maksimal 4MB.`
    )
    .refine(
      (file) =>
        !file ||
        (file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file.type)),
      "Format gambar tidak valid."
    ),
});

type PersonnelTypeForm =
  | z.infer<typeof createPersonnelSchema>
  | z.infer<typeof editPersonnelSchema>;

interface PersonnelFormProps {
  initialData?: PersonnelDetailType;
  readOnly?: boolean;
}

export function PersonnelForm({ initialData, readOnly }: PersonnelFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;
  const isReadOnly = readOnly && !!initialData;

  const form = useForm<PersonnelTypeForm>({
    resolver: zodResolver(
      isEditMode ? editPersonnelSchema : createPersonnelSchema
    ),
    defaultValues: {
      name: initialData?.name || "",
      image: undefined,
      active: initialData?.active ?? true,
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: PersonnelTypeForm) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("active", String(data.active));

    if (data.image) {
      formData.append("image", data.image);
    }

    try {
      if (isEditMode) {
        await apiClient.put(`/personnel/${initialData.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await apiClient.post(`/personnel`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      toast.success(
        isEditMode
          ? "Berhasil memperbarui personnel"
          : "Berhasil menambah personnel"
      );
      router.push("/dashboard/personnels");
    } catch (error) {
      console.log(error);
      if (isEditMode) {
        toast.error("Gagal memperbarui personnel");
      } else {
        toast.error("Gagal menambah personnel");
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditMode && !isReadOnly ? "Edit Personil" : isReadOnly ? "Detail Personil" : "Tambah Personil"}
        </CardTitle>
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
                      placeholder="Masukkan nama personil..."
                      {...field}
                      disabled={isReadOnly || isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Foto Profil</FormLabel>
                  <FormControl>
                    <ImageDropzone
                      onChange={field.onChange}
                      initialPreviewUrl={initialData?.image_url}
                      readOnly={isReadOnly || isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Status Aktif</FormLabel>
                    <FormDescription>
                      Jika aktif, personnel akan ditampilkan di website.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isReadOnly || isSubmitting}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting || readOnly}>
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
