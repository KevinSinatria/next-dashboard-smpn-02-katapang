import useSWR from "swr";
import { ArticleDetailType } from "../types";
import { fetcher } from "@/lib/fetcher";

export function useArticle(slug: string) {
  const { data, error, isLoading, mutate } = useSWR<{
    data: ArticleDetailType;
  }>(`/articles/${slug}`, fetcher);

  return {
    article: data?.data,
    isLoading,
    error,
    mutate,
  };
}