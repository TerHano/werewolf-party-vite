import { ActionType } from "@/enum/ActionType";

export interface QueuedActionRequestDto {
  roomId: string;
  playerId?: string;
  action: ActionType;
  affectedPlayerId: string;
}
