import { AddEditPlayerModal } from "@/components/Lobby/AddEditPlayerModal";
import { Lobby } from "@/components/Lobby/Lobby";
import { RoomContext } from "@/context/RoomProvider";
import { AddEditPlayerDetailsDto } from "@/dto/AddEditPlayerDetailsDto";
import { useIsPlayerInRoom } from "@/hooks/useIsPlayerInRoom";
import { useSocketConnection } from "@/hooks/useSocketConnection";
import { getApi } from "@/util/api";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useCallback, useEffect } from "react";

export const Route = createFileRoute("/room/$roomId")({
  component: RouteComponent,
  loader: async ({ params: { roomId } }) => {
    const doesRoomExistQuery = getApi<boolean>({
      url: `${import.meta.env.WEREWOLF_SERVER_URL}/api/room/check-room`,
      method: "POST",
      body: JSON.stringify({
        roomId: roomId,
      }),
    });
    const isPlayerInRoomQuery = getApi<boolean>({
      url: `${import.meta.env.WEREWOLF_SERVER_URL}/api/room/${roomId}/is-player-in-room`,
      method: "GET",
    });
    return await doesRoomExistQuery.then((exists) => {
      if (!exists) {
        throw redirect({
          to: "/",
        });
      }
      return isPlayerInRoomQuery;
    });
  },
});

function RouteComponent() {
  const { roomId } = Route.useParams();
  const _isPlayerAlreadyInRoomInitialData = Route.useLoaderData();
  const { data: isPlayerAlreadyInRoom, refetch } = useIsPlayerInRoom({
    roomId,
    options: {
      initialData: _isPlayerAlreadyInRoomInitialData,
    },
  });

  useEffect(() => {
    if (isPlayerAlreadyInRoom) {
      joinRoom(roomId);
    }
  }, []);

  const queryClient = useQueryClient();

  // const onLobbyUpdated = useCallback(() => {
  //   queryClient.invalidateQueries({ queryKey: ["players"] });

  //   console.log("thig");
  // }, []);

  const { joinRoom } = useSocketConnection({
    onLobbyUpdated: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      console.log("thig");
    },
    onReconnect: () => {
      if (isPlayerAlreadyInRoom) {
        joinRoom(roomId);
      }
    },
  });

  const joinRoomCb = useCallback((playerDetails: AddEditPlayerDetailsDto) => {
    joinRoom(roomId, playerDetails).then((resp) => {
      console.log("joined");
      void refetch();
    });
  }, []);

  return (
    <RoomContext.Provider value={{ roomId }}>
      {isPlayerAlreadyInRoom ? (
        <Lobby roomId={roomId} />
      ) : (
        <AddEditPlayerModal submitCallback={joinRoomCb} />
      )}
    </RoomContext.Provider>
  );
}
