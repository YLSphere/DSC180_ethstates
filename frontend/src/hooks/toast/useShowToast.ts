import { useCallback } from "react";
import { ToastPosition, useToast, UseToastOptions } from "@chakra-ui/react";

export const useShowToast = (): ((options: UseToastOptions) => void) => {
  const toast = useToast();

  return useCallback(
    (options: UseToastOptions) => {
      toast({
        position: "bottom" as ToastPosition | undefined,
        isClosable: true,
        ...options,
      });
    },
    [toast]
  );
};
