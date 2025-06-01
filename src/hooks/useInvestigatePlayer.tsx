import { PlayerRoleDto } from "@/dto/PlayerRoleDto";
import { mutationOptions, useApiMutation } from "./useApiMutation";
import { InvestigationType } from "@/enum/InvestigationType";

type InvestigatePlayerRequest = {
  roomId: string;
  playerRoleId: number;
  investigationType: InvestigationType;
};

export type InvestigatePlayerResponse = {
  playerRole: PlayerRoleDto;
  isInvestigationSuccessful: boolean;
};

export const useInvestigatePlayer = (
  options: mutationOptions<
    InvestigatePlayerResponse,
    InvestigatePlayerRequest
  > = {}
) => {
  return useApiMutation<InvestigatePlayerResponse, InvestigatePlayerRequest>({
    mutation: {
      // queryKeysToInvalidate: [["queued-action"], ["all-queued-actions"]],
      endpoint: `game/investigate`,
      method: "POST",
    },
    ...options,
  });
};
