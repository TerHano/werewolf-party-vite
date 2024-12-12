import { Toaster } from "@/components/ui/toaster";
import { APIResponse } from "@/dto/APIResponse";
import { Container, Skeleton } from "@chakra-ui/react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  wrapInSuspense: true,
  beforeLoad: async () => {
    await fetch(`${import.meta.env.WEREWOLF_SERVER_URL}/api/player/get-id`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((response: APIResponse<string>) => {
        if (response.success && response.data) {
          document.cookie = "session=" + response.data;
        }
      });
  },
  pendingComponent: () => {
    <Skeleton h={200} w={200} />;
  },
  component: () => (
    <>
      <Container justifyItems="center" p={2}>
        <Outlet />
        <Toaster />
      </Container>
      <TanStackRouterDevtools />
    </>
  ),
});
