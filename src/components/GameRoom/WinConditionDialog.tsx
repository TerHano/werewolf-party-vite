import { lazy, useEffect, useState } from "react";
import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogRoot,
} from "../ui/dialog";
import { Badge, Image, Stack, Text } from "@chakra-ui/react";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import { useRoomId } from "@/hooks/useRoomId";
import { useWinCondition } from "@/hooks/useWinCondition";
import { useSocketConnection } from "@/hooks/useSocketConnection";
import { WinCondition } from "@/enum/WinCondition";
import { useEndGame } from "@/hooks/useEndGame";
import { useStartGame } from "@/hooks/useStartGame";
import werewolfImg from "@/assets/icons/roles/werewolf-color.png";
import villagerImg from "@/assets/icons/roles/villager-color.png";
import { useRoomRoleSettings } from "@/hooks/useRoomRoleSettings";

const GameSummaryTimeline = lazy(
  () => import("./GameSummaryTimeline/GameSummaryTimeline")
);

export const WinConditionDialog = ({
  isModerator,
  children,
}: {
  isModerator: boolean;
  children: React.ReactNode;
}) => {
  const { t } = useTranslation();
  const roomId = useRoomId();
  const { data: winCondition, refetch } = useWinCondition(roomId);
  const { data: roomSettings } = useRoomRoleSettings(roomId);

  const { mutate: startGameMutate } = useStartGame({
    onSuccess: async () => {
      setIsOpen(false);
    },
  });
  const { mutate: endGameMutate } = useEndGame({
    onSuccess: async () => {
      setIsOpen(false);
    },
  });

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

  const werewolvesWin = winCondition === WinCondition.Werewolves;

  const [open, setIsOpen] = useState(false);
  return (
    <>
      <DialogRoot size="full" open={open}>
        <DialogBackdrop />

        <DialogContent>
          {isModerator ? (
            <DialogCloseTrigger onClick={() => setIsOpen(false)} />
          ) : null}

          <DialogBody>
            <Stack mt="2rem" gap={0} align="center">
              <Image
                width="8rem"
                src={werewolvesWin ? werewolfImg : villagerImg}
              />
              <Badge
                size="md"
                variant="subtle"
                colorPalette={werewolvesWin ? "red" : "green"}
              >
                <Text textStyle="accent" fontSize="2xl">
                  {werewolvesWin ? t("Werewolves Win") : t("Villagers Win")}
                </Text>
              </Badge>
              {roomSettings?.showGameSummary ? <GameSummaryTimeline /> : null}
            </Stack>
          </DialogBody>
          {isModerator ? (
            <DialogFooter>
              <Stack w="full" wrap="wrap" gap={3} direction="row">
                <Button
                  w="full"
                  onClick={() => {
                    setIsOpen(false);
                    startGameMutate({ roomId });
                  }}
                >
                  {t("Play Again")}
                </Button>
                <Button
                  w="full"
                  variant="subtle"
                  onClick={() => {
                    // setIsOpen(false);
                    endGameMutate({ roomId });
                  }}
                >
                  {t("End Game")}
                </Button>
              </Stack>
            </DialogFooter>
          ) : null}
        </DialogContent>
      </DialogRoot>
      {open ? null : children}
    </>
  );
};

export default WinConditionDialog;
