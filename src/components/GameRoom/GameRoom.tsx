import { useRoomId } from "@/hooks/useRoomId";
import { ModeratorView } from "./ModeratorView/ModeratorView";
import { PlayerView } from "@/components/GameRoom/PlayerView/PlayerView";
import { useIsModerator } from "@/hooks/useIsModerator";
import { useSocketConnection } from "@/hooks/useSocketConnection";
import { useQueryClient } from "@tanstack/react-query";
import { querysToInvalidateOnNewGame } from "@/hooks/useStartGame";
import { Skeleton } from "@/components/ui-addons/skeleton";
import { lazy } from "react";
import { useWinCondition } from "@/hooks/useWinCondition";

const WinConditionPage = lazy(
  () => import("@/components/GameRoom/WinConditionPage")
);

export const GameRoom = () => {
  const roomId = useRoomId();

  const {
    data: winCondition,
    refetch,
    isLoading: isWinConditionLoading,
  } = useWinCondition(roomId);

  const { data: isModerator, isLoading: isModeratorLoading } =
    useIsModerator(roomId);
  const queryClient = useQueryClient();

  useSocketConnection({
    onWinConditionMet: () => {
      refetch();
    },
    onGameRestart: () => {
      querysToInvalidateOnNewGame.forEach((q) => {
        queryClient.invalidateQueries({ queryKey: q });
      });
    },
  });

  if (isWinConditionLoading || isModeratorLoading) {
    return <Skeleton loading={true} height={100} />;
  }
  if (winCondition) {
    return (
      <WinConditionPage winCondition={winCondition} isModerator={isModerator} />
    );
  }
  if (isModerator) {
    return <ModeratorView />;
  }
  return <PlayerView />;
};
