import {
  ModalThreadContext,
  ThreadContext,
} from "@/context/Threads/createThreadContext";
import { useContext } from "react";

export const useThread = () => {
  const context = useContext(ThreadContext);
  if (!context) {
    throw new Error("useThread harus digunakan di dalam ThreadProvider");
  }
  return context;
};

export const useModalThread = () => {
  const context = useContext(ModalThreadContext);
  if (!context)
    throw new Error("useThread harus digunakan di dalam ThreadProvider");
  return context;
};
