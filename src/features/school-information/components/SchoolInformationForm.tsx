"use client";

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
import { Edit, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import dynamic from "next/dynamic";
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false, // <-- Bagian paling penting!
  // Tambahkan ini untuk menampilkan tulisan "Loading..." saat komponen dimuat
  loading: () => <p>Loading editor...</p>,
});

const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), {
  ssr: false,
  loading: () => <p>Loading preview...</p>,
});

const schoolInformationSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email wajib diisi." })
    .nullable()
    .optional(),
  phone: z
    .string()
    .min(1, { message: "Nomor telepon wajib diisi." })
    .nullable()
    .optional(),
  vision: z
    .string()
    .min(1, { message: "Visi wajib diisi." })
    .nullable()
    .optional(),
  missions: z
    .string()
    .min(1, { message: "Misi wajib diisi." })
    .nullable()
    .optional(),
  address: z
    .string()
    .min(1, { message: "Alamat wajib diisi." })
    .nullable()
    .optional(),
  map_url: z
    .string()
    .min(1, { message: "URL Google Maps wajib diisi." })
    .nullable()
    .optional(),
  instagram: z
    .string()
    .min(1, { message: "Instagram wajib diisi." })
    .nullable()
    .optional(),
});

type SchoolInformationFormType = z.infer<typeof schoolInformationSchema>;

interface SchoolInformationFormProps {
  initialData?: {
    id: number;
    email: SchoolInformationFormType["email"] | null;
    phone: SchoolInformationFormType["phone"] | null;
    vision: SchoolInformationFormType["vision"] | null;
    missions: SchoolInformationFormType["missions"] | null;
    address: SchoolInformationFormType["address"] | null;
    map_url: SchoolInformationFormType["map_url"] | null;
    instagram: SchoolInformationFormType["instagram"] | null;
  };
  refetch: () => void;
}

export function SchoolInformationForm({
  initialData,
  refetch,
}: SchoolInformationFormProps) {
  const form = useForm<SchoolInformationFormType>({
    resolver: zodResolver(schoolInformationSchema),
    defaultValues: {
      email: "",
      phone: "",
      vision: "",
      missions: "",
      address: "",
      map_url: "",
      instagram: "",
    },
  });
  const {
    formState: { isSubmitting },
  } = form;
  const [isReadOnly, setIsReadOnly] = useState(true);

  useEffect(() => {
    if (initialData) {
      form.setValue("email", initialData.email || "");
      form.setValue("phone", initialData.phone || "");
      form.setValue("vision", initialData.vision || "");
      form.setValue("missions", initialData.missions || "");
      form.setValue("address", initialData.address || "");
      form.setValue("map_url", initialData.map_url || "");
      form.setValue("instagram", initialData.instagram || "");
    }
  }, [initialData]);

  const onSubmit = async (data: SchoolInformationFormType) => {
    try {
      await apiClient.put(`/school-informations`, data);
      toast.success("Informasi sekolah berhasil disimpan.");
      refetch();
      setIsReadOnly(true);
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat menyimpan informasi sekolah.");
    }
  };

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsReadOnly(false);
  };

  const handleCancelClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsReadOnly(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Informasi Sekolah</CardTitle>
        {isReadOnly && (
          <Button
            onClick={handleEditClick}
            className="flex items-center justify-center gap-2"
          >
            <Edit className="h-4 w-4" />
            <span className="sm:block hidden">Edit</span>
          </Button>
        )}
        {!isReadOnly && (
          <Button onClick={handleCancelClick}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {(
              ["email", "phone", "address", "map_url", "instagram"] as const
            ).map((fieldName) => (
              <FormField
                key={fieldName}
                control={form.control}
                name={fieldName}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">
                      {fieldName.replace("_", " ")} Sekolah
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`Masukkan ${fieldName.replace(
                          "_",
                          " "
                        )} sekolah...`}
                        type={fieldName === "email" ? "email" : "text"}
                        {...field}
                        value={field.value ?? ""}
                        disabled={isSubmitting || isReadOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <FormField
              control={form.control}
              name="vision"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visi Sekolah</FormLabel>
                  <FormControl>
                    <div data-color-mode="light">
                      {!isReadOnly ? (
                        <MDEditor
                          height={250}
                          value={field.value || ""}
                          onChange={(value) => field.onChange(value)}
                        />
                      ) : (
                        <MarkdownPreview source={field.value || ""} />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="missions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Misi Sekolah</FormLabel>
                  <FormControl>
                    <div data-color-mode="light">
                      {!isReadOnly ? (
                        <MDEditor
                          height={250}
                          value={field.value || ""}
                          onChange={(value) => field.onChange(value)}
                        />
                      ) : (
                        <MarkdownPreview source={field.value || ""} />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isReadOnly && (
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCancelClick}
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
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
