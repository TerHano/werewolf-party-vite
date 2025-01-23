import { useRoomId } from "@/hooks/useRoomId";
import { Skeleton } from "../ui/skeleton";
import { ModeratorView } from "./ModeratorView";
import { PlayerView } from "./PlayerView";
import { WinConditionDialog } from "./WinConditionDialog";
import { useIsModerator } from "@/hooks/useIsModerator";
import { useSocketConnection } from "@/hooks/useSocketConnection";
import { useQueryClient } from "@tanstack/react-query";
import { querysToInvalidateOnNewGame } from "@/hooks/useStartGame";

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

  if (isLoading) {
    return <Skeleton loading height={100} />;
  }

  return (
    <>
      <WinConditionDialog isModerator={isModerator}>
        {isModerator ? <ModeratorView /> : <PlayerView />}
      </WinConditionDialog>
    </>
  );
};
