import { createContext } from "react";

export interface User {
  id: number;
  name: string;
  email: string;
}
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    fullname: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
