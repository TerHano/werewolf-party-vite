import { getApi } from "@/util/api";
import { getSessionCookie, setSessionCookie } from "@/util/cookie";
import {
  HubConnectionState,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Button, Progress, Stack, Text } from "@chakra-ui/react";
import { IconCards, IconPlugConnectedX } from "@tabler/icons-react";
import { useDebounce, useIsFirstRender } from "@uidotdev/usehooks";
import { useTranslation } from "react-i18next";
import { SocketContext } from "./SocketContext";
import { useToaster } from "@/hooks/ui/useToaster";

export const SocketProvider = ({ children }: PropsWithChildren) => {
  const { t } = useTranslation();
  const { showToast } = useToaster();
  const isFirstRender = useIsFirstRender();
  const [_connectionState, setConnectionState] = useState<
    HubConnectionState | undefined
  >(undefined);

  const connectionState = useDebounce(_connectionState, 300);

  const connection = useMemo(() => {
    return new HubConnectionBuilder()
      .withUrl(`${import.meta.env.WEREWOLF_SERVER_URL}/Events`, {
        accessTokenFactory: async () => {
          const token = getSessionCookie();
          if (token == "") {
            const token = await getApi<string>({
              url: `${import.meta.env.WEREWOLF_SERVER_URL}/api/player/get-id`,
              method: "POST",
            });
            setSessionCookie(token);
            return token;
          }
          return token;
        },
      })
      .configureLogging(LogLevel.Error)
      .withAutomaticReconnect()
      .build();
  }, []);
  const dialogMessage = useMemo(() => {
    switch (connectionState) {
      case HubConnectionState.Connecting:
        return t("socket.status.connecting");
      case HubConnectionState.Reconnecting:
        return t("socket.status.reconnecting");
      case HubConnectionState.Disconnected:
        return t("socket.status.disconnected");
    }
  }, [connectionState, t]);

  const startConnection = useCallback(
    () =>
      connection
        .start()
        .then(() => {
          setConnectionState(connection.state);
          console.log("Connection started");
        })
        .catch(() => {
          setConnectionState(connection.state);
          console.log("Connection failed");
          showToast({
            title: t("Connection Error"),
            description: t(
              "Failed to connect to the server. Please try again later."
            ),
            type: "error",
            icon: <IconPlugConnectedX size={12} />,
            duration: 5000,
          });
        }),
    [connection, showToast, t]
  );
  useEffect(() => {
    connection.onreconnected(() => {
      setConnectionState(connection.state);
    });

    connection.onreconnecting(() => {
      setConnectionState(connection.state);
    });

    connection.onclose(() => {
      setConnectionState(connection.state);
    });
    if (isFirstRender) {
      if (connection.state === HubConnectionState.Disconnected) {
        startConnection();
      }
    }
  }, [connection, connection.state, isFirstRender, startConnection]);

  return (
    <SocketContext.Provider value={connection}>
      {connectionState === HubConnectionState.Connected ? (
        children
      ) : (
        <Stack
          //   visibility={!isConnecting ? "hidden" : "visible"}
          className="animate-fade-in-from-bottom"
          paddingTop="20%"
          //  position="absolute"
          // left="20%"
          //top="50%"
          justify="center"
          align="center"
          gap={4}
          mt={4}
        >
          {connectionState === HubConnectionState.Disconnected ? (
            <>
              <IconPlugConnectedX size="128px" />
              <Text color="dimmed" fontSize="1rem">
                {dialogMessage}
              </Text>
              <Button
                size="sm"
                onClick={() => {
                  startConnection();
                }}
              >
                {t("socket.button.reconnect")}
              </Button>
            </>
          ) : (
            <>
              <IconCards size="128px" />
              <Progress.Root size="sm" borderRadius="xl" w="200px" value={null}>
                <Progress.Track>
                  <Progress.Range />
                </Progress.Track>
              </Progress.Root>
              <Text textStyle="accent" color="dimmed" fontSize="1em">
                {t("socket.status.connecting")}
              </Text>
            </>
          )}
        </Stack>
      )}
    </SocketContext.Provider>
  );
};
