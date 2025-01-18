import { useApiQuery } from "./useApiQuery";
import { PlayerRoleActionDto } from "@/dto/PlayerRoleActionDto";

export const useAllPlayerRoles = (roomId: string) => {
  return useApiQuery<PlayerRoleActionDto[]>({
    queryKey: ["assigned-roles", roomId],
    query: {
      endpoint: `game/${roomId}/all-player-roles`,
    },
  });
};
