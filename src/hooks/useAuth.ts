import { AuthContext } from "@/context/createContext";
import { useContext } from "react";

// custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
