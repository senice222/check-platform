import { FC, ReactNode } from "react";
import { ReactQueryProvider } from "../providers/react-query-provider";
import { NotificationProvider } from "../contexts/NotificationContext/NotificationContext";

export const AppProviders: FC<{ children: ReactNode }> = ({ children }) => (
   <ReactQueryProvider><NotificationProvider>{children}</NotificationProvider></ReactQueryProvider>
);
