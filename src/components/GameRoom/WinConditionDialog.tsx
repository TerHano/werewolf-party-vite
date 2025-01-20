import { useEffect, useState } from "react";
import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "../ui/dialog";

import { Stack, Text } from "@chakra-ui/react";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import { useRoomId } from "@/hooks/useRoomId";
import { useWinCondition } from "@/hooks/useWinCondition";
import { useSocketConnection } from "@/hooks/useSocketConnection";
import { WinCondition } from "@/enum/WinCondition";
import { useIsModerator } from "@/hooks/useIsModerator";
import { useEndGame } from "@/hooks/useEndGame";
import { useStartGame } from "@/hooks/useStartGame";

export const WinConditionDialog = ({
  isModerator,
}: {
  isModerator: boolean;
}) => {
  const { t } = useTranslation();
  const roomId = useRoomId();
  const { data: winCondition, refetch } = useWinCondition(roomId);
  const { mutate: startGameMutate } = useStartGame();
  const { mutate: endGameMutate } = useEndGame();

  useSocketConnection({
    onWinConditionMet: () => {
      refetch();
    },
  });

  useEffect(() => {
    if (winCondition === undefined) {
      return;
    }
    if (winCondition != WinCondition.None) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [winCondition]);

  const [open, setIsOpen] = useState(false);
  return (
    <DialogRoot size="cover" open={open}>
      <DialogBackdrop />
      <DialogContent>
        {isModerator ? (
          <DialogCloseTrigger onClick={() => setIsOpen(false)} />
        ) : null}

        <DialogBody>Someone Won!</DialogBody>
        {isModerator ? (
          <DialogFooter>
            <Stack direction="row">
              <Button
                variant="subtle"
                onClick={() => {
                  endGameMutate({ roomId });
                }}
              >
                {t("End Game")}
              </Button>
              <Button
                onClick={() => {
                  startGameMutate({ roomId });
                }}
              >
                {t("Start New Game")}
              </Button>
            </Stack>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </DialogRoot>
  );
};
