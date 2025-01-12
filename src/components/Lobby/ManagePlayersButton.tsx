import { PlayerDto } from "@/dto/PlayerDto";
import { Button } from "../ui/button";
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTrigger,
} from "../ui/drawer";
import { usePlayers } from "@/hooks/usePlayers";
import { useRoomId } from "@/hooks/useRoomId";
import { Card, HStack, IconButton, Image, Stack, Text } from "@chakra-ui/react";
import { usePlayerAvatar } from "@/hooks/usePlayerAvatar";
import { useTranslation } from "react-i18next";
import { IconKarate, IconSpeakerphone, IconUserCog } from "@tabler/icons-react";
import { useUpdateModerator } from "@/hooks/useUpdateModerator";
import { useCallback, useMemo } from "react";
import React from "react";
import { useKickPlayer } from "@/hooks/useKickPlayer";

export const ManagePlayersButton = () => {
  const { t } = useTranslation();
  const roomId = useRoomId();
  const [isOpen, setIsOpen] = React.useState(false);
  const { data: players, isFetching: isPlayersLoading } = usePlayers(roomId);
  const { getAvatarImageSrcForIndex } = usePlayerAvatar();

  const isDisabled = useMemo(() => {
    if (isPlayersLoading) return true;
    if (!players || players.length === 0) return true;

    return false;
  }, [isPlayersLoading, players]);

  const { mutate: updateModeratorMutate } = useUpdateModerator({
    onSuccess: async () => {
      setIsOpen(false);
    },
  });

  const { mutate: kickPlayerMutate } = useKickPlayer({
    onSuccess: async () => {
      setIsOpen(false);
    },
  });

  const onUpdateModerator = useCallback(
    (playerId: string) => {
      updateModeratorMutate({
        newModeratorId: playerId,
        roomId,
      });
    },
    [roomId, updateModeratorMutate]
  );

  const onKickPlayer = useCallback(
    (playerId: string) => {
      kickPlayerMutate({
        playerToKickId: playerId,
        roomId,
      });
    },
    [kickPlayerMutate, roomId]
  );
  return (
    <DrawerRoot
      open={isOpen}
      onOpenChange={(e) => {
        setIsOpen(e.open);
      }}
      placement="bottom"
    >
      <DrawerBackdrop />

      <DrawerTrigger asChild>
        <Button
          disabled={isDisabled}
          variant="subtle"
          colorPalette="blue"
          size="md"
        >
          <IconUserCog /> {t("Manage Players")}
        </Button>
      </DrawerTrigger>

      <DrawerContent borderRadius="sm">
        <DrawerHeader>Manage Players</DrawerHeader>
        <DrawerBody>
          <Stack gap={2}>
            {players?.map((player: PlayerDto) => (
              <Card.Root key={player.id} w="full">
                <Card.Body>
                  <HStack justifyContent="space-between" gap={2}>
                    <HStack gap={2}>
                      <Image
                        h="36px"
                        src={getAvatarImageSrcForIndex(player?.avatarIndex)}
                      />
                      <Text>{player?.nickname}</Text>
                    </HStack>
                    <HStack gap={2}>
                      <IconButton
                        onClick={() => {
                          void onKickPlayer(player.id);
                        }}
                        borderRadius="full"
                        variant="subtle"
                        colorPalette="red"
                      >
                        <IconKarate />
                      </IconButton>
                      {/* <Button
                          onClick={() => {
                            void onKickPlayer(player.id);
                          }}
                          size="xs"
                          variant="subtle"
                          colorPalette="red"
                        >
                          <HStack alignContent="center" gap={1}>
                            <IconKarate /> {t("Kick")}
                          </HStack>
                        </Button> */}
                      <IconButton
                        borderRadius="full"
                        onClick={() => {
                          void onUpdateModerator(player.id);
                        }}
                        colorPalette="orange"
                        variant="subtle"
                      >
                        <IconSpeakerphone />
                      </IconButton>
                    </HStack>
                  </HStack>
                </Card.Body>
              </Card.Root>
            ))}
          </Stack>
        </DrawerBody>
        <DrawerCloseTrigger />
      </DrawerContent>
    </DrawerRoot>
  );
};
