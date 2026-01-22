import api from "@/api/axios";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const login = (data: LoginPayload) => api.post("/auth/login", data);

export const register = (data: RegisterPayload) =>
  api.post("/auth/register", data);

// export const me = () =>
//   api.get("/me");

export const logout = () => api.post("/auth/logout");
