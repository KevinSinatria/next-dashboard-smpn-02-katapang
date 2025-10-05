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

const schoolStatSchema = z.object({
  year: z
    .number()
    .min(2000, {
      message: "Mohon masukkan tahun yang valid.",
    })
    .max(2100, {
      message: "Mohon masukkan tahun yang valid.",
    }),
  students: z.number().min(0, {
    message: "Mohon masukkan jumlah siswa yang valid.",
  }),
  classes: z.number().min(0, {
    message: "Mohon masukkan jumlah kelas yang valid.",
  }),
  teachers: z.number().min(0, {
    message: "Mohon masukkan jumlah guru yang valid.",
  }),
});

type SchoolStatFormType = z.infer<typeof schoolStatSchema>;

interface SchoolStatFormProps {
  initialData?: {
    id: number;
    year: SchoolStatFormType["year"];
    students: SchoolStatFormType["students"];
    classes: SchoolStatFormType["classes"];
    teachers: SchoolStatFormType["teachers"];
  } | null;
}

export function SchoolStatForm({ initialData }: SchoolStatFormProps) {
  const router = useRouter();
  const form = useForm<SchoolStatFormType>({
    resolver: zodResolver(schoolStatSchema),
    defaultValues: {
      year: new Date().getFullYear(),
      students: 0,
      classes: 0,
      teachers: 0,
    },
  });
  const {
    formState: { isSubmitting },
  } = form;
  const isEditMode = !!initialData;

  useEffect(() => {
    if (isEditMode) {
      form.reset(initialData!);
    } else {
      form.reset({
        year: new Date().getFullYear(),
        students: 0,
        classes: 0,
        teachers: 0,
      });
    }
  }, [form, initialData, isEditMode]);

  const onSubmit = async (data: SchoolStatFormType) => {
    try {
      let response;
      if (isEditMode) {
        response = await apiClient.put(`/school-stats/${initialData.id}`, data);
      } else {
        response = await apiClient.post(`/school-stats`, data);
      }

      if (response.data.success) {
        toast.success(
          isEditMode
            ? "Berhasil memperbarui statistik sekolah"
            : "Berhasil menambah statistik sekolah"
        );
        router.push("/dashboard/school-stats");
      }
    } catch (error) {
      console.log(error);
      if (isEditMode) {
        toast.error("Gagal memperbarui statistik sekolah");
      } else {
        toast.error("Gagal menambah statistik sekolah");
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditMode ? "Edit Statistik Sekolah" : "Tambah Statistik Sekolah"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tahun</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Masukkan tahun"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="students"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah Siswa</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Masukkan jumlah siswa"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="classes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah Kelas</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Masukkan jumlah kelas"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="teachers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah Guru</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Masukkan jumlah guru"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
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
                onClick={() => router.push("/dashboard/school-stats")}
              >
                Batal
              </Button>
              <Button
                className="flex gap-2 items-center"
                type="submit"
                disabled={isSubmitting}
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
