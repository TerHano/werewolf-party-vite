import { PlayerDto } from "@/dto/PlayerDto";
import { useApiQuery } from "./useApiQuery";

export const useCurrentPlayer = (roomId: string) => {
  return useApiQuery<PlayerDto>({
    queryKey: ["current-player", roomId],
    query: {
      endpoint: `player/${roomId}/player`,
    },
  });
};
