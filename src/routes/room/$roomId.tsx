import { GameRoom } from "@/components/GameRoom/GameRoom";
import { AddEditPlayerModal } from "@/components/Lobby/AddEditPlayerModal";
import { Lobby } from "@/components/Lobby/Lobby";
import { RoomContext } from "@/context/RoomProvider";
import { AddEditPlayerDetailsDto } from "@/dto/AddEditPlayerDetailsDto";
import { GameState } from "@/enum/GameState";
import { useCheckRoom } from "@/hooks/useCheckRoom";
import { useGameState } from "@/hooks/useGameState";
import { useIsPlayerInRoom } from "@/hooks/useIsPlayerInRoom";
import { useSocketConnection } from "@/hooks/useSocketConnection";
import { getApi } from "@/util/api";
import { Skeleton } from "@chakra-ui/react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
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
  const navigate = useNavigate();
  const { mutate: checkRoomMutate } = useCheckRoom({
    onSuccess: async (data) => {
      if (!data) {
        navigate({ to: "/" });
      } else {
        joinRoom(roomId).then(() => {
          void refetchIsPlayerInRoom();
        });
      }
    },
  });
  const { data: isPlayerAlreadyInRoom, refetch: refetchIsPlayerInRoom } =
    useIsPlayerInRoom({
      roomId,
      options: {
        initialData: _isPlayerAlreadyInRoomInitialData,
      },
    });

  const { joinRoom } = useSocketConnection({
    onReconnect: () => {
      checkRoomMutate({ roomId });
    },
  });

  useEffect(() => {
    if (isPlayerAlreadyInRoom) {
      joinRoom(roomId);
    }
  }, [isPlayerAlreadyInRoom, joinRoom, roomId]);

  const joinRoomCb = useCallback(
    (playerDetails: AddEditPlayerDetailsDto) => {
      joinRoom(roomId, playerDetails).then(() => {
        console.log("joined");
        void refetchIsPlayerInRoom();
      });
    },
    [joinRoom, refetchIsPlayerInRoom, roomId]
  );

  return (
    <RoomContext.Provider value={{ roomId }}>
      {isPlayerAlreadyInRoom ? (
        <Room roomId={roomId} />
      ) : (
        <AddEditPlayerModal submitCallback={joinRoomCb} />
      )}
    </RoomContext.Provider>
  );
}

const Room = ({ roomId }: { roomId: string }) => {
  const {
    data: currentGameState,
    refetch: refetchGameState,
    isLoading: isGameStateLoading,
  } = useGameState(roomId);
  useSocketConnection({
    onGameStateChanged: () => {
      refetchGameState();
    },
  });

  if (isGameStateLoading) {
    return <Skeleton loading height={100} />;
  }

  if (currentGameState === GameState.Lobby) {
    return <Lobby />;
  } else {
    return <GameRoom />;
  }
};
