import z from "zod";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiClient } from "@/lib/apiClient";
import { toast } from "sonner";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { ArticleDetailType } from "../types";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useArticleCategories } from "@/features/article-categories/hooks/useArticleCategories";
import { ImageDropzone } from "@/components/common/ImageDropzone";
import { Loader2 } from "lucide-react";
import { parse } from "path";
import { OutputData } from "@editorjs/editorjs";

const EditorComponent = dynamic(
  () =>
    import("@/components/common/EditorComponent").then(
      (mod) => mod.EditorComponent
    ),
  {
    ssr: false,
    loading: () => <div>Loading...</div>,
  }
);

const MAX_FILE_SIZE = 12 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const blockSchema = z.object({
  id: z.string().optional(),
  type: z.string(),
  data: z.record(z.string(), z.any()),
});

const editorDataSchema = z.object({
  time: z.number().optional(),
  version: z.string().optional(),
  blocks: z.array(blockSchema),
});

const baseSchema = z.object({
  title: z.string().min(1, { message: "Judul wajib diisi." }),
  author_id: z.number().min(1, { message: "Penulis wajib diisi." }),
  category_id: z.number().min(1, { message: "Kategori wajib diisi." }),
  published: z.boolean({ message: "Status wajib diisi." }),
  content: editorDataSchema.nonoptional({
    message: "Konten wajib diisi.",
  }),
});

const createArticleSchema = baseSchema.extend({
  image: z
    .any()
    .refine((file) => file instanceof File, "Gambar wajib diunggah.")
    .refine((file) => file.size <= MAX_FILE_SIZE, `Ukuran gambar maksimal 4MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Format gambar tidak valid."
    ),
});

const editArticleSchema = baseSchema.extend({
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

type ArticleTypeForm =
  | z.infer<typeof createArticleSchema>
  | z.infer<typeof editArticleSchema>;

interface ArticleFormProps {
  initialData?: ArticleDetailType;
  readOnly?: boolean;
}

const parseEditorContent = (
  content: OutputData | string | undefined | null
): OutputData => {
  if (!content) {
    return { blocks: [] }; // Kembalikan objek kosong jika tidak ada konten
  }
  try {
    return JSON.parse(content as string);
  } catch (error) {
    console.error("Gagal mem-parse konten JSON:", error);
    return { blocks: [] }; // Kembalikan objek kosong jika parsing gagal
  }
};

export function ArticleForm({ initialData, readOnly }: ArticleFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;
  const isReadOnly = readOnly && !!initialData;
  const { user } = useAuth();

  console.log(initialData);

  const form = useForm<ArticleTypeForm>({
    resolver: zodResolver(isEditMode ? editArticleSchema : createArticleSchema),
    defaultValues: {
      title: initialData?.title || "",
      author_id: initialData?.author_id || 0,
      category_id: initialData?.category_id || 0,
      published: initialData?.published ?? false,
      content: parseEditorContent(initialData?.content),
    },
  });

  const {
    formState: { isSubmitting },
  } = form;
  const { articleCategories: categories, isLoading: isLoadingCategories } =
    useArticleCategories();

  const onSubmit = async (data: ArticleTypeForm) => {
    console.log(data);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("author_id", String(data.author_id));
      formData.append("category_id", String(data.category_id));
      formData.append("published", String(data.published));
      formData.append("content", JSON.stringify(data.content));

      if (data.image) {
        formData.append("image", data.image);
      }

      if (isEditMode) {
        await apiClient.post(`/articles/${initialData.slug}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-HTTP-Method-Override": "PUT",
          },
        });
      } else {
        await apiClient.post(`/articles`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      toast.success(
        isEditMode
          ? "Berhasil memperbarui artikel"
          : "Berhasil menambah artikel"
      );
      router.push("/dashboard/articles");
    } catch (error) {
      console.log(error);
      if (isEditMode) {
        toast.error("Gagal memperbarui artikel");
      } else {
        toast.error("Gagal menambah artikel");
      }
    }
  };

  useEffect(() => {
    if (user) {
      form.setValue("author_id", user.id);
    }
  }, [user, form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditMode && !isReadOnly
            ? "Edit Artikel"
            : isReadOnly
            ? "Detail Artikel"
            : "Tambah Artikel"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Judul artikel..."
                      disabled={isReadOnly || isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori</FormLabel>
                  <Select
                    disabled={isReadOnly || isSubmitting}
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={
                      String(field.value) !== "0"
                        ? String(field.value)
                        : undefined
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori artikel..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {!isLoadingCategories &&
                        categories!.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={String(category.id)}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail</FormLabel>
                  <FormControl>
                    <ImageDropzone
                      onChange={field.onChange}
                      initialPreviewUrl={initialData?.thumbnail_url}
                      readOnly={isReadOnly || isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Konten Artikel</FormLabel>
                  <FormControl>
                    <EditorComponent
                      data={field.value}
                      onChange={field.onChange}
                      holder="editorjs-container"
                      fullFeature={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Publikasikan</FormLabel>
                    <FormDescription>
                      Jika dipublikasikan, artikel akan muncul di halaman
                      artikel utama.
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
              <Button
                type="submit"
                disabled={isSubmitting || readOnly}
                className="flex items-center justify-center gap-2"
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
