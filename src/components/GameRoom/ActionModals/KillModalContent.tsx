import { Button, Text } from "@chakra-ui/react";
import { BaseActionModalContentProps } from "./ActionModal";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { useCreateUpdateQueuedAction } from "@/hooks/useCreateUpdateQueuedAction";
import { useCallback, useState } from "react";
import { useRoomId } from "@/hooks/useRoomId";
import { PlayerList } from "./PlayerList";

export const KillModalContent = ({
  allPlayers,
  playerId,
  actionType,
  close,
}: BaseActionModalContentProps) => {
  const roomId = useRoomId();
  const { t } = useTranslation();
  const playersToSelect = allPlayers.filter(
    (player) => player.isAlive && player.id !== playerId
  );
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
  return (
    <DialogContent>
      <DialogCloseTrigger />
      <DialogHeader>
        <DialogTitle>
          <Text textStyle="accent">{t("Who do you choose to attack?")}</Text>
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
          disabled={selectedPlayerId === undefined}
          form="player-details-form"
          type="submit"
          onClick={onKillPlayer}
        >
          {t("Kill Player")}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
