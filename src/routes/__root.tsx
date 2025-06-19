import { GlobalError } from "@/components/GlobalError";
import { Skeleton } from "@/components/ui-addons/skeleton";
import { Toaster } from "@/components/ui-addons/toaster";
import { SocketProvider } from "@/context/SocketProvider";
import { getApi } from "@/util/api";
import { getSessionCookie, setSessionCookie } from "@/util/cookie";
import { Container } from "@chakra-ui/react";
import { CatchBoundary, createRootRoute, Outlet } from "@tanstack/react-router";
import "@/i18n";

export const Route = createRootRoute({
  wrapInSuspense: true,
  beforeLoad: async () => {
    const token = getSessionCookie();
    if (token == "") {
      return getApi<string>({
        url: `${import.meta.env.WEREWOLF_SERVER_URL}/api/player/get-id`,
        method: "POST",
      }).then((token) => setSessionCookie(token));
    }
    return;
  },
  pendingComponent: () => {
    <Skeleton h={200} w={200} loading />;
  },
  component: () => (
    <CatchBoundary
      getResetKey={() => "reset"}
      errorComponent={(e) => <GlobalError {...e} />}
    >
      <SocketProvider>
        <Container maxWidth={800} justifyItems="center" p={2}>
          <Outlet />
        </Container>
      </SocketProvider>
      <Toaster />
    </CatchBoundary>
  ),
});
