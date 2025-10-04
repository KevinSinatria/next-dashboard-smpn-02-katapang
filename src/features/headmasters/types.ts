import { OutputData } from "@editorjs/editorjs";

export interface HeadmasterType {
  id: number;
  name: string;
  image_url: string;
  start_year: number;
  end_year: number;
  is_active: boolean;
}

export interface HeadmasterDetailType extends HeadmasterType {
  welcoming_sentence: OutputData;
  personnel_id: number;
}
