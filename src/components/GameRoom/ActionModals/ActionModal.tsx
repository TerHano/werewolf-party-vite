import { ActionType } from "@/enum/ActionType";
import { useCallback, useMemo } from "react";
import { WerewolfKillModalContent } from "./WerewolfKillModalContent";
import { DialogBackdrop, DialogRoot } from "@/components/ui/dialog";
import { KillModalContent } from "./KillModalContent";
import { HealModalContent } from "./HealModalContent";
import { PlayerRoleWithDetails } from "../NightCall";

export interface ActionModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  allPlayers: PlayerRoleWithDetails[];
  playerId?: string;
  actionType: ActionType;
}

export interface BaseActionModalContentProps {
  allPlayers: PlayerRoleWithDetails[];
  playerId?: string;
  actionType: ActionType;
  close: () => void;
}

export const ActionModal = ({
  allPlayers,
  isOpen,
  playerId,
  onOpenChange,
  actionType,
}: ActionModalProps) => {
  const close = useCallback(() => onOpenChange(false), [onOpenChange]);
  const ModalContent = useMemo(() => {
    switch (actionType) {
      case ActionType.WerewolfKill:
        return (
          <WerewolfKillModalContent
            allPlayers={allPlayers}
            actionType={actionType}
            close={close}
          />
        );
      case ActionType.Revive:
        return (
          <HealModalContent
            allPlayers={allPlayers}
            playerId={playerId}
            actionType={actionType}
            close={close}
          />
        );
      default:
        return (
          <KillModalContent
            allPlayers={allPlayers}
            playerId={playerId}
            actionType={actionType}
            close={close}
          />
        );
    }
  }, [actionType, allPlayers, close, playerId]);

  return (
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
  );
};
