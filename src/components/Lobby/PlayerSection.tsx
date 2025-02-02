import { PlayerDto } from "@/dto/PlayerDto";
import { useKickPlayer } from "@/hooks/useKickPlayer";
import { usePlayers } from "@/hooks/usePlayers";
import { useRoomId } from "@/hooks/useRoomId";
import { useSocketConnection } from "@/hooks/useSocketConnection";
import { useUpdateModerator } from "@/hooks/useUpdateModerator";
import {
  Card,
  VStack,
  Button,
  Image,
  SimpleGrid,
  Text,
  Separator,
  HStack,
  Stack,
} from "@chakra-ui/react";
import { IconKarate, IconSpeakerphone } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toaster } from "../ui/toaster";
import { PlayerAvatar } from "./PlayerAvatar";
import {
  DrawerRoot,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseTrigger,
} from "../ui/drawer";
import emptyLobby from "@/assets/icons/lobby/lobby-empty.png";
import { SkeletonCircle, SkeletonText } from "../ui/skeleton";
import { ClipboardButton } from "../ui-addons/clipboard-button";
import React from "react";

export const PlayersSection = ({
  currentPlayer,
}: {
  currentPlayer?: PlayerDto;
}) => {
  const { t } = useTranslation();
  const roomId = useRoomId();
  const navigate = useNavigate();

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerDto | undefined>();

  const {
    data: players,
    isLoading: isPlayersLoading,
    refetch: refetchPlayers,
  } = usePlayers(roomId);
  const { mutate: updateModeratorMutate } = useUpdateModerator({
    onSuccess: async () => {
      setDrawerOpen(false);
    },
  });

  const { mutate: kickPlayerMutate } = useKickPlayer({
    onSuccess: async () => {
      setDrawerOpen(false);
    },
  });
  const onPlayerKicked = useCallback(
    (kickedPlayerId: number) => {
      if (currentPlayer?.id === kickedPlayerId) {
        toaster.create({
          title: t("You Were Kicked!"),
          description: t("Next time be nice!"),
          duration: 1500,
        });
        navigate({ to: "/" });
      } else {
        void refetchPlayers();
      }
    },
    [currentPlayer?.id, t, navigate, refetchPlayers]
  );

  const onUpdateModerator = useCallback(
    (playerId: number) => {
      updateModeratorMutate({
        newModeratorPlayerRoomId: playerId,
        roomId,
      });
    },
    [roomId, updateModeratorMutate]
  );

  const onKickPlayer = useCallback(
    (playerId: number) => {
      kickPlayerMutate({
        playerToKickId: playerId,
        roomId,
      });
    },
    [kickPlayerMutate, roomId]
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

  const noPlayersInLobby = players?.length === 0;

  //   if () {
  //     return (
  //       <Card.Root w="full" className="animate-fade-in-from-bottom">
  //         <VStack paddingY={3} gap={3}>
  //           <VStack gap={0}>
  //             <Image src={emptyLobby} height={32} width={32} />
  //             <Text lineHeight="shorter" fontSize="xl" textStyle="accent">
  //               {t("Invite Some Friends")}
  //             </Text>
  //             <Text
  //               lineHeight="shorter"
  //               color="gray.400"
  //               fontSize="lg"
  //               textStyle="accent"
  //             >
  //               {t("Copy and send the room code to your friends!")}
  //             </Text>
  //           </VStack>
  //           <Button>{t("Copy Room URL")}</Button>
  //         </VStack>
  //       </Card.Root>
  //     );
  //   }

  return (
    <>
      <HStack my={1}>
        <Separator flex="1" />
        <Text fontSize="xl" textStyle="accent" flexShrink="0">
          {noPlayersInLobby
            ? t("Invite Some Friends")
            : t(`${players?.length ?? 0} Player(s) Waiting`)}
        </Text>
        <Separator flex="1" />
      </HStack>
      <React.Fragment>
        <PlayerListSkeleton loading={isPlayersLoading} />
        {noPlayersInLobby ? (
          <VStack paddingY={3} gap={3}>
            <VStack gap={0}>
              <Image src={emptyLobby} height={32} width={32} />
              <Text lineHeight="shorter" fontSize="xl" textStyle="accent">
                {t("Invite Some Friends")}
              </Text>
              <Text
                textAlign="center"
                lineHeight="shorter"
                color="gray.400"
                fontSize="lg"
                textStyle="accent"
              >
                {t("Copy and send the room code to your friends!")}
              </Text>
            </VStack>
            <ClipboardButton value={window.location.href}>
              {t("Copy Room URL")}
            </ClipboardButton>
          </VStack>
        ) : null}
        <SimpleGrid justifyItems="center" gap={2} columns={{ base: 1, md: 3 }}>
          {players?.map((player, index) => (
            <PlayerAvatar
              currentPlayer={currentPlayer}
              key={player.id}
              player={player}
              onSettingsClick={() => {
                setSelectedPlayer(player);
                setDrawerOpen(true);
              }}
              className="animate-fade-in-from-bottom"
              css={{ animationDelay: `${index * 50}ms` }}
            />
          ))}
        </SimpleGrid>
      </React.Fragment>
      <DrawerRoot
        open={isDrawerOpen}
        onOpenChange={(e) => {
          setDrawerOpen(e.open);
        }}
        placement="bottom"
      >
        <DrawerBackdrop />
        <DrawerContent borderRadius="sm">
          <DrawerHeader>Manage {selectedPlayer?.nickname}</DrawerHeader>
          <DrawerBody>
            {selectedPlayer ? (
              <SimpleGrid mb={5} columns={2} gap={2}>
                <Button
                  size="sm"
                  onClick={() => {
                    void onKickPlayer(selectedPlayer.id);
                  }}
                  variant="subtle"
                  colorPalette="red"
                >
                  <IconKarate />
                  <Text fontSize="xs">{t("Kick Player")}</Text>
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    void onUpdateModerator(selectedPlayer.id);
                  }}
                  colorPalette="orange"
                  variant="subtle"
                >
                  <IconSpeakerphone />
                  <Text fontSize="xs"> {t("Make Moderator")}</Text>
                </Button>
              </SimpleGrid>
            ) : null}
          </DrawerBody>
          <DrawerCloseTrigger />
        </DrawerContent>
      </DrawerRoot>
    </>
  );
};

const PlayerListSkeleton = ({ loading = false }: { loading: boolean }) => {
  return loading ? (
    <Stack>
      <PlayerSkeleton />
      <PlayerSkeleton />
      <PlayerSkeleton />
    </Stack>
  ) : null;
};

const PlayerSkeleton = () => {
  return (
    <Card.Root w="full" variant="elevated">
      <Card.Body>
        <HStack justify="start" w="100%" gap={3}>
          <SkeletonCircle h="3rem" w="3rem" loading />
          <SkeletonText noOfLines={1} loading />
        </HStack>
      </Card.Body>
    </Card.Root>
  );
};
