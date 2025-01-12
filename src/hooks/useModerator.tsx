import { PlayerDto } from "@/dto/PlayerDto";
import { useApiQuery } from "./useApiQuery";

export const useModerator = (roomId: string) => {
  return useApiQuery<PlayerDto>({
    queryKey: ["moderator", roomId],
    query: {
      endpoint: `room/${roomId}/get-moderator`,
    },
  });
};
