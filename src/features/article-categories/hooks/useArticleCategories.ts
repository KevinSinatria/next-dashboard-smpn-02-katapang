import useSWR from "swr";
import { ArticleCategoryType } from "../types";
import { fetcher } from "@/lib/fetcher";
import { Meta } from "@/types/metaTypes";

interface ArticleCategoriesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export function useArticleCategories(
  queryParams?: ArticleCategoriesQueryParams
) {
  const params = new URLSearchParams();
  if (queryParams?.page) params.append("page", queryParams.page.toString());
  if (queryParams?.limit) params.append("limit", queryParams.limit.toString());
  if (queryParams?.search)
    params.append("search", queryParams.search.toString());

  const queryString = params.toString();
  const swrKey = `/article-categories${queryString ? `?${queryString}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR<{
    data: ArticleCategoryType[];
    meta: Meta;
  }>(swrKey, fetcher);

  return {
    articleCategories: data?.data,
    meta: data?.meta,
    isLoading,
    error,
    mutate,
  };
}
