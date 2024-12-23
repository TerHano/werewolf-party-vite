import { getApi } from "@/util/api";
import { getSessionCookie, setSessionCookie } from "@/util/cookie";
import * as signalR from "@microsoft/signalr";
import React, { PropsWithChildren, useEffect, useMemo } from "react";
import { DialogBackdrop, DialogBody, Text, VStack } from "@chakra-ui/react";
import { DialogContent, DialogRoot } from "@/components/ui/dialog";
import { IconPlugConnectedX } from "@tabler/icons-react";
import { useDebounce } from "@uidotdev/usehooks";

export const SocketContext = React.createContext<signalR.HubConnection | null>(
  null
);

export const SocketProvider = ({ children }: PropsWithChildren) => {
  const [_isConnected, setIsConnected] = React.useState<boolean | undefined>(
    undefined
  );
  const isConnected = useDebounce(_isConnected, 50);
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
  if (connection.state === signalR.HubConnectionState.Disconnected) {
    setIsConnected(false);
    connection.start().then(() => {
      setIsConnected(true);
    });
  }

  connection.onreconnecting(() => {
    setIsConnected(false);
  });

  connection.onreconnected(() => {
    setIsConnected(true);
  });

  return (
    <SocketContext.Provider value={connection}>
      <DialogRoot
        //  size=""
        open={isConnected === false}
        motionPreset="slide-in-bottom"
      >
        <DialogBackdrop />
        <DialogContent>
          <DialogBody>
            <VStack>
              <IconPlugConnectedX size="8rem" />
              <Text fontSize="1rem">Connecting to server...</Text>
            </VStack>
          </DialogBody>
        </DialogContent>
      </DialogRoot>
      {isConnected ? children : null}
    </SocketContext.Provider>
  );
};
