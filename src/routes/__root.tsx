import { Toaster } from "@/components/ui-addons/toaster";
import { SocketProvider } from "@/context/SocketProvider";
import { getApi } from "@/util/api";
import { getSessionCookie, setSessionCookie } from "@/util/cookie";
import { Container, Skeleton } from "@chakra-ui/react";
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  wrapInSuspense: true,
  beforeLoad: async () => {
    const token = getSessionCookie();
    if (token == "") {
      await getApi<string>({
        url: `${import.meta.env.WEREWOLF_SERVER_URL}/api/player/get-id`,
        method: "POST",
      }).then((token) => setSessionCookie(token));
    }
  },
  pendingComponent: () => {
    <Skeleton h={200} w={200} />;
  },
  component: () => (
    <SocketProvider>
      <Container justifyItems="center" p={2}>
        <Outlet />
        <Toaster />
      </Container>
    </SocketProvider>
  ),
});
