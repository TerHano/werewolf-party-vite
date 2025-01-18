import { ActionType } from "@/enum/ActionType";

export interface QueuedActionDto {
  id: number;
  playerId: string;
  action: ActionType;
  affectedPlayerId: string;
}
