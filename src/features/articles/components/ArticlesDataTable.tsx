import { toast } from "sonner";
import { useArticles } from "../hooks/useArticles";
import { useEffect, useState } from "react";
import { MoreHorizontal, Plus, Search, Eye } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { ArticleType } from "../types";

export function ArticlesDataTable() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [searchDebounced] = useDebounce(searchTerm, 500);
  const router = useRouter();

  const { articles, meta, isLoading, mutate } = useArticles({
    page,
    search: searchDebounced,
  });

  console.log(articles);

  useEffect(() => {
    if (isLoading) {
      toast.loading("Memuat data...", { id: "articles" });
    } else {
      toast.dismiss("articles");
    }
  }, [isLoading]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleDeleteArticle = async (slug: string) => {
    try {
      await apiClient.delete(`/articles/${slug}`);

      mutate();
      toast.success("Berhasil menghapus artikel");
    } catch (error) {
      console.log(error);
      toast.error("Gagal menghapus artikel");
    }
  };

  if (isLoading) {
    return toast.loading("Memuat data...", { id: "articles" });
  } else {
    toast.dismiss("articles");
  }

  return (
    <>
      <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          <Input
            type="search"
            placeholder="Cari berdasarkan judul artikel..."
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
            <Link href="/dashboard/articles/new">
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
            <TableHead className="font-semibold">Judul</TableHead>
            <TableHead className="font-semibold">Penulis</TableHead>
            <TableHead className="font-semibold">Kategori</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="hidden sm:table-cell font-semibold">
              Dibuat
            </TableHead>
            <TableHead className="hidden sm:table-cell font-semibold">
              Diperbarui
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading && articles!.length === 0 && !searchTerm ? (
            <TableRow className="text-sm">
              <TableCell colSpan={12} className="text-center h-24">
                Tidak ada data artikel.
              </TableCell>
            </TableRow>
          ) : !isLoading && articles!.length === 0 && searchTerm ? (
            <TableRow className="text-sm">
              <TableCell colSpan={12} className="text-center h-24">
                Tidak ada data yang cocok dengan pencarian &quot;{searchTerm}
                &quot;.
              </TableCell>
            </TableRow>
          ) : (
            !isLoading &&
            articles!.map((article) => (
              <TableRow key={article.id} className={`hover:bg-gray-50 text-sm`}>
                <TableCell>
                  <DropdownMenu
                    open={openMenuId === article.id}
                    onOpenChange={(open) =>
                      open ? setOpenMenuId(article.id) : setOpenMenuId(null)
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
                          router.push(`/dashboard/articles/${article.slug}`)
                        }
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Detail
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() =>
                          router.push(
                            `/dashboard/articles/${article.slug}/edit`
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
                              onClick={() => handleDeleteArticle(article.slug)}
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
                  {article.id}
                </TableCell>
                <TableCell className="font-medium max-w-xs truncate">
                  {article.title}
                </TableCell>
                <TableCell>{article.author}</TableCell>
                <TableCell>{article.category}</TableCell>
                <TableCell>
                  <Badge className="flex items-center justify-center gap-2" variant={article.published ? "default" : "secondary"}>
                    {article.published ? "Dipublikasi" : "Draft"}
                    {!article.published && (
                      <div className="w-1 h-1 bg-green-400 rounded-full animate-ping"></div>
                    )}
                  </Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {new Date(article.created_at).toLocaleDateString("id-ID")}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {new Date(article.updated_at).toLocaleDateString("id-ID")}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
}
