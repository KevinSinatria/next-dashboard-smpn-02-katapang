import { SWRHooksQueryParams } from "@/types";
import { HeadmasterType } from "../types";
import { Meta } from "@/types/metaTypes";
import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";

export function useHeadmasters(queryParams?: SWRHooksQueryParams) {
  const params = new URLSearchParams();
  if (queryParams?.page) params.append("page", queryParams.page.toString());
  if (queryParams?.limit) params.append("limit", queryParams.limit.toString());
  if (queryParams?.search)
    params.append("search", queryParams.search.toString());

  const queryString = params.toString();
  const swrKey = `/headmasters${queryString ? `?${queryString}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR<{
    data: HeadmasterType[];
    meta: Meta;
  }>(swrKey, fetcher);

  return {
    headmasters: data?.data,
    meta: data?.meta,
    isLoading,
    error,
    mutate,
  };
}
