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

  const werewolvesWin = winCondition === WinCondition.Werewolves;

  const [open, setIsOpen] = useState(false);
  return (
    <>
      <DialogRoot size="full" open={open}>
        <DialogBackdrop />

        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Winners")}</DialogTitle>
          </DialogHeader>
          {isModerator ? (
            <DialogCloseTrigger onClick={() => setIsOpen(false)} />
          ) : null}

          <DialogBody>
            <Stack gap={0} align="center">
              <Image
                width="13rem"
                src={werewolvesWin ? werewolfImg : villagerImg}
              />
              <Badge
                size="lg"
                variant="subtle"
                colorPalette={werewolvesWin ? "red" : "green"}
              >
                <Text textStyle="accent" fontSize="3xl">
                  {werewolvesWin ? t("Werewolves") : t("Villagers")}
                </Text>
              </Badge>
            </Stack>
          </DialogBody>
          {isModerator ? (
            <DialogFooter>
              <Stack wrap="wrap" gap={3} direction="row">
                <Button
                  w="full"
                  onClick={() => {
                    setIsOpen(false);
                    startGameMutate({ roomId });
                  }}
                >
                  {t("Start New Game")}
                </Button>
                <Button
                  w="full"
                  variant="subtle"
                  onClick={() => {
                    setIsOpen(false);
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
