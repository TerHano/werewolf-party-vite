import { getApi } from "@/util/api";
import { getSessionCookie, setSessionCookie } from "@/util/cookie";
import * as signalR from "@microsoft/signalr";
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
  Text,
  VStack,
} from "@chakra-ui/react";
import { DialogContent, DialogRoot } from "@/components/ui/dialog";
import { IconPlugConnectedX } from "@tabler/icons-react";
import { useDebounce, useIsFirstRender } from "@uidotdev/usehooks";
import { useTranslation } from "react-i18next";
import { SocketContext } from "./SocketContext";

export const SocketProvider = ({ children }: PropsWithChildren) => {
  const { t } = useTranslation();
  const isFirstRender = useIsFirstRender();
  const [connectionState, setConnectionState] = useState(
    signalR.HubConnectionState.Disconnected
  );

  const connection = useMemo(() => {
    return new signalR.HubConnectionBuilder()
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
      .configureLogging(signalR.LogLevel.Information)
      .withAutomaticReconnect()
      .build();
  }, []);
  const dialogMessage = useMemo(() => {
    switch (connectionState) {
      case signalR.HubConnectionState.Connecting:
        return t("Connecting to Server");
      case signalR.HubConnectionState.Reconnecting:
        return t("Reconnecting to Server");
      case signalR.HubConnectionState.Disconnected:
        return t("Disconnected from Server");
    }
  }, [connectionState, t]);

  const startConnection = useCallback(
    () =>
      connection.start().then(() => {
        setConnectionState(connection.state);
      }),
    [connection]
  );
  useEffect(() => {
    console.log("do thing", connection.state);
    setConnectionState(connection.state);
    if (isFirstRender) {
      connection.onreconnected(() => {
        console.log("reconnected");
        setConnectionState(connection.state);
      });

      connection.onreconnecting(() => {
        console.log("doin somethin");
      });
      if (connection.state === signalR.HubConnectionState.Disconnected) {
        startConnection();
      }
    }
  }, [connection, connection.state, isFirstRender, startConnection]);

  const isConnected = useDebounce(
    connectionState === signalR.HubConnectionState.Connected,
    200
  );

  return (
    <SocketContext.Provider value={connection}>
      <DialogRoot
        //  size=""
        open={!isConnected}
        motionPreset="slide-in-bottom"
      >
        <DialogBackdrop />
        <DialogContent>
          <DialogBody>
            <VStack>
              <IconPlugConnectedX size="8rem" />
              <Text fontSize="1rem">{dialogMessage}</Text>
              {connectionState === signalR.HubConnectionState.Disconnected ? (
                <Button
                  onClick={() => {
                    startConnection();
                  }}
                >
                  Reconnect
                </Button>
              ) : null}
            </VStack>
          </DialogBody>
        </DialogContent>
      </DialogRoot>
      {isConnected ? children : null}
    </SocketContext.Provider>
  );
};
