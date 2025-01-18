import { ActionType } from "@/enum/ActionType";
import React from "react";

type ActionModalCallback = (actionType: ActionType, playerId?: string) => void;

export const ActionModalContext = React.createContext<
  ActionModalCallback | undefined
>(undefined);
