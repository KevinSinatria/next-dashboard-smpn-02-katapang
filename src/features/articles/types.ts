import { OutputData } from "@editorjs/editorjs";

export interface ArticleType {
  id: number;
  title: string;
  slug: string;
  thumbnail_url: string;
  author: string;
  category: string;
  published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface ArticleDetailType extends ArticleType {
  content: OutputData;
  author_id: number;
  category_id: number;
}
