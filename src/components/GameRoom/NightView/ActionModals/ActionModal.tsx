import { ActionType } from "@/enum/ActionType";
import { useCallback, useMemo, useState } from "react";
import {
  DialogBackdrop,
  DialogRoot,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlayerRoleWithDetails } from "../NightCall";
import { PlayerList } from "./PlayerList";
import { Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useCreateUpdateQueuedAction } from "@/hooks/useCreateUpdateQueuedAction";
import { Role } from "@/enum/Role";
import { Button } from "@/components/ui/button";
import { useRoomId } from "@/hooks/useRoomId";

export interface ActionModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  allPlayers: PlayerRoleWithDetails[];
  playerId?: string;
  actionType: ActionType;
}

interface ModalContentProps {
  title: string;
  btnLabel: string;
  playerList: PlayerRoleWithDetails[];
}

export const ActionModal = ({
  allPlayers,
  isOpen,
  playerId,
  onOpenChange,
  actionType,
}: ActionModalProps) => {
  const roomId = useRoomId();
  const { t } = useTranslation();
  const close = useCallback(() => onOpenChange(false), [onOpenChange]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>();
  const { mutate: createUpdateQueuedAction } = useCreateUpdateQueuedAction({
    onSuccess: async () => {
      close();
    },
  });

  // const { data: roleInfo } = useRole(roleOfPlayerMakingAction);

  const onSubmit = useCallback(() => {
    if (selectedPlayerId) {
      createUpdateQueuedAction({
        roomId,
        playerId: playerId,
        affectedPlayerId: selectedPlayerId,
        action: actionType,
      });
    }
  }, [
    actionType,
    createUpdateQueuedAction,
    playerId,
    roomId,
    selectedPlayerId,
  ]);

  const modalContent = useMemo<ModalContentProps>(() => {
    switch (actionType) {
      case ActionType.WerewolfKill:
        return {
          title: t("Werewolves, who do we attack?"),
          btnLabel: t("Attack"),
          playerList: allPlayers.filter(
            (player) => player.role !== Role.WereWolf && player.isAlive
          ),
        };
      case ActionType.Revive:
        return {
          title: t("Who to heal?"),
          btnLabel: t("Heal"),
          playerList: allPlayers.filter((player) => player.isAlive),
        };

      default:
        return {
          title: t("Who to kill?"),
          btnLabel: t("Attack"),
          playerList: allPlayers.filter(
            (player) => player.id != playerId && player.isAlive
          ),
        };
    }
  }, [actionType, allPlayers, playerId, t]);

  return (
    <DialogRoot
      placement="center"
      lazyMount
      open={isOpen}
      onOpenChange={(x) => onOpenChange(x.open)}
    >
      <DialogBackdrop />
      <DialogContent>
        <DialogCloseTrigger />
        <DialogHeader>
          <DialogTitle>
            <Text textStyle="accent">{modalContent.title}</Text>
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <PlayerList
            players={modalContent.playerList}
            onPlayerSelect={setSelectedPlayerId}
            selectedPlayer={selectedPlayerId}
          />
        </DialogBody>
        <DialogFooter>
          <Button onClick={onSubmit} disabled={selectedPlayerId === undefined}>
            {modalContent.btnLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
