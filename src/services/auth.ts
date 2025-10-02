import { apiClient } from "@/lib/apiClient";

type LoginPayload = {
  username: string;
  password: string;
};

type LoginResponseAPI = {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    user: {
      id: number;
      username: string;
      role: string[];
    };
  };
};

type LoginResponse = {
  access_token: string;
  user: {
    id: number;
    username: string;
    role: string[];
  };
};

export const login = async (data: LoginPayload): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponseAPI>("/auth/login", data);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
