export interface SchoolInformationType {
  id: number;
  email: string | null;
  phone: string | null;
  vision: string | null;
  missions: string | null;
  address: string | null;
  map_url: string | null;
  email_url: string | null;
  phone_url: string | null;
  instagram: string | null;
  instagram_url: string | null;
  created_at: Date;
  updated_at: Date;
}
