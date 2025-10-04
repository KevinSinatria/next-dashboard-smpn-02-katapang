export interface PersonnelType {
  id: number;
  name: string;
  image_url: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RolePersonnelType {
  personnel_role_id: number;
  role_id: number;
  role: string;
  subject: string | null;
  position: string | null;
}

export interface PersonnelDetailType extends PersonnelType {
  roles: RolePersonnelType[];
}
