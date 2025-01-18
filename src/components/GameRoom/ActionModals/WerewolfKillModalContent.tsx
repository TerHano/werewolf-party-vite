import {
  Button,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Text,
} from "@chakra-ui/react";
import { Role } from "@/enum/Role";
import { DialogCloseTrigger, DialogContent } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { BaseActionModalContentProps } from "./ActionModal";
import { useCreateUpdateQueuedAction } from "@/hooks/useCreateUpdateQueuedAction";
import { useRoomId } from "@/hooks/useRoomId";
import { useState, useCallback } from "react";
import { PlayerList } from "./PlayerList";

export const WerewolfKillModalContent = ({
  allPlayers,
  actionType,
  close,
}: BaseActionModalContentProps) => {
  const roomId = useRoomId();

  const playersToSelect = allPlayers.filter(
    (player) => player.role !== Role.WereWolf && player.isAlive
  );
  const { t } = useTranslation();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>();

  const { mutate: createUpdateQueuedAction } = useCreateUpdateQueuedAction({
    onSuccess: async () => {
      close();
    },
  });

  const onKillPlayer = useCallback(() => {
    if (selectedPlayerId) {
      createUpdateQueuedAction({
        roomId,
        playerId: undefined,
        affectedPlayerId: selectedPlayerId,
        action: actionType,
      });
    }
  }, [actionType, createUpdateQueuedAction, roomId, selectedPlayerId]);
  return (
    <DialogContent>
      <DialogCloseTrigger />
      <DialogHeader>
        <DialogTitle>
          <Text textStyle="accent">{t("Werewolves, who do we attack?")}</Text>
        </DialogTitle>
      </DialogHeader>
      <DialogBody>
        <PlayerList
          players={playersToSelect}
          onPlayerSelect={setSelectedPlayerId}
          selectedPlayer={selectedPlayerId}
        />
      </DialogBody>
      <DialogFooter>
        <Button
          onClick={onKillPlayer}
          disabled={selectedPlayerId === undefined}
        >
          {t("Attack Player")}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
