import { SWRHooksQueryParams } from "@/types";
import useSWR from "swr";
import { UserType } from "../types";
import { Meta } from "@/types/metaTypes";
import { fetcher } from "@/lib/fetcher";

export function useUsers(queryParams?: SWRHooksQueryParams) {
  const params = new URLSearchParams();
  if (queryParams?.page) params.append("page", queryParams.page.toString());
  if (queryParams?.limit) params.append("limit", queryParams.limit.toString());
  if (queryParams?.search)
    params.append("search", queryParams.search.toString());

  const queryString = params.toString();
  const swrKey = `/users${queryString ? `?${queryString}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR<{
    data: UserType[];
    meta: Meta;
  }>(swrKey, fetcher);

  return {
    users: data?.data,
    meta: data?.meta,
    isLoading,
    error,
    mutate,
  };
}
