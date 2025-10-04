export interface ArticleCategoryType {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface ArticleCategoryDetailType extends ArticleCategoryType {
  articles: {
    id: number;
    title: string;
    slug: string;
    created_at: string;
    updated_at: string;
  };
}
