import { RoomRequestDto } from "@/dto/RoomRequestDto";
import { mutationOptions, useApiMutation } from "./useApiMutation";

export const useLeaveRoom = (
  options: mutationOptions<void, RoomRequestDto> = {}
) => {
  return useApiMutation<void, RoomRequestDto>({
    mutation: {
      endpoint: "room/leave-room",
      method: "POST",
    },
    ...options,
  });
};
