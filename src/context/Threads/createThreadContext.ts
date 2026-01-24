import type { ThreadContextType } from "@/types/threads";
import { createContext } from "react";

export const ThreadContext = createContext<ThreadContextType | undefined>(
  undefined,
);
