import { ActionType } from "@/enum/ActionType";
import { InvestigationModal } from "../InvestigationModals/InvestigationModal";
import { SimpleActionModal } from "./SimpleActionModal";
import { RoleActionDto } from "@/dto/RoleActionDto";

export interface ActionModalBtnTriggerProps {
  action: RoleActionDto;
  playerRoleId?: number;
}

export const ActionModalBtnTrigger = ({
  action,
  playerRoleId,
}: ActionModalBtnTriggerProps) => {
  switch (action.type) {
    case ActionType.Investigate:
      if (!playerRoleId) return null;
      return <InvestigationModal playerRoleId={playerRoleId} action={action} />;
    default:
      return <SimpleActionModal playerRoleId={playerRoleId} action={action} />;
  }
};
