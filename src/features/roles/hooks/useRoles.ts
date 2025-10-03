import useSWR from "swr";
import { RoleType } from "../types";
import { fetcher } from "@/lib/fetcher";
import { Meta } from "@/types/metaTypes";

interface RolesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export function useRoles(queryParams?: RolesQueryParams) {
  const params = new URLSearchParams();
  if (queryParams?.page) params.append("page", queryParams.page.toString());
  if (queryParams?.limit) params.append("limit", queryParams.limit.toString());
  if (queryParams?.search)
    params.append("search", queryParams.search.toString());

  const queryString = params.toString();
  const swrKey = `/roles${queryString ? `?${queryString}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR<{
    data: RoleType[];
    meta: Meta;
  }>(swrKey, fetcher);

  return {
    roles: data?.data,
    meta: data?.meta,
    isLoading,
    error,
    mutate,
  };
}
