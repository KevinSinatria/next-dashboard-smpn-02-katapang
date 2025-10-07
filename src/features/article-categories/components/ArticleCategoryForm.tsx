import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/apiClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const articleCategorySchema = z.object({
  name: z.string().min(1, { message: "Nama wajib diisi." }),
});

type ArticleCategoryFormType = z.infer<typeof articleCategorySchema>;

interface ArticleCategoryFormProps {
  initialData?: {
    id: number;
    name: ArticleCategoryFormType["name"];
  } | null;
  readOnly?: boolean;
}

export function ArticleCategoryForm({
  initialData,
  readOnly,
}: ArticleCategoryFormProps) {
  const router = useRouter();
  const form = useForm<ArticleCategoryFormType>({
    resolver: zodResolver(articleCategorySchema),
    defaultValues: {
      name: "",
    },
  });
  const {
    formState: { isSubmitting },
  } = form;
  const isEditMode = !!initialData;
  const isReadOnly = !!isEditMode && readOnly;

  // useEffect(() => {
  //   if (isEditMode) {
  //     form.reset(initialData!);
  //   } else {
  //     form.reset({
  //       name: "",
  //     });
  //   }
  // }, [form, initialData, isEditMode]);

  const onSubmit = async (data: ArticleCategoryFormType) => {
    try {
      if (isEditMode) {
        await apiClient.put(`/article-categories/${initialData.id}`, data);
      } else {
        await apiClient.post(`/article-categories`, data);
      }

      toast.success(
        isEditMode
          ? "Berhasil memperbarui kategori artikel"
          : "Berhasil menambah kategori artikel"
      );
      router.push("/dashboard/article-categories");
    } catch (error) {
      console.log(error);
      if (isEditMode) {
        toast.error("Gagal memperbarui kategori artikel");
      } else {
        toast.error("Gagal menambah kategori artikel");
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditMode ? "Edit Kategori Artikel" : "Tambah Kategori Artikel"}
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
                  <FormLabel>Nama Kategori</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan nama kategori artikel"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/dashboard/article-categories")}
              >
                Batal
              </Button>
              <Button
                className="flex gap-2 items-center"
                type="submit"
                disabled={isSubmitting || isReadOnly}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
