import { useRoomId } from "@/hooks/useRoomId";
import { ModeratorView } from "./ModeratorView/ModeratorView";
import { PlayerView } from "@/components/GameRoom/PlayerView/PlayerView";
import { WinConditionDialog } from "./WinConditionDialog";
import { useIsModerator } from "@/hooks/useIsModerator";
import { useSocketConnection } from "@/hooks/useSocketConnection";
import { useQueryClient } from "@tanstack/react-query";
import { querysToInvalidateOnNewGame } from "@/hooks/useStartGame";
import { Skeleton } from "@/components/ui-addons/skeleton";

export const GameRoom = () => {
  const roomId = useRoomId();
  // const { data: moderator, isFetching: isModeratorLoading } =
  //   useModerator(roomId);
  // const { data: currentPlayer, isFetching: isCurrentPlayerLoading } =
  //   useCurrentPlayer(roomId);

  const { data: isModerator, isLoading } = useIsModerator(roomId);
  const queryClient = useQueryClient();

  useSocketConnection({
    onGameRestart: () => {
      querysToInvalidateOnNewGame.forEach((q) => {
        queryClient.invalidateQueries({ queryKey: q });
      });
    },
  });

  return (
    <Skeleton loading={isLoading} height={100}>
      <WinConditionDialog isModerator={isModerator}>
        {isModerator ? <ModeratorView /> : <PlayerView />}
      </WinConditionDialog>
    </Skeleton>
  );
};
