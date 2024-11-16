import { FC, ReactNode } from "react";
import { ReactQueryProvider } from "../providers/react-query-provider";

export const AppProviders: FC<{ children: ReactNode }> = ({ children }) => (
   <ReactQueryProvider>{children}</ReactQueryProvider>
);
