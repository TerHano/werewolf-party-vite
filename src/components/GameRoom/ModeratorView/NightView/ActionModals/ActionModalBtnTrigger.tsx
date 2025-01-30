import { ActionType } from "@/enum/ActionType";
import { InvestigationModal } from "./InvestigationModal";
import { SimpleActionModal } from "./SimpleActionModal";
import { RoleActionDto } from "@/dto/RoleActionDto";

export interface ActionModalBtnTriggerProps {
  action: RoleActionDto;
  playerId?: string;
}

export const ActionModalBtnTrigger = ({
  action,
  playerId,
}: ActionModalBtnTriggerProps) => {
  switch (action.type) {
    case ActionType.Investigate:
      if (!playerId) return null;
      return <InvestigationModal playerId={playerId} action={action} />;
    default:
      return <SimpleActionModal playerId={playerId} action={action} />;
  }
};
