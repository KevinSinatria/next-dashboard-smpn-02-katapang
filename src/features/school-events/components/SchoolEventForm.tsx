/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { apiClient } from "@/lib/apiClient";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const schoolEventSchema = z.object({
  title: z.string().min(1, { message: "Judul wajib diisi." }),
  description: z.string().min(1, { message: "Deskripsi wajib diisi." }),
  start_date: z.date({
    message: "Tanggal mulai harus diisi.",
  }),
  end_date: z
    .date({
      message: "Tanggal selesai harus diisi.",
    })
    .optional(),
});

type SchoolEventFormType = z.infer<typeof schoolEventSchema>;

interface SchoolEventFormProps {
  initialData: any;
  onSuccess: () => void;
}

export function EventForm({ initialData, onSuccess }: SchoolEventFormProps) {
  const isEditMode = !!initialData?.id;

  const form = useForm<SchoolEventFormType>({
    resolver: zodResolver(schoolEventSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      start_date: initialData?.start_date
        ? new Date(initialData.start_date)
        : new Date(),
      end_date: initialData?.end_date
        ? new Date(initialData.end_date)
        : undefined,
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: SchoolEventFormType) => {
    try {
      const payload = {
        ...data,
        start_date: format(data.start_date, "yyyy-MM-dd"),
        end_date: data.end_date ? format(data.end_date, "yyyy-MM-dd") : null,
      };
      console.log(payload);
      if (isEditMode) {
        await apiClient.put(`/school-events/${initialData.id}`, payload);
      } else {
        await apiClient.post(`/school-events`, payload);
      }
      toast.success(
        isEditMode ? "Berhasil memperbarui event" : "Berhasil menambah event"
      );
      onSuccess();
    } catch (error) {
      console.log(error);
      if (isEditMode) {
        toast.error("Gagal memperbarui event");
      } else {
        toast.error("Gagal menambah event");
      }
    }
  };

  const handleDeleteSchoolEvent = async () => {
    try {
      await apiClient.delete(`/school-events/${initialData.id}`);
      toast.success("Berhasil menghapus event");
      onSuccess();
    } catch (error) {
      console.log(error);
      toast.error("Gagal menghapus event");
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul Acara</FormLabel>
              <FormControl>
                <Input placeholder="Judul Acara..." type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tanggal Mulai</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="end_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tanggal Selesai</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        field.value && format(field.value, "PPP")
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi Acara</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Deskripsi Acara..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          {initialData && isEditMode && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  type="button"
                >Hapus</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-96">
                <AlertDialogHeader>
                  <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Aksi ini tidak dapat dibatalkan. Data yang sudah dihapus
                    tidak akan bisa dikembalikan lagi.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeleteSchoolEvent()}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Ya, Hapus
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button
            className="flex gap-2 items-center"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
