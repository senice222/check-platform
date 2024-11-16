import { AxiosError } from "axios";
import { ReactNode } from "react";
import {
  QueryClient as ReactQueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new ReactQueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (failureCount > 3) return false;

        // Don't retry if the error status is 401
        if ((error as AxiosError).response?.status === 401) {
          return false;
        }
        return true;
      },
      retryDelay: (attemptIndex: number) => {
        return Math.min(1000 * 2 ** attemptIndex, 30000);
      },
      staleTime: 30000,
      // refetchInterval: IS_DEV ? 10000 : false,
    },
  },
});

export function ReactQueryProvider({
  children,
  withDevtools = false,
}: {
  children: ReactNode;
  withDevtools?: boolean;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {withDevtools && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
