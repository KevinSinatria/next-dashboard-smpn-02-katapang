import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { SchoolEventType } from "../types";

interface SchoolEventsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export function useSchoolEvents(queryParams?: SchoolEventsQueryParams) {
  const params = new URLSearchParams();
  if (queryParams?.page) params.append("page", queryParams.page.toString());
  if (queryParams?.limit) params.append("limit", queryParams.limit.toString());
  if (queryParams?.search)
    params.append("search", queryParams.search.toString());

  const queryString = params.toString();
  const swrKey = `/school-events${queryString ? `?${queryString}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR<{
    data: SchoolEventType[];
  }>(swrKey, fetcher);

  return {
    schoolEvents: data?.data,
    isLoading,
    error,
    mutate,
  };
}
