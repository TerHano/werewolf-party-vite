import { useCallback, useContext, useEffect } from "react";
import { AddEditPlayerDetailsDto } from "@/dto/AddEditPlayerDetailsDto";
import { APIResponse } from "@/dto/APIResponse";
import { SocketContext } from "@/context/SocketContext";
import { HubConnectionState } from "@microsoft/signalr";

interface UseSocketConnection {
  onLobbyUpdated?: () => void;
  onGameStateChanged?: () => void;
  onModeratorUpdated?: (moderatorId: number) => void;
  onPlayerKicked?: (kickedPlayerId: number) => void;
  onReconnect?: () => void;
  onRoomRoleSettingsUpdated?: () => void;
  onDayOrTimeUpdated?: () => void;
  onWinConditionMet?: () => void;
  onGameRestart?: () => void;
}

export const useSocketConnection = ({
  onLobbyUpdated,
  onModeratorUpdated,
  onGameStateChanged,
  onPlayerKicked,
  onReconnect,
  onRoomRoleSettingsUpdated,
  onDayOrTimeUpdated,
  onWinConditionMet,
  onGameRestart,
}: UseSocketConnection) => {
  const connection = useContext(SocketContext);
  if (connection == null) {
    throw new Error("Socket connection not set");
  }

  useEffect(() => {
    // if (connection.state === HubConnectionState.Connected) {
    if (onLobbyUpdated) {
      connection.on("PlayersInLobbyUpdated", onLobbyUpdated);
    }
    if (onModeratorUpdated) {
      connection.on("ModeratorUpdated", onModeratorUpdated);
    }
    if (onPlayerKicked) {
      connection.on("PlayerKicked", onPlayerKicked);
    }
    if (onReconnect) {
      connection.onreconnected(onReconnect);
    }
    if (onRoomRoleSettingsUpdated) {
      connection.on("RoomRoleSettingsUpdated", onRoomRoleSettingsUpdated);
    }
    if (onGameStateChanged) {
      connection.on("GameState", onGameStateChanged);
    }
    if (onDayOrTimeUpdated) {
      connection.on("DayTimeUpdated", onDayOrTimeUpdated);
    }
    if (onWinConditionMet) {
      connection.on("WinConditionMet", onWinConditionMet);
    }
    if (onGameRestart) {
      connection.on("GameRestart", onGameRestart);
    }

    return () => {
      if (onLobbyUpdated) {
        connection.off("PlayersInLobbyUpdated", onLobbyUpdated);
      }
      if (onModeratorUpdated) {
        connection.off("ModeratorUpdated", onModeratorUpdated);
      }
      if (onRoomRoleSettingsUpdated) {
        connection.off("RoomRoleSettingsUpdated", onRoomRoleSettingsUpdated);
      }
      if (onPlayerKicked) {
        connection.off("PlayerKicked", onPlayerKicked);
      }
      if (onGameStateChanged) {
        connection.off("GameState", onGameStateChanged);
      }
      if (onDayOrTimeUpdated) {
        connection.off("DayTimeUpdated", onDayOrTimeUpdated);
      }
      if (onWinConditionMet) {
        connection.off("WinConditionMet", onWinConditionMet);
      }
      if (onGameRestart) {
        connection.off("GameRestart", onGameRestart);
      }
    };
  }, [
    connection,
    connection.state,
    onDayOrTimeUpdated,
    onGameRestart,
    onGameStateChanged,
    onLobbyUpdated,
    onModeratorUpdated,
    onPlayerKicked,
    onReconnect,
    onRoomRoleSettingsUpdated,
    onWinConditionMet,
  ]);

  connection.onclose(() => {
    console.log("closing");
  });

  const joinRoom = useCallback(
    (addEditPlayerDetails: AddEditPlayerDetailsDto) => {
      return connection.invoke<APIResponse>("JoinRoom", addEditPlayerDetails);
    },
    [connection]
  );

  const attemptReconnection = useCallback(() => {
    if (connection.state === HubConnectionState.Disconnected) {
      connection.start();
    }
  }, [connection]);

  // if (connection.state === signalR.HubConnectionState.Disconnected) {
  //   connection.start();
  // }

  return {
    //onConnected: connection.invoke,
    joinRoom,
    attemptReconnection,
    connectionState: connection.state,
  };
};
