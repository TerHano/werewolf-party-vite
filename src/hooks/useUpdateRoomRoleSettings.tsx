import { useApiMutation } from "./useApiMutation";
import { RoomRoleSettingsDto } from "@/dto/RoomRoleSettingsDto";

export const useUpdateRoomRoleSettings = () => {
  return useApiMutation<void, RoomRoleSettingsDto>({
    mutation: {
      endpoint: `room/role-settings`,
      method: "POST",
      queryKeysToInvalidate: [[`room-role-settings`]],
    },
  });
};
