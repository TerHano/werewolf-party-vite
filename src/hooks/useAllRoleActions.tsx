import { PlayerRoleActionDto } from "@/dto/PlayerRoleActionDto";
import { useApiQuery } from "./useApiQuery";

export const useAllRoleActions = (roomId: string) => {
  return useApiQuery<PlayerRoleActionDto[]>({
    queryKey: ["all-role-actions", roomId],
    query: {
      endpoint: `game/${roomId}/role-actions`,
    },
  });
};
