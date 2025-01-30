import { ActionType } from "@/enum/ActionType";
import { useCallback, useMemo, useState } from "react";
import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlayerList } from "./PlayerList";
import { DialogRootProvider, Text, useDialog } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useCreateUpdateQueuedAction } from "@/hooks/useCreateUpdateQueuedAction";
import { Role } from "@/enum/Role";
import { Button, ButtonProps } from "@/components/ui/button";
import { useRoomId } from "@/hooks/useRoomId";
import { PlayerRoleActionDto } from "@/dto/PlayerRoleActionDto";
import { useAllPlayerRoles } from "@/hooks/useAllPlayerRoles";
import { RoleActionDto } from "@/dto/RoleActionDto";

export interface SimpleActionModalProps {
  //isOpen: boolean;
  //onOpenChange: (isOpen: boolean) => void;
  playerId?: string;
  action: RoleActionDto;
}

interface ModalContentProps {
  title: string;
  dialogTriggerBtn: ButtonProps;
  btnLabel: string;
  playerList?: PlayerRoleActionDto[];
}

export const SimpleActionModal = ({
  //isOpen,
  playerId,
  // onOpenChange,
  action,
}: SimpleActionModalProps) => {
  const roomId = useRoomId();
  const { t } = useTranslation();
  const dialog = useDialog();

  //const close = useCallback(() => onOpenChange(false), [onOpenChange]);
  const { data: allPlayers } = useAllPlayerRoles(roomId);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>();
  const { mutate: createUpdateQueuedAction } = useCreateUpdateQueuedAction({
    onSuccess: async () => {
      dialog.setOpen(false);
    },
  });

  // const { data: roleInfo } = useRole(roleOfPlayerMakingAction);

  const onSubmit = useCallback(() => {
    if (selectedPlayerId) {
      createUpdateQueuedAction({
        roomId,
        playerId: playerId,
        affectedPlayerId: selectedPlayerId,
        action: action.type,
      });
    }
  }, [action, createUpdateQueuedAction, playerId, roomId, selectedPlayerId]);

  const modalContent = useMemo<ModalContentProps>(() => {
    switch (action.type) {
      case ActionType.WerewolfKill:
        return {
          title: t("Werewolves, who do we attack?"),
          btnLabel: t("Attack"),
          dialogTriggerBtn: {
            children: t("Attack"),
            colorPalette: "red",
          },
          playerList: allPlayers?.filter(
            (player) => player.role !== Role.WereWolf && player.isAlive
          ),
        };
      case ActionType.Revive:
        return {
          title: t("Who to heal?"),
          btnLabel: t("Heal"),
          dialogTriggerBtn: {
            children: t("Heal"),
            colorPalette: "green",
          },
          playerList: allPlayers?.filter((player) => player.isAlive),
        };

      default:
        return {
          title: t("Who to kill?"),
          btnLabel: t("Attack"),
          dialogTriggerBtn: {
            children: t("Attack"),
            colorPalette: "red",
          },
          playerList: allPlayers?.filter(
            (player) => player.id != playerId && player.isAlive
          ),
        };
    }
  }, [action, allPlayers, playerId, t]);

  return (
    <DialogRootProvider value={dialog}>
      <DialogBackdrop />
      <DialogTrigger>
        <Button
          {...modalContent.dialogTriggerBtn}
          disabled={!action.enabled}
          size="sm"
          minW="5rem"
        />
      </DialogTrigger>
      <DialogContent>
        <DialogCloseTrigger />
        <DialogHeader>
          <DialogTitle>
            <Text textStyle="accent">{modalContent.title}</Text>
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <PlayerList
            players={modalContent.playerList ?? []}
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
    </DialogRootProvider>
  );
};
