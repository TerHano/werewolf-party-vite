import { ActionType } from "@/enum/ActionType";
import { useCallback, useMemo } from "react";
import { WerewolfKillModalContent } from "./WerewolfKillModalContent";
import { DialogBackdrop, DialogRoot } from "@/components/ui/dialog";
import { KillModalContent } from "./KillModalContent";
import { HealModalContent } from "./HealModalContent";
import { PlayerRoleWithDetails } from "../NightCall";
import { ActionModalOptionsContext } from "@/context/ActionModalOptionsContext";

export interface ActionModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  allPlayers: PlayerRoleWithDetails[];
  playerId?: string;
  actionType: ActionType;
  goToNextStepCb: () => void;
}

export const ActionModal = ({
  allPlayers,
  isOpen,
  playerId,
  onOpenChange,
  actionType,
  goToNextStepCb,
}: ActionModalProps) => {
  const close = useCallback(() => onOpenChange(false), [onOpenChange]);
  const ModalContent = useMemo(() => {
    switch (actionType) {
      case ActionType.WerewolfKill:
        return <WerewolfKillModalContent />;
      case ActionType.Revive:
        return <HealModalContent />;
      default:
        return <KillModalContent />;
    }
  }, [actionType]);

  return (
    <ActionModalOptionsContext.Provider
      value={{
        actionType,
        allPlayers,
        close,
        playerId,
        goToNextStepCb,
      }}
    >
      <DialogRoot
        placement="center"
        lazyMount
        open={isOpen}
        onOpenChange={(x) => onOpenChange(x.open)}
      >
        <DialogBackdrop />
        {ModalContent}
        {/* <DialogContent>
        <DialogCloseTrigger onClick={() => onOpenChange(false)} />
        {ModalContent}
      </DialogContent> */}
      </DialogRoot>
    </ActionModalOptionsContext.Provider>
  );
};
