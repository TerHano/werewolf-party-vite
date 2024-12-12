import { useApiQuery } from "./useApiQuery";

interface UseIsPlayerInRoomProps {
  roomId: string;
  options: {
    initialData?: boolean;
  };
}

export const useIsPlayerInRoom = ({
  roomId,
  options: { initialData },
}: UseIsPlayerInRoomProps) => {
  return useApiQuery<boolean>({
    queryKey: ["is-player-in-room"],
    query: {
      endpoint: `room/${roomId}/is-player-in-room`,
      initialData: initialData,
    },
  });
};
