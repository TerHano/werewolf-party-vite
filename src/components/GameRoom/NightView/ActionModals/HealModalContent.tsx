import { Button, Text } from "@chakra-ui/react";
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
import { useActionModalOptionsContext } from "@/hooks/useActionModalOptionsContext";

export const HealModalContent = () => {
  const roomId = useRoomId();
  const { allPlayers, actionType, close, playerId, goToNextStepCb } =
    useActionModalOptionsContext();
  const { t } = useTranslation();
  const playersToSelect = allPlayers.filter((player) => player.isAlive);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>();

  const { mutate: createUpdateQueuedAction } = useCreateUpdateQueuedAction({
    onSuccess: async () => {
      goToNextStepCb();
      close();
    },
  });

  const onHealPlayer = useCallback(() => {
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
          <Text textStyle="accent">{t("Who do you choose to save?")}</Text>
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
          onClick={onHealPlayer}
        >
          {t("Heal Player")}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
