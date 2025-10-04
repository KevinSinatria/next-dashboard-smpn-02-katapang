import { toast } from "sonner";
import { useRoles } from "../hooks/useRoles";
import { useEffect, useState } from "react";
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
import { useRouter } from "next/router";
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
import { apiClient } from "@/lib/apiClient";
import { useDebounce } from "use-debounce";

export function RolesDataTable() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [searchDebounced] = useDebounce(searchTerm, 500);
  const router = useRouter();

  const { roles, meta, isLoading, mutate } = useRoles({
    page,
    search: searchDebounced,
  });

  useEffect(() => {
    if (isLoading) {
      toast.loading("Memuat data...", { id: "roles" });
    } else {
      toast.dismiss("roles");
    }
  }, [isLoading]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleDeleteRole = async (id: number) => {
    try {
      await apiClient.delete(`/roles/${id}`);

      mutate();
      toast.success("Berhasil menghapus role");
    } catch (error) {
      console.log(error);
      toast.error("Gagal menghapus role");
    }
  };

  if (isLoading) {
    return toast.loading("Memuat data...", { id: "roles" });
  } else {
    toast.dismiss("roles");
  }

  return (
    <>
      <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          <Input
            type="search"
            placeholder="Cari berdasarkan nama role..."
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
            <Link href="/dashboard/roles/new">
              <Plus />
              Buat Data
            </Link>
          </Button>
          <div className="bg-gray-200 p-1 flex items-center justify-center rounded-lg">
            <PaginationContainer
              meta={meta!}
              handlePageChange={(page: number) => setPage(page)}
            />
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
            <TableHead className="font-semibold">Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading && roles!.length === 0 && !searchTerm ? (
            <TableRow className="text-sm">
              <TableCell colSpan={12} className="text-center h-24">
                Tidak ada data roles.
              </TableCell>
            </TableRow>
          ) : !isLoading && roles!.length === 0 && searchTerm ? (
            <TableRow className="text-sm">
              <TableCell colSpan={12} className="text-center h-24">
                Tidak ada data yang cocok dengan pencarian &quot;{searchTerm}
                &quot;.
              </TableCell>
            </TableRow>
          ) : (
            !isLoading &&
            roles!.map((role) => (
              <TableRow key={role.id} className={`hover:bg-gray-50 text-sm`}>
                <TableCell>
                  <DropdownMenu
                    open={openMenuId === role.id}
                    onOpenChange={(open) =>
                      open ? setOpenMenuId(role.id) : setOpenMenuId(null)
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
                          router.push(`/dashboard/roles/${role.id}/edit`)
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
                              onClick={() => handleDeleteRole(role.id)}
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
                  {role.id}
                </TableCell>
                <TableCell>{role.name}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
}

// src/features/posts/components/PostsDataTable.tsx
// INI ADALAH KOMPONEN UTAMA YANG MENGATUR SEMUA AKSI
// 'use client';
// import { useState } from 'react';
// import { usePosts } from '../hooks/usePosts';
// import { Button } from '@/components/ui/button';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { PostFormDialog } from './PostFormDialog'; // Akan kita buat
// import { toast } from 'sonner';

// export function PostsDataTable() {
//   const { posts, isLoading, mutate } = usePosts();
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [selectedPost, setSelectedPost] = useState(null);

//   const handleEdit = (post) => {
//     setSelectedPost(post);
//     setIsFormOpen(true);
//   };

//   const handleAddNew = () => {
//     setSelectedPost(null); // Kosongkan data untuk mode "Create"
//     setIsFormOpen(true);
//   };

//   // Fungsi ini akan dipanggil dari dalam form setelah submit berhasil
//   const handleFormSubmitSuccess = () => {
//     setIsFormOpen(false); // Tutup dialog
//     mutate(); // Perintahkan SWR untuk fetch ulang data!
//     toast.success(`Post berhasil ${selectedPost ? 'diperbarui' : 'dibuat'}!`);
//   };

//   if (isLoading) return <div>Loading posts...</div>;

//   return (
//     <div>
//       <div className="flex justify-end mb-4">
//         <Button onClick={handleAddNew}>Tambah Post Baru</Button>
//       </div>

//       <PostFormDialog
//         isOpen={isFormOpen}
//         onClose={() => setIsFormOpen(false)}
//         onSuccess={handleFormSubmitSuccess}
//         initialData={selectedPost}
//       />

//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Judul</TableHead>
//             <TableHead>Dibuat Pada</TableHead>
//             <TableHead>Aksi</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {posts?.map((post) => (
//             <TableRow key={post.id}>
//               <TableCell>{post.title}</TableCell>
//               <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
//               <TableCell>
//                 <Button variant="outline" size="sm" onClick={() => handleEdit(post)}>
//                   Edit
//                 </Button>
//                 {/* Tombol Delete akan kita tambahkan nanti */}
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }
