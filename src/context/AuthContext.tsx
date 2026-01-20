import { useEffect, useState } from "react";
import axios from "axios";
import * as authService from "../services/auth.service";
import { AuthContext, type User } from "./createContext";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // cek login saat app load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // const res = await authService.me();
        // setUser(res.data.user);
        console.log(user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      const res = await authService.login({ email, password });
      //   const res = await authService.me();
      setUser(res.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message);
      }
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await authService.register({ name, email, password });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message);
      }
      throw error;
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
