// Nama file: src/pages/dashboard/personnels/edit/[id].tsx

import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ProtectedPage from "@/features/auth/components/ProtectedPage";
import { PersonnelForm } from "@/features/personnels/components/PersonnelForm";
import {
  PersonnelDetailType,
  RolePersonnelType,
} from "@/features/personnels/types";
import { useRoles } from "@/features/roles/hooks/useRoles";
import { apiClient } from "@/lib/apiClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Trash, Edit } from "lucide-react";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const personnelRoleSchema = z.object({
  role_id: z.number().min(1, { message: "Role wajib diisi." }),
  position: z.string().optional().nullable(),
  subject: z.string().optional().nullable(),
});

type PersonnelRoleTypeForm = z.infer<typeof personnelRoleSchema>;

interface RoleFormDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  personnelId: number;
  personnelName: string;
  initialData?: RolePersonnelType | null;
  onSuccess: () => void;
}

function RoleFormDialog({
  isOpen,
  setIsOpen,
  personnelId,
  personnelName,
  initialData,
  onSuccess,
}: RoleFormDialogProps) {
  const isEditMode = !!initialData;
  const title = isEditMode ? "Edit Role" : "Tambah Role";
  const description = `Untuk personnel: ${personnelName}`;

  const form = useForm<PersonnelRoleTypeForm>({
    resolver: zodResolver(personnelRoleSchema),
    defaultValues: {
      role_id: 0,
      position: null,
      subject: null,
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (initialData) {
      form.reset({
        role_id: initialData.role_id,
        position: initialData.position ?? null,
        subject: initialData.subject ?? null,
      });
    } else {
      form.reset({
        role_id: 0,
        position: null,
        subject: null,
      });
    }
  }, [initialData, form, isOpen]);

  const { roles } = useRoles({ limit: 100 });
  const selectedRoleId = form.watch("role_id");
  const selectedRole = roles?.find((role) => role.id === selectedRoleId);

  const onSubmit = async (data: PersonnelRoleTypeForm) => {
    const payload = { ...data, personnel_id: personnelId };
    try {
      if (isEditMode) {
        await apiClient.put(
          `/personnel-roles/${initialData?.personnel_role_id}`,
          payload
        );
      } else {
        await apiClient.post(`/personnel-roles`, payload);
      }
      toast.success("Role berhasil disimpan");
      onSuccess();
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan role");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="role_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value ? String(field.value) : undefined}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles?.map((role) => (
                        <SelectItem key={role.id} value={String(role.id)}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedRole?.name.toLowerCase() === "guru" && (
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mata Pelajaran</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="cth: Matematika"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {selectedRole && selectedRole.name.toLowerCase() !== "guru" && (
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jabatan/Posisi</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="cth: Kepala Sekolah, Staf TU"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function EditPersonnelPage({
  personnel: initialPersonnel,
}: {
  personnel: PersonnelDetailType;
}) {
  const router = useRouter();
  const { id } = router.query;
  const [personnel, setPersonnel] =
    useState<PersonnelDetailType>(initialPersonnel);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RolePersonnelType | null>(
    null
  );

  //   const {
  //     data: { data: personnel },
  //   } = useSWR(`/personnel/${id}`, fetcher, {
  //     fallbackData: initialPersonnel,
  //   });

  const fetchPersonnelDetails = async () => {
    try {
      const response = await apiClient.get(`/personnel/${id}`);
      setPersonnel(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddNewRole = () => {
    setEditingRole(null);
    setIsDialogOpen(true);
  };

  const handleEditRole = (role: RolePersonnelType) => {
    setEditingRole(role);
    setIsDialogOpen(true);
  };

  const handleDeleteRole = async (personnelRoleId: number) => {
    try {
      await apiClient.delete(`/personnel-roles/${personnelRoleId}`);
      await fetchPersonnelDetails();
      toast.success("Role berhasil dihapus");
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus role");
    }
  };

  const handleSuccess = async () => {
    await fetchPersonnelDetails();
  };

  if (!personnel) {
    return (
      <div>Loading personnel data...</div>
    );
  }

  const breadcrumbItems = [
    { label: "Personil", href: "/dashboard/personnels" },
    { label: `Edit: ${personnel.name}` },
  ];

  return (
    <ProtectedPage>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="mt-6">
        <PersonnelForm initialData={personnel} />
      </div>
      <div className="mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Daftar Role</CardTitle>
            <Button onClick={handleAddNewRole}>
              <PlusCircle className="mr-2 h-4 w-4" /> Tambah Role
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="uppercase">
                  <TableHead>No</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Detail</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {personnel.roles.map((role, index) => (
                  <TableRow key={role.personnel_role_id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{role.role}</TableCell>
                    <TableCell>
                      {role.subject && `Mapel: ${role.subject}`}
                      {role.position && `Jabatan: ${role.position}`}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditRole(role)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Apakah Anda Yakin?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Aksi ini tidak dapat dibatalkan. Data yang sudah
                              dihapus tidak akan bisa dikembalikan lagi.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleDeleteRole(role.personnel_role_id)
                              }
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Ya, Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <RoleFormDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        personnelId={personnel.id}
        personnelName={personnel.name}
        initialData={editingRole}
        onSuccess={handleSuccess}
      />
    </ProtectedPage>
  );
}

export async function getServerSideProps(context: { params: { id: string } }) {
  const { id } = context.params;
  try {
    const response = await apiClient.get(`/personnel/${id}`);
    return {
      props: {
        personnel: response.data.data,
      },
    };
  } catch {
    return { notFound: true };
  }
}


EditPersonnelPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <DashboardLayout>
      {page}
    </DashboardLayout>
  );
};