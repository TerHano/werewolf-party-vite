import { usePlayerAvatar } from "@/hooks/usePlayerAvatar";
import {
  Text,
  Image,
  Badge,
  Group,
  Stack,
  defineStyle,
} from "@chakra-ui/react";
import { Card } from "@chakra-ui/react/card";
import { useCallback } from "react";
import { useRoomId } from "@/hooks/useRoomId";
import { toaster } from "../ui-addons/toaster";
import { useTranslation } from "react-i18next";
import { useModerator } from "@/hooks/useModerator";
import { useSocketConnection } from "@/hooks/useSocketConnection";
import { AddEditPlayerModal } from "@/components/Lobby/AddEditPlayerModal";
import { useUpdateCurrentPlayerDetails } from "@/hooks/useUpdateCurrentPlayerDetails";
import { PlayerDto } from "@/dto/PlayerDto";
import { Skeleton, SkeletonCircle } from "../ui-addons/skeleton";
import { IconSpeakerphone } from "@tabler/icons-react";

export interface ModeratorCardProps {
  currentPlayer?: PlayerDto;
}

export const ModeratorCard = ({ currentPlayer }: ModeratorCardProps) => {
  const { t } = useTranslation();
  const roomId = useRoomId();
  const {
    data: currentModerator,
    isLoading: isModeratorLoading,
    refetch: refetchModerator,
  } = useModerator(roomId);
  const { mutate: updatePlayerDetailsMutate } = useUpdateCurrentPlayerDetails();
  const { getAvatarImageSrcForIndex } = usePlayerAvatar();

  const onModeratorUpdated = useCallback(
    (newModerator: PlayerDto) => {
      if (newModerator.id === currentPlayer?.id) {
        toaster.create({
          meta: { icon: <IconSpeakerphone /> },
          title: t("You're In Charge!"),
          description: t("You are now the moderator!"),
          duration: 2500,
        });
      } else {
        toaster.create({
          title: t("New Moderator In Town!"),
          meta: { icon: <IconSpeakerphone /> },
          description: (
            <Group gap={1}>
              <Text fontStyle="italic" fontWeight="bold">
                {newModerator.nickname}
              </Text>
              <Text>{t("is now moderator")}</Text>
            </Group>
          ),
          duration: 2500,
        });
      }
      refetchModerator();
    },
    [currentPlayer?.id, refetchModerator, t]
  );

  useSocketConnection({
    onModeratorUpdated,
    onLobbyUpdated: useCallback(() => {
      void refetchModerator();
    }, [refetchModerator]),
  });

  const isModeratorCurrentPlayer = currentModerator?.id === currentPlayer?.id;

  const ringCss = defineStyle({
    outlineWidth: "2px",
    outlineColor: "yellow.700",
    outlineStyle: "solid",
  });

  return (
    <Card.Root css={ringCss} variant="subtle" w="100%" size="sm">
      <Card.Body>
        <Stack direction="row" justify="space-between" align="center">
          <Stack direction="row" align="center" gap={2}>
            <SkeletonCircle size="3rem" loading={isModeratorLoading}>
              <Image
                width="3rem"
                src={getAvatarImageSrcForIndex(currentModerator?.avatarIndex)}
                alt="thing"
              />
            </SkeletonCircle>
            <Stack direction="column" align="start" gap={0}>
              <Group>
                <Badge colorPalette="yellow" size="sm">
                  <Text fontSize="sm">{t("Moderator")}</Text>
                </Badge>
                {isModeratorCurrentPlayer ? (
                  <Badge colorPalette="blue" size="sm">
                    <Text fontSize="sm">{t("You")}</Text>
                  </Badge>
                ) : null}
              </Group>
              <Skeleton w="full" height={8} loading={isModeratorLoading}>
                <Text fontSize="lg" textStyle="accent">
                  {currentModerator?.nickname}
                </Text>
              </Skeleton>
            </Stack>
          </Stack>
          {isModeratorCurrentPlayer ? (
            <AddEditPlayerModal
              isEdit
              submitCallback={(playerDetails) => {
                updatePlayerDetailsMutate(playerDetails);
              }}
            />
          ) : null}
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};
