import type { ThreadContextType } from "@/types/threads";
import { createContext } from "react";
import type { ModalThreadProviderType } from "./ThreadContext";

export const ThreadContext = createContext<ThreadContextType | undefined>(
  undefined,
);
export const ModalThreadContext = createContext<
  ModalThreadProviderType | undefined
>(undefined);
