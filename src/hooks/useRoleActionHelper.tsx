import { ActionType } from "@/enum/ActionType";
import { IconFirstAidKit, IconSword, IconZoom } from "@tabler/icons-react";
import { useCallback } from "react";
import { usePlayerAvatar } from "./usePlayerAvatar";

interface ActionButton {
  label: string;
  color: string;
  icon: React.ReactNode;
}

export const useRoleActionHelper = () => {
  const getActionButtonProps = useCallback<
    (actionType: ActionType) => ActionButton
  >((actionType: ActionType) => {
    switch (actionType) {
      case ActionType.VigilanteKill:
      case ActionType.WerewolfKill:
      case ActionType.Kill:
        return {
          label: "Kill",
          color: "red",
          icon: <IconSword />,
        };
      case ActionType.Revive:
        return {
          label: "Heal",
          color: "green",
          icon: <IconFirstAidKit />,
        };
      case ActionType.Investigate:
        return {
          label: "Investigate",
          color: "blue",
          icon: <IconZoom />,
        };
      default:
        return {
          label: "Unknown",
          color: "white",
          icon: <IconSword />,
        };
    }
  }, []);

  const getUndoActionText = useCallback((actionType: ActionType) => {
    switch (actionType) {
      case ActionType.VigilanteKill:
      case ActionType.WerewolfKill:
      case ActionType.Kill:
        return "Attack";
      case ActionType.Revive:
        return "Save";
      case ActionType.Investigate:
        return "Investigate";
      default:
        return "Unknown";
    }
  }, []);

  return { getActionButtonProps, getUndoActionText };
};
