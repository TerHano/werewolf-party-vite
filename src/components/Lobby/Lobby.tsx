import { ModeratorCard } from "./ModeratorCard";
import { HStack, Stack, Text, SimpleGrid, Container } from "@chakra-ui/react";
import { useCurrentPlayer } from "@/hooks/useCurrentPlayer";
import { useTranslation } from "react-i18next";
import { useRoomId } from "@/hooks/useRoomId";
import { ClipboardIconButton } from "../ui-addons/clipboard-button";
import { useCallback } from "react";
import { toaster } from "../ui/toaster";
import { Button } from "../ui/button";
import { useStartGame } from "@/hooks/useStartGame";
import { useIsModerator } from "@/hooks/useIsModerator";
import { PlayerSettingsDrawer } from "./PlayerSettingsDrawer";
import { PlayersSection } from "./PlayerSection";

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
    <Container mt={2}>
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
          <PlayerSettingsDrawer />
        </HStack>
        <ModeratorCard />
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
    </Container>
  );
};
