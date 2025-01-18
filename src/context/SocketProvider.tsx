import { getApi } from "@/util/api";
import { getSessionCookie, setSessionCookie } from "@/util/cookie";
import {
  HubConnectionState,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Button,
  DialogBackdrop,
  DialogBody,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ProgressRoot, ProgressBar } from "@/components/ui/progress";
import { DialogContent, DialogRoot } from "@/components/ui/dialog";
import { IconPlugConnectedX } from "@tabler/icons-react";
import { useDebounce, useIsFirstRender } from "@uidotdev/usehooks";
import { useTranslation } from "react-i18next";
import { SocketContext } from "./SocketContext";

export const SocketProvider = ({ children }: PropsWithChildren) => {
  const { t } = useTranslation();
  const [isReconnectDisabled, setReconnectDisabled] = useState(false);
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
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();
  }, []);
  const dialogMessage = useMemo(() => {
    switch (connectionState) {
      case HubConnectionState.Connecting:
        return t("Connecting to Server");
      case HubConnectionState.Reconnecting:
        return t("Reconnecting to Server");
      case HubConnectionState.Disconnected:
        return t("Disconnected from Server");
    }
  }, [connectionState, t]);

  const startConnection = useCallback(
    () =>
      connection
        .start()
        .then(() => {
          setConnectionState(connection.state);
        })
        .catch(() => {
          setConnectionState(connection.state);
        }),
    [connection]
  );
  useEffect(() => {
    console.log("do thing", connection.state);

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

  //const isConnected =

  return (
    <SocketContext.Provider value={connection}>
      <DialogRoot
        //  size=""
        open={
          connectionState !== undefined &&
          connectionState !== HubConnectionState.Connected
        }
        motionPreset="slide-in-bottom"
      >
        <DialogBackdrop />
        <DialogContent>
          <DialogBody>
            <Stack gap={4}>
              <Stack alignItems="center">
                <IconPlugConnectedX size="8rem" />
                <Text fontSize="1rem">{dialogMessage}</Text>
                {connectionState === HubConnectionState.Disconnected ||
                connectionState == HubConnectionState.Connecting ? (
                  <Button
                    disabled={
                      isReconnectDisabled ||
                      connectionState === HubConnectionState.Connecting
                    }
                    onClick={() => {
                      setConnectionState(HubConnectionState.Connecting);
                      setReconnectDisabled(true);
                      setTimeout(() => {
                        setReconnectDisabled(false);
                      }, 2000);
                      startConnection();
                    }}
                  >
                    Reconnect
                  </Button>
                ) : null}
              </Stack>
              {isReconnectDisabled ||
              connectionState !== HubConnectionState.Disconnected ? (
                <ProgressRoot size="lg" value={null}>
                  <ProgressBar />
                </ProgressRoot>
              ) : null}
            </Stack>
          </DialogBody>
        </DialogContent>
      </DialogRoot>
      {connectionState === HubConnectionState.Connected ? children : null}
    </SocketContext.Provider>
  );
};
