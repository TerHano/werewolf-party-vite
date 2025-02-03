import { ModeratorCard } from "./ModeratorCard";
import { HStack, Stack, Text, SimpleGrid, Card } from "@chakra-ui/react";
import { useCurrentPlayer } from "@/hooks/useCurrentPlayer";
import { useTranslation } from "react-i18next";
import { useRoomId } from "@/hooks/useRoomId";
import { ClipboardIconButton } from "../ui-addons/clipboard-button";
import { useCallback } from "react";
import { toaster } from "../ui-addons/toaster";
import { Button } from "../ui/button";
import { useStartGame } from "@/hooks/useStartGame";
import { useIsModerator } from "@/hooks/useIsModerator";
import { PlayersSection } from "./PlayerSection";
import { LeaveRoomButton } from "./LeaveRoomButton";
import { RoomRoleSettingsCard } from "./RoomRoleSettings/RoomRoleSettingsCard";

export const Lobby = () => {
  const roomId = useRoomId();
  const { t } = useTranslation();
  const { data: isModerator } = useIsModerator(roomId);
  const { data: currentPlayer } = useCurrentPlayer(roomId);

  const { mutate: startGameMutate, isPending: isStartGamePending } =
    useStartGame({
      onError: async (e) => {
        toaster.create({
          type: "error",
          title: "Can't Start Game",
          description: e.message,
          duration: 1500,
        });
      },
    });

  const onStartGame = useCallback(async () => {
    startGameMutate({ roomId });
  }, [roomId, startGameMutate]);

  return (
    <Card.Root w="full" p={3} variant="outline">
      <Stack w="full" gap={2}>
        <HStack justify="space-between">
          <HStack justifyContent="center">
            <Text>{t("Room ID")}:</Text>
            <ClipboardIconButton
              value={window.location.href}
              label={roomId}
              iconButton={{
                colorPalette: "blue",
                size: "sm",
                variant: "subtle",
              }}
            />
          </HStack>
          <LeaveRoomButton />
        </HStack>
        <ModeratorCard currentPlayer={currentPlayer} />
        <RoomRoleSettingsCard />
        {isModerator ? (
          <SimpleGrid gap={2} columns={1}>
            {/* <ManagePlayersButton /> */}
            <Button
              size="sm"
              width="100%"
              loading={isStartGamePending}
              onClick={onStartGame}
            >
              <Text fontSize="sm"> {t("Start Game")}</Text>
            </Button>
          </SimpleGrid>
        ) : null}

        <PlayersSection currentPlayer={currentPlayer} />
      </Stack>
    </Card.Root>
  );
};
