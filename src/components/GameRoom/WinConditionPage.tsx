import { Badge, Card, Image, Skeleton, Stack, Text } from "@chakra-ui/react";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import { useRoomId } from "@/hooks/useRoomId";
import { WinCondition } from "@/enum/WinCondition";
import { useEndGame } from "@/hooks/useEndGame";
import { useStartGame } from "@/hooks/useStartGame";
import werewolfImg from "@/assets/icons/roles/werewolf-color.png";
import villagerImg from "@/assets/icons/roles/villager-color.png";
import { useRoomRoleSettings } from "@/hooks/useRoomRoleSettings";
import { lazy, useMemo } from "react";
import { useAssignedRole } from "@/hooks/useAssignedRole";
import { Role } from "@/enum/Role";

const GameSummaryTimeline = lazy(
  () => import("./GameSummaryTimeline/GameSummaryTimeline")
);

export const WinConditionPage = ({
  winCondition,
  isModerator,
}: {
  winCondition: WinCondition;
  isModerator: boolean;
}) => {
  const { t } = useTranslation();
  const roomId = useRoomId();
  const { data: roomSettings } = useRoomRoleSettings(roomId);
  const { data: assignedRole, isLoading: isAssignedRoleLoading } =
    useAssignedRole(roomId);

  const { mutate: startGameMutate, isPending: isStartingGame } = useStartGame({
    onSuccess: async () => {},
  });
  const { mutate: endGameMutate, isPending: isEndingGame } = useEndGame({
    onSuccess: async () => {},
  });

  const isWerewolvesWin = winCondition === WinCondition.Werewolves;

  const description = useMemo(() => {
    if (isModerator) {
      if (isWerewolvesWin) {
        return t(
          "The werewolves have won the game. You can start a new game or end it."
        );
      }
      return t(
        "The villagers have won the game. You can start a new game or end it."
      );
    }
    if (isWerewolvesWin) {
      if (assignedRole === Role.WereWolf) {
        return t("Congratulations! The werewolves eliminated all villagers.");
      } else {
        return t(
          "Oh no! You were not able to protect the villagers! The werewolves have won the game."
        );
      }
    } else {
      if (assignedRole === Role.Villager) {
        return t(
          "Congratulations! The villagers have protected their village."
        );
      } else {
        return t("Oh no! The villagers have eliminated all werewolves.");
      }
    }
  }, [assignedRole, isModerator, isWerewolvesWin, t]);

  return (
    <Card.Root p="1rem" className="animate-fade-in-from-bottom">
      <Stack gap={5} align="center">
        <Stack my="2rem" gap={0} align="center">
          <Image
            width="8rem"
            src={isWerewolvesWin ? werewolfImg : villagerImg}
          />
          <Badge
            size="md"
            variant="subtle"
            colorPalette={isWerewolvesWin ? "red" : "green"}
          >
            <Text textStyle="accent" fontSize="2xl">
              {isWerewolvesWin ? t("Werewolves Win") : t("Villagers Win")}
            </Text>
          </Badge>
          <Skeleton loading={isAssignedRoleLoading} width="100%">
            <Text mt={1} textStyle="accent" fontSize="xl" textAlign="center">
              {description}
            </Text>
          </Skeleton>
          {roomSettings?.showGameSummary ? <GameSummaryTimeline /> : null}
        </Stack>

        {isModerator ? (
          <Stack w="full" wrap="wrap" gap={3} direction="row">
            <Button
              w="full"
              loading={isStartingGame}
              disabled={isStartingGame || isEndingGame}
              onClick={() => {
                startGameMutate({ roomId });
              }}
            >
              {t("Play Again")}
            </Button>
            <Button
              w="full"
              variant="subtle"
              loading={isEndingGame}
              disabled={isStartingGame || isEndingGame}
              onClick={() => {
                endGameMutate({ roomId });
              }}
            >
              {t("End Game")}
            </Button>
          </Stack>
        ) : null}
      </Stack>
    </Card.Root>
  );
};

export default WinConditionPage;
