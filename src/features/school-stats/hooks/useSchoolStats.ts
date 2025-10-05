import useSWR from "swr";
import { SchoolStatType } from "../types";
import { fetcher } from "@/lib/fetcher";
import { Meta } from "@/types/metaTypes";

interface SchoolStatsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export function useSchoolStats(queryParams?: SchoolStatsQueryParams) {
  const params = new URLSearchParams();
  if (queryParams?.page) params.append("page", queryParams.page.toString());
  if (queryParams?.limit) params.append("limit", queryParams.limit.toString());
  if (queryParams?.search)
    params.append("search", queryParams.search.toString());

  const queryString = params.toString();
  const swrKey = `/school-stats${queryString ? `?${queryString}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR<{
    data: SchoolStatType[];
    meta: Meta;
  }>(swrKey, fetcher);

  return {
    schoolStats: data?.data,
    meta: data?.meta,
    isLoading,
    error,
    mutate,
  };
}