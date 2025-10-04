import { Meta } from "@/types/metaTypes";
import { PersonnelType } from "../types";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

interface PersonnelsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export function usePersonnels(queryParams?: PersonnelsQueryParams) {
  const params = new URLSearchParams();
  if (queryParams?.page) params.append("page", queryParams.page.toString());
  if (queryParams?.limit) params.append("limit", queryParams.limit.toString());
  if (queryParams?.search)
    params.append("search", queryParams.search.toString());

  const queryString = params.toString();
  const swrKey = `/personnel${queryString ? `?${queryString}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR<{
    data: PersonnelType[];
    meta: Meta;
  }>(swrKey, fetcher);

  return {
    personnels: data?.data,
    meta: data?.meta,
    isLoading,
    error,
    mutate,
  };
}
