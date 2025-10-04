export interface PersonnelType {
  id: number;
  name: string;
  image_url: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PersonnelDetailType extends PersonnelType {
  roles: {
    role: string;
    subject: string | null;
    position: string | null;
  }[];
}
