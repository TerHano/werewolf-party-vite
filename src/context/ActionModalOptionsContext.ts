import { PlayerRoleWithDetails } from "@/components/GameRoom/NightView/NightCall";
import { ActionType } from "@/enum/ActionType";
import React from "react";

interface ActionModalOptionsContextProps {
  allPlayers: PlayerRoleWithDetails[];
  playerId?: string;
  actionType: ActionType;
  close: () => void;
  goToNextStepCb: () => void;
}
export const ActionModalOptionsContext =
  React.createContext<ActionModalOptionsContextProps | null>(null);
