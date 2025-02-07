import { PlayerDto } from "@/dto/PlayerDto";
import { Button } from "../ui/button";
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "../ui/drawer";
import { useRoomId } from "@/hooks/useRoomId";
import {
  DrawerRootProvider,
  IconButton,
  Image,
  Stack,
  Text,
  useDrawer,
} from "@chakra-ui/react";
import { usePlayerAvatar } from "@/hooks/usePlayerAvatar";
import { useTranslation } from "react-i18next";
import { IconKarate, IconSpeakerphone, IconUserCog } from "@tabler/icons-react";
import { useUpdateModerator } from "@/hooks/useUpdateModerator";
import { useCallback } from "react";
import { useKickPlayer } from "@/hooks/useKickPlayer";

export const ManagePlayersButton = ({ player }: { player: PlayerDto }) => {
  const { t } = useTranslation();
  const drawer = useDrawer();
  const roomId = useRoomId();
  const { getAvatarImageSrcForIndex } = usePlayerAvatar();

  const { mutate: updateModeratorMutate } = useUpdateModerator({
    onSuccess: async () => {
      drawer.setOpen(false);
    },
  });

  const { mutate: kickPlayerMutate } = useKickPlayer({
    onSuccess: async () => {
      drawer.setOpen(false);
    },
  });

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
        playerRoomIdToKick: playerId,
        roomId,
      });
    },
    [kickPlayerMutate, roomId]
  );
  return (
    <DrawerRootProvider
      value={drawer}
      lazyMount
      unmountOnExit
      placement="bottom"
    >
      <DrawerBackdrop />
      <DrawerTrigger>
        <IconButton
          size="sm"
          borderRadius="full"
          variant="subtle"
          colorPalette="blue"
        >
          <IconUserCog />
        </IconButton>
      </DrawerTrigger>
      <DrawerContent borderRadius="sm">
        <DrawerHeader>
          <Stack align="center" direction="row" gap={1}>
            <Text>{t("Manage")}</Text>
            <Text fontWeight="semibold">{player.nickname}</Text>
            <Image
              src={getAvatarImageSrcForIndex(player.avatarIndex)}
              width="2rem"
            />
          </Stack>
        </DrawerHeader>
        <DrawerBody>
          <Stack mb={5} columns={2} gap={4}>
            <Button
              onClick={() => {
                void onKickPlayer(player.id);
              }}
              //variant="subtle"
              colorPalette="red"
            >
              <IconKarate />
              <Text fontSize="xs">{t("Kick Player")}</Text>
            </Button>
            <Button
              onClick={() => {
                void onUpdateModerator(player.id);
              }}
              colorPalette="orange"
              // variant="subtle"
            >
              <IconSpeakerphone />
              <Text fontSize="xs"> {t("Make Moderator")}</Text>
            </Button>
          </Stack>
        </DrawerBody>
        <DrawerCloseTrigger />
      </DrawerContent>
    </DrawerRootProvider>
  );
};
