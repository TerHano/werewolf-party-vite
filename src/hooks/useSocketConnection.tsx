import { useCallback, useContext, useEffect, useMemo } from "react";
import { AddEditPlayerDetailsDto } from "@/dto/AddEditPlayerDetailsDto";
import { APIResponse } from "@/dto/APIResponse";
import { SocketContext } from "@/context/SocketProvider";

type OnHubMethod = (...args: any[]) => any;

interface UseSocketConnection {
  onLobbyUpdated?: OnHubMethod;
  onModeratorUpdated?: OnHubMethod;
  onReconnect?: OnHubMethod;
  onRoomRoleSettingsUpdated?: OnHubMethod;
}

export const useSocketConnection = ({
  onLobbyUpdated,
  onModeratorUpdated,
  onReconnect,
  onRoomRoleSettingsUpdated,
}: UseSocketConnection) => {
  const connection = useContext(SocketContext);
  if (connection == null) {
    throw new Error("Socket connection not set");
  }

  useEffect(() => {
    if (onLobbyUpdated) {
      connection.on("PlayersInLobbyUpdated", onLobbyUpdated);
    }
    if (onModeratorUpdated) {
      connection.on("ModeratorUpdated", onModeratorUpdated);
    }
    if (onReconnect) {
      connection.onreconnected(onReconnect);
    }
    if (onRoomRoleSettingsUpdated) {
      connection.on("RoomRoleSettingsUpdated", onRoomRoleSettingsUpdated);
    }

    return () => {
      if (onLobbyUpdated) {
        connection.off("PlayersInLobbyUpdated", onLobbyUpdated);
      }
      if (onModeratorUpdated) {
        connection.off("ModeratorUpdated", onModeratorUpdated);
      }
    };
  }, []);

  connection.onclose(() => {
    console.log("closing");
  });

  const joinRoom = useCallback(
    (roomId: string, playerDetails?: AddEditPlayerDetailsDto) => {
      return connection.invoke<APIResponse>("JoinRoom", roomId, playerDetails);
    },
    [connection]
  );

  // if (connection.state === signalR.HubConnectionState.Disconnected) {
  //   connection.start();
  // }

  return {
    //onConnected: connection.invoke,
    joinRoom,
  };
};
