"use client";

import {
  Toaster as ChakraToaster,
  Icon,
  JsxStyleProps,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from "@chakra-ui/react";
import { useCallback } from "react";

type ToastType = "success" | "error" | "loading" | "info" | (string & {});

export const toaster = createToaster({
  placement: "bottom-end",
  pauseOnPageIdle: true,
});

export const Toaster = () => {
  const getToastCss = useCallback<
    (toastType: ToastType | undefined) => JsxStyleProps["css"]
  >((toastType) => {
    switch (toastType) {
      case "success":
        return { bgColor: "green.subtle", color: "green.fg" };
      case "error":
        return {
          bgColor: "red.subtle",
          color: "red.fg",
        };
      case "warning":
        return {
          bgColor: "yellow.subtle",
          color: "yellow.fg",
        };
      case "info":
        return {
          bgColor: "blue.subtle",
          color: "blue.fg",
        };
      default:
        return undefined;
    }
  }, []);
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: "4" }}>
        {(toast) => (
          <Toast.Root css={getToastCss(toast.type)} width={{ md: "sm" }}>
            {toast.type === "loading" ? (
              <Spinner size="sm" color="blue.solid" />
            ) : toast.meta?.icon ? (
              <Icon size="sm">{toast.meta.icon}</Icon>
            ) : (
              <Toast.Indicator />
            )}
            <Stack gap="1" flex="1" maxWidth="100%">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && (
                <Toast.Description>{toast.description}</Toast.Description>
              )}
            </Stack>
            {toast.action && (
              <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
            )}
            {toast.meta?.closable && <Toast.CloseTrigger />}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  );
};
