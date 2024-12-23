import { useApiQuery } from "./useApiQuery";
import { RoomRoleSettingsDto } from "@/dto/RoomRoleSettingsDto";

export const useRoomRoleSettings = (roomId: string) => {
  return useApiQuery<RoomRoleSettingsDto>({
    queryKey: ["room-role-settings"],
    query: {
      endpoint: `room/${roomId}/role-settings`,
    },
  });
};
