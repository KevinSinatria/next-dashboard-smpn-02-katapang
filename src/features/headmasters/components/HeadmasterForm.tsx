import z from "zod";
import { HeadmasterDetailType } from "../types";
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
import { usePersonnels } from "@/features/personnels/hooks/usePersonnels";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
// MENJADI SEPERTI INI:
import dynamic from "next/dynamic";
import { useEffect } from "react";

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

const headmasterSchema = z.object({
  personnel_id: z.number().min(1, { message: "Personil wajib diisi." }),
  start_year: z.number().min(1990, { message: "Tahun mulai tidak valid." }),
  end_year: z.number().min(1990, { message: "Tahun selesai tidak valid." }),
  is_active: z.boolean({ message: "Status wajib diisi." }),
  welcoming_sentence: editorDataSchema.nonoptional({
    message: "Selamat datang wajib diisi.",
  }),
});

type HeadmasterTypeForm = z.infer<typeof headmasterSchema>;
interface HeadmasterFormProps {
  initialData?: HeadmasterDetailType;
  readOnly?: boolean;
}

export function HeadmasterForm({ initialData, readOnly }: HeadmasterFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;
  const isReadOnly = readOnly && !!initialData;

  const form = useForm<HeadmasterTypeForm>({
    resolver: zodResolver(headmasterSchema),
    defaultValues: {
      personnel_id: initialData?.personnel_id ?? 0,
      start_year: initialData?.start_year ?? new Date().getFullYear(),
      end_year: initialData?.end_year ?? new Date().getFullYear(),
      is_active: initialData?.is_active ?? false,
      welcoming_sentence: initialData?.welcoming_sentence ?? { blocks: [] },
    },
  });

  const {
    formState: { isSubmitting },
  } = form;
  const { personnels } = usePersonnels({ limit: 100 });

  useEffect(() => {
    if (isReadOnly) {
      form.reset({
        personnel_id: initialData?.personnel_id ?? 0,
        start_year: initialData?.start_year ?? new Date().getFullYear(),
        end_year: initialData?.end_year ?? new Date().getFullYear(),
        is_active: initialData?.is_active ?? false,
        welcoming_sentence: initialData?.welcoming_sentence ?? { blocks: [] },
      });
    } else {
      form.reset({
        personnel_id: initialData?.personnel_id ?? 0,
        start_year: initialData?.start_year ?? new Date().getFullYear(),
        end_year: initialData?.end_year ?? new Date().getFullYear(),
        is_active: initialData?.is_active ?? false,
        welcoming_sentence: initialData?.welcoming_sentence ?? { blocks: [] },
      });
    }
  }, [isReadOnly, initialData, form]);

  const onSubmit = async (data: HeadmasterTypeForm) => {
    try {
      if (isEditMode) {
        await apiClient.put(`/headmasters/${initialData.id}`, data);
      } else {
        await apiClient.post(`/headmasters`, data);
      }
      toast.success(
        isEditMode
          ? "Berhasil memperbarui Kepala Sekolah"
          : "Berhasil menambah Kepala Sekolah"
      );
      router.push("/dashboard/headmasters");
    } catch (error) {
      console.log(error);
      if (isEditMode) {
        toast.error("Gagal memperbarui Kepala Sekolah");
      } else {
        toast.error("Gagal menambah Kepala Sekolah");
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditMode && !isReadOnly
            ? "Edit Kepala Sekolah"
            : isReadOnly
            ? "Detail Kepala Sekolah"
            : "Tambah Kepala Sekolah"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="personnel_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personil</FormLabel>
                  <FormControl>
                    <Select
                      disabled={isReadOnly || isSubmitting}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={
                        field.value ? String(field.value) : undefined
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih personil" />
                      </SelectTrigger>
                      <SelectContent>
                        {personnels?.map((personnel) => (
                          <SelectItem
                            key={personnel.id}
                            value={String(personnel.id)}
                          >
                            {personnel.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="start_year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tahun Mulai</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Tahun Mulai... (cth: 2023)"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      disabled={isReadOnly || isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="end_year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tahun Selesai</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Tahun Selesai... (cth: 2023)"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      disabled={isReadOnly || isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isReadOnly || isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="welcoming_sentence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ucapan Sambutan</FormLabel>
                  <FormControl>
                    <EditorComponent
                      data={field.value}
                      onChange={field.onChange}
                      holder="editorjs-container"
                    />
                  </FormControl>
                  <FormDescription>
                    Tulis kalimat sambutan yang akan muncul di halaman utama.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
