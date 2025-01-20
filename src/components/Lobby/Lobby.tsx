import { useModerator } from "@/hooks/useModerator";
import { usePlayers } from "@/hooks/usePlayers";
import { ModeratorCard } from "./ModeratorCard";
import {
  Card,
  HStack,
  Separator,
  Stack,
  Text,
  SimpleGrid,
  Image,
  VStack,
} from "@chakra-ui/react";
import { useCurrentPlayer } from "@/hooks/useCurrentPlayer";
import { useTranslation } from "react-i18next";
import { PlayerDto } from "@/dto/PlayerDto";
import { Skeleton } from "../ui/skeleton";
import { useRoomId } from "@/hooks/useRoomId";
import { ClipboardButton } from "../ui-addons/clipboard-button";
import { ManagePlayersButton } from "./ManagePlayersButton";
import { useCallback, useMemo } from "react";
import { useSocketConnection } from "@/hooks/useSocketConnection";
import { toaster } from "../ui/toaster";
import { useNavigate } from "@tanstack/react-router";
import { PlayerAvatar } from "./PlayerAvatar";
import emptyLobby from "@/assets/icons/lobby/lobby-empty.png";
import { Button } from "../ui/button";
import { useStartGame } from "@/hooks/useStartGame";

export const Lobby = () => {
  const roomId = useRoomId();
  const { t } = useTranslation();
  const {
    data: currentModerator,
    isFetching: isModeratorLoading,
    refetch: refetchModerator,
  } = useModerator(roomId);
  const { data: currentPlayer } = useCurrentPlayer(roomId);

  const { mutate: startGameMutate, isPending: isStartGamePending } =
    useStartGame({
      onError: async (e) => {
        console.log(e.message);

        toaster.create({
          type: "error",
          title: "Can't Start Game",
          description: e.message,
        });
      },
    });
  const onModeratorUpdated = useCallback(
    (newModeratorId: string) => {
      if (newModeratorId === currentPlayer?.id) {
        toaster.create({
          title: t("He-yo!"),
          description: t("You are now the moderator!"),
          duration: 2000,
        });
      }
      refetchModerator();
    },
    [currentPlayer?.id, refetchModerator, t]
  );

  const onStartGame = useCallback(async () => {
    startGameMutate({ roomId });
  }, [roomId, startGameMutate]);

  useSocketConnection({
    onModeratorUpdated,
  });

  const isModerator = useMemo(() => {
    if (!currentModerator || !currentPlayer) return false;
    return currentModerator.id === currentPlayer.id;
  }, [currentModerator, currentPlayer]);

  return (
    // <Box>
    <Stack w="full" p={3} gap={2}>
      <HStack justifyContent="center">
        <Text>{t("Room ID")}:</Text>
        <ClipboardButton
          label={roomId}
          iconButton={{
            colorPalette: "blue",
            size: "sm",
            variant: "subtle",
          }}
        />
      </HStack>
      <ModeratorCard
        player={currentModerator}
        isModerator
        isCurrentPlayer={currentModerator?.id === currentPlayer?.id}
        isLoading={isModeratorLoading}
      />
      {isModerator ? (
        <SimpleGrid gap={2} columns={2}>
          <ManagePlayersButton />
          <Button
            width="100%"
            loading={isStartGamePending}
            onClick={onStartGame}
          >
            {t("Start Game")}
          </Button>
        </SimpleGrid>
      ) : null}

      <Separator my={3} />
      <PlayersSection currentPlayer={currentPlayer} />
    </Stack>
    // </Box>
  );
};

export const PlayersSection = ({
  currentPlayer,
}: {
  currentPlayer?: PlayerDto;
}) => {
  const { t } = useTranslation();
  const roomId = useRoomId();
  const navigate = useNavigate();
  const {
    data: players,
    isLoading: isPlayersLoading,
    refetch: refetchPlayers,
  } = usePlayers(roomId);

  const onPlayerKicked = useCallback(
    (kickedPlayerId: string) => {
      if (currentPlayer?.id === kickedPlayerId) {
        toaster.create({
          title: t("Kicked!"),
          description: t("You have been kicked from the room!"),
          duration: 2000,
        });
        navigate({ to: "/" });
      } else {
        void refetchPlayers();
      }
    },
    [currentPlayer?.id, t, navigate, refetchPlayers]
  );

  useSocketConnection({
    onModeratorUpdated: useCallback(() => {
      void refetchPlayers();
    }, [refetchPlayers]),
    onLobbyUpdated: useCallback(() => {
      void refetchPlayers();
    }, [refetchPlayers]),
    onPlayerKicked,
  });

  if (players?.length === 0) {
    return (
      <Card.Root w="full" className="animate-fade-in-from-bottom">
        <VStack paddingY={3} gap={3}>
          <VStack gap={0}>
            <Image src={emptyLobby} height={32} width={32} />
            <Text lineHeight="shorter" fontSize="xl" textStyle="accent">
              {t("Invite Some Friends")}
            </Text>
            <Text
              lineHeight="shorter"
              color="gray.400"
              fontSize="lg"
              textStyle="accent"
            >
              {t("Copy and send the room code to your friends!")}
            </Text>
          </VStack>
          <Button>{t("Copy Room URL")}</Button>
        </VStack>
      </Card.Root>
    );
  }

  return (
    <Card.Root p={2} w="full" className="animate-fade-in-from-bottom">
      <Skeleton
        minH={isPlayersLoading ? "100px" : undefined}
        loading={isPlayersLoading}
      >
        <SimpleGrid
          justifyItems="center"
          gap={8}
          columns={{ base: 2, xs: 3, sm: 4, md: 6 }}
        >
          {players?.map((player, index) => (
            // <PlayerCard
            //   className="animate-fade-in-from-bottom"
            //   css={{ animationDelay: `${index * 500}ms` }}
            //   key={player.id}
            //   player={player}
            //   isCurrentPlayer={currentPlayer?.id === player.id}
            // />

            <PlayerAvatar
              currentPlayer={currentPlayer}
              key={player.id}
              player={player}
              className="animate-fade-in-from-bottom"
              css={{ animationDelay: `${index * 50}ms` }}
            />
          ))}
        </SimpleGrid>
      </Skeleton>
    </Card.Root>
  );
};
