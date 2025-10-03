import { Meta } from "@/types/metaTypes";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { usePagination } from "@/hooks/usePagination";

export const PaginationContainer = ({
  meta,
  handlePageChange,
}: {
  meta: Meta;
  handlePageChange: (page: number) => void;
}) => {
  const paginationRange = usePagination({
    currentPage: meta.page,
    totalPage: meta.totalPage,
    siblingCount: 1, // Opsional, defaultnya 1usePagination
  });

  if (meta.page === 0 || paginationRange!.length < 2) {
    return null;
  }

  return (
    <Pagination className="cursor-pointer transition-all">
      <PaginationContent>
        {/* Tombol Sebelumnya */}
        {meta.page > 1 && (
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(meta.page - 1)}
            />
          </PaginationItem>
        )}

        {/* Nomor Halaman */}
        {paginationRange!.map((pageNumber, index) => {
          // Jika item adalah elipsis, render komponen elipsis
          if (pageNumber === "...") {
            return (
              <PaginationItem key={`dots-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          // Jika item adalah nomor halaman, render link halaman
          return (
            <PaginationItem
              key={`page-${pageNumber}`}
              className={
                meta.page === pageNumber
                  ? "bg-neutral-100 rounded-md dark:bg-neutral-800"
                  : ""
              }
            >
              <PaginationLink
                onClick={() => handlePageChange(Number(pageNumber))}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* Tombol Selanjutnya */}
        {meta.page < meta.totalPage && (
          <PaginationItem>
            <PaginationNext onClick={() => handlePageChange(meta.page + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};
