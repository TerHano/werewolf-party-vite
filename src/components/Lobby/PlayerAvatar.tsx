import { PlayerDto } from "@/dto/PlayerDto";
import { usePlayerAvatar } from "@/hooks/usePlayerAvatar";
import { Badge, Card, IconButton, Image, Stack, Text } from "@chakra-ui/react";
import { CSSProperties } from "react";
import { IconUserCog } from "@tabler/icons-react";
import { useIsModerator } from "@/hooks/useIsModerator";
import { useRoomId } from "@/hooks/useRoomId";
import { useUpdateCurrentPlayerDetails } from "@/hooks/useUpdateCurrentPlayerDetails";
import { AddEditPlayerModal } from "./AddEditPlayerModal";
import { useTranslation } from "react-i18next";

export const PlayerAvatar = ({
  player,
  currentPlayer,
  onSettingsClick,
}: {
  player: PlayerDto;
  className?: string;
  css?: CSSProperties;
  currentPlayer: PlayerDto | undefined;
  onSettingsClick: () => void;
}) => {
  const { t } = useTranslation();
  const roomId = useRoomId();
  const { getAvatarImageSrcForIndex } = usePlayerAvatar();
  const { mutate: updatePlayerDetailsMutate } = useUpdateCurrentPlayerDetails();

  const isCurrentPlayer = currentPlayer?.id === player.id;
  const { data: isModerator } = useIsModerator(roomId);

  return (
    <Card.Root variant="subtle" w="100%" size="sm">
      <Card.Body>
        <Stack direction="row" justify="space-between" align="center">
          <Stack direction="row" align="center" gap={2}>
            <Image
              width="3rem"
              src={getAvatarImageSrcForIndex(player.avatarIndex)}
              alt="thing"
            />
            <Stack direction="column" align="start" gap={0}>
              {isCurrentPlayer ? (
                <Badge colorPalette="blue" size="sm">
                  <Text fontSize="sm">{t("You")}</Text>
                </Badge>
              ) : null}
              <Text fontSize="lg" textStyle="accent">
                {player.nickname}
              </Text>
            </Stack>
          </Stack>
          {isModerator ? (
            <IconButton
              size="sm"
              borderRadius="full"
              variant="subtle"
              colorPalette="blue"
              onClick={onSettingsClick}
            >
              {<IconUserCog />}
            </IconButton>
          ) : null}
          {isCurrentPlayer ? (
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
