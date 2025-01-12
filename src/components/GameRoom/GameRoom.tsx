import { useCurrentPlayer } from "@/hooks/useCurrentPlayer";
import { useModerator } from "@/hooks/useModerator";
import { useRoomId } from "@/hooks/useRoomId";
import { Skeleton } from "../ui/skeleton";
import { ModeratorView } from "./ModeratorView";
import { PlayerView } from "./PlayerView";

export const GameRoom = () => {
  const roomId = useRoomId();
  const { data: moderator, isFetching: isModeratorLoading } =
    useModerator(roomId);
  const { data: currentPlayer, isFetching: isCurrentPlayerLoading } =
    useCurrentPlayer(roomId);

  if (isModeratorLoading || isCurrentPlayerLoading) {
    return <Skeleton loading height={100} />;
  }

  const isModerator = currentPlayer?.id === moderator?.id;

  return isModerator ? <ModeratorView /> : <PlayerView />;
};
