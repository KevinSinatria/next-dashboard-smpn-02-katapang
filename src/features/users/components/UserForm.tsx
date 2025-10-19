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
import { useEffect, useState } from "react";
import { UserType } from "../types";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useArticleCategories } from "@/features/article-categories/hooks/useArticleCategories";
import { ImageDropzone } from "@/components/common/ImageDropzone";
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import { usePersonnels } from "@/features/personnels/hooks/usePersonnels";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { AxiosError } from "axios";

const UserSchema = z.object({
  username: z.string().min(1, {
    message: "Username wajib diisi.",
  }),
  personnel_id: z.number().min(1, {
    message: "Personnel wajib diisi.",
  }),
});

const CreateUserSchema = UserSchema.extend({
  password: z.string().min(1, {
    message: "Password wajib diisi.",
  }),
});

type UserTypeForm =
  | z.infer<typeof UserSchema>
  | z.infer<typeof CreateUserSchema>;

interface UserFormProps {
  initialData?: UserType;
  readOnly?: boolean;
}

export function UserForm({ initialData, readOnly }: UserFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;
  const isReadOnly = readOnly && !!initialData;
  const [hidePassword, setHidePassword] = useState(true);

  const form = useForm<UserTypeForm>({
    resolver: zodResolver(isEditMode ? UserSchema : CreateUserSchema),
    defaultValues: {
      username: initialData?.username || "",
      personnel_id: initialData?.personnel_id || 0,
    },
  });

  const {
    formState: { isSubmitting },
  } = form;
  const { personnels, isLoading: isLoadingPersonnels } = usePersonnels();

  const onSubmit = async (data: UserTypeForm) => {
    console.log(data);
    try {
      if (isEditMode) {
        await apiClient.put(`/users/${initialData.id}`, data);
      } else {
        await apiClient.post(`/users`, data);
      }

      toast.success(
        isEditMode ? "Berhasil memperbarui user" : "Berhasil menambah user"
      );
      router.push("/dashboard/users");
    } catch (error) {
      console.log(error);

      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          toast.error(error.response?.data.message);
        } else {
          if (isEditMode) {
            toast.error("Gagal memperbarui user");
          } else {
            toast.error("Gagal menambah user");
          }
        }
      }

      if (isEditMode) {
        toast.error("Gagal memperbarui user");
      } else {
        toast.error("Gagal menambah user");
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditMode && !isReadOnly
            ? "Edit User"
            : isReadOnly
            ? "Detail User"
            : "Tambah User"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username..."
                      disabled={isReadOnly || isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isEditMode && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="flex relative w-full">
                        <Input
                          placeholder="Password..."
                          type={hidePassword ? "password" : "text"}
                          disabled={isReadOnly || isSubmitting}
                          {...field}
                        />
                        {hidePassword ? (
                          <Eye
                            onClick={() => setHidePassword(!hidePassword)}
                            className="absolute right-2 top-2 cursor-pointer"
                          />
                        ) : (
                          <EyeClosed
                            onClick={() => setHidePassword(!hidePassword)}
                            className="absolute right-2 top-2 cursor-pointer"
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="personnel_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personil</FormLabel>
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
                        <SelectValue placeholder="Pilih Personil..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {!isLoadingPersonnels &&
                        personnels!.map((personnel) => (
                          <SelectItem
                            key={personnel.id}
                            value={String(personnel.id)}
                          >
                            {personnel.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isEditMode && (
              <div className="flex flex-col gap-2">
                <span>Berperan sebagai:</span>
                <div className="w-full flex flex-wrap gap-2">
                  {initialData.roles.map((role) => (
                    <Badge key={role}>{role}</Badge>
                  ))}
                </div>
                <small className="text-sm">
                  NOTE: Jika ingin mengganti atau mengelola role, silahkan pergi
                  ke halaman{" "}
                  <Link
                    className="text-blue-700 hover:text-blue-800 hover:underline"
                    href={`/dashboard/personnels/${initialData.personnel_id}/edit`}
                  >
                    Kelola Personnel
                  </Link>
                  .
                </small>
              </div>
            )}
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
