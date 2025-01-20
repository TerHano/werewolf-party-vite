import { RoomRequestDto } from "@/dto/RoomRequestDto";
import { mutationOptions, useApiMutation } from "./useApiMutation";

export const querysToInvalidateOnNewGame = [
  ["assigned-role"],
  ["day-details"],
  ["assigned-roles"],
  ["win-condition"],
  ["all-queued-actions"],
];

export const useStartGame = (
  options: mutationOptions<void, RoomRequestDto> = {}
) => {
  return useApiMutation<void, RoomRequestDto>({
    mutation: {
      endpoint: "room/start-game",
      method: "POST",
      queryKeysToInvalidate: querysToInvalidateOnNewGame,
    },
    ...options,
  });
};
