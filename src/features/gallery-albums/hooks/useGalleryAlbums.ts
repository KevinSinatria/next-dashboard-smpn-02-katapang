import { SWRHooksQueryParams } from "@/types";
import useSWR from "swr";
import { GalleryAlbumType } from "../types";
import { Meta } from "@/types/metaTypes";
import { fetcher } from "@/lib/fetcher";

export function useGalleryAlbums(queryParams?: SWRHooksQueryParams) {
  const params = new URLSearchParams();
  if (queryParams?.page) params.append("page", queryParams.page.toString());
  if (queryParams?.limit) params.append("limit", queryParams.limit.toString());
  if (queryParams?.search)
    params.append("search", queryParams.search.toString());

  const queryString = params.toString();
  const swrKey = `/gallery-albums${queryString ? `?${queryString}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR<{
    data: GalleryAlbumType[];
    meta: Meta;
  }>(swrKey, fetcher);

  return {
    galleryAlbums: data?.data,
    meta: data?.meta,
    isLoading,
    error,
    mutate,
  };
}
