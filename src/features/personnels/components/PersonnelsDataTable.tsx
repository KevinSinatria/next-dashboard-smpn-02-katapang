import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { usePersonnels } from "../hooks/usePersonnels";
import { toast } from "sonner";
import { apiClient } from "@/lib/apiClient";
import { MoreHorizontal, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PaginationContainer } from "@/components/common/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import Image from "next/image";

export function PersonnelsDataTable() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [searchDebounced] = useDebounce(searchTerm, 500);
  const router = useRouter();

  const { personnels, meta, isLoading, mutate } = usePersonnels({
    page,
    search: searchDebounced,
  });

  useEffect(() => {
    if (isLoading) {
      toast.loading("Memuat data...", { id: "personnels" });
    } else {
      toast.dismiss("personnels");
    }
  }, [isLoading]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleDeletePersonnel = async (id: number) => {
    try {
      await apiClient.delete(`/personnel/${id}`);

      mutate();
      toast.success("Berhasil menghapus personnel");
    } catch (error) {
      console.log(error);
      toast.error("Gagal menghapus personnel");
    }
  };

  //   if (isLoading) {
  //     return toast.loading("Memuat data...", { id: "personnels" });
  //   } else {
  //     toast.dismiss("personnels");
  //   }

  return (
    <>
      <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          <Input
            type="search"
            placeholder="Cari berdasarkan nama personil..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white shadow-sm
               focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 
               transition-all duration-200 placeholder:text-gray-400"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="flex gap-4 items-center justify-end flex-wrap">
          <Button
            className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-all flex items-center justify-center text-sm gap-2"
            asChild
          >
            <Link href="/dashboard/personnels/new">
              <Plus />
              Buat Data
            </Link>
          </Button>
          <div className="bg-gray-200 p-1 flex items-center justify-center rounded-lg">
            {meta && (
              <PaginationContainer
                meta={meta!}
                handlePageChange={(page: number) => setPage(page)}
              />
            )}
          </div>
        </div>
      </div>
      <Table className="min-w-[1200px] shadow-md relative bg-white">
        <TableHeader className="sticky shadow -top-[1px] bg-gray-100">
          <TableRow className="uppercase">
            <TableHead className="font-semibold">
              <span className="sr-only">Aksi</span>
            </TableHead>
            <TableHead className="hidden sm:table-cell font-semibold">
              Id
            </TableHead>
            <TableHead className="font-semibold">Nama</TableHead>
            <TableHead className="font-semibold">Foto Profil</TableHead>
            <TableHead className="font-semibold">Status Aktif</TableHead>
            <TableHead className="font-semibold">Dibuat Pada</TableHead>
            <TableHead className="font-semibold">Diperbarui Pada</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {personnels &&
          !isLoading &&
          personnels!.length === 0 &&
          !searchTerm ? (
            <TableRow className="text-sm">
              <TableCell colSpan={12} className="text-center h-24">
                Tidak ada data personil.
              </TableCell>
            </TableRow>
          ) : personnels &&
            !isLoading &&
            personnels!.length === 0 &&
            searchTerm ? (
            <TableRow className="text-sm">
              <TableCell colSpan={12} className="text-center h-24">
                Tidak ada data yang cocok dengan pencarian &quot;{searchTerm}
                &quot;.
              </TableCell>
            </TableRow>
          ) : (
            personnels &&
            !isLoading &&
            personnels!.map((personnel) => (
              <TableRow
                key={personnel.id}
                className={`hover:bg-gray-50 text-sm`}
              >
                <TableCell>
                  <DropdownMenu
                    open={openMenuId === personnel.id}
                    onOpenChange={(open) =>
                      open ? setOpenMenuId(personnel.id) : setOpenMenuId(null)
                    }
                  >
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() =>
                          router.push(`/dashboard/personnels/${personnel.id}`)
                        }
                      >
                        Lihat Detail
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() =>
                          router.push(
                            `/dashboard/personnels/${personnel.id}/edit`
                          )
                        }
                      >
                        Edit
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            className="text-red-600 cursor-pointer"
                            onSelect={(e) => e.preventDefault()}
                          >
                            Hapus
                          </DropdownMenuItem>
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
                                handleDeletePersonnel(personnel.id)
                              }
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Ya, Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell className="hidden font-medium sm:table-cell">
                  {personnel.id}
                </TableCell>
                <TableCell>{personnel.name}</TableCell>
                <TableCell>
                  <Image
                    src={personnel.image_url}
                    alt={personnel.name}
                    width={100}
                    height={100}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                </TableCell>
                <TableCell>
                  <span
                    className={`${
                      personnel.active ? "bg-green-600" : "bg-red-600"
                    } text-white px-2 py-1 rounded`}
                  >
                    {personnel.active ? "Aktif" : "Tidak Aktif"}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(personnel.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(personnel.updated_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
}
