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

const roleSchema = z.object({
  name: z.string(),
});

type roleType = z.infer<typeof roleSchema>;

interface RoleFormProps {
  initialData?: {
    id: number;
    name: roleType["name"];
  } | null;
}

export function RoleForm({ initialData }: RoleFormProps) {
  const router = useRouter();
  const form = useForm<roleType>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
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
        name: "",
      });
    }
  }, [form, initialData, isEditMode]);

  const onSubmit = async (data: roleType) => {
    try {
      let response;
      if (isEditMode) {
        response = await apiClient.put(`/roles/${initialData.id}`, data);
      } else {
        response = await apiClient.post(`/roles`, data);
      }

      if (response.data.success) {
        toast.success(
          isEditMode ? "Berhasil memperbarui role" : "Berhasil menambah role"
        );
        router.push("/dashboard/roles");
      }
    } catch (error) {
      console.log(error);
      if (isEditMode) {
        toast.error("Gagal memperbarui role");
      } else {
        toast.error("Gagal menambah role");
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? "Edit Role" : "Tambah Role"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Role</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama role" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/dashboard/roles")}
              />
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
