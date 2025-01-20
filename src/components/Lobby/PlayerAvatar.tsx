import { PlayerDto } from "@/dto/PlayerDto";
import { usePlayerAvatar } from "@/hooks/usePlayerAvatar";
import { Badge, Box, Float, Image, Stack, Text } from "@chakra-ui/react";
import { CSSProperties } from "react";

export const PlayerAvatar = ({
  player,
  className,
  css,
  currentPlayer,
}: {
  player: PlayerDto;
  className?: string;
  css?: CSSProperties;
  currentPlayer: PlayerDto | undefined;
}) => {
  const { getAvatarImageSrcForIndex } = usePlayerAvatar();

  return (
    <Box className={className} style={css}>
      <Stack direction="column">
        <Box position="relative">
          <Image
            width="3rem"
            src={getAvatarImageSrcForIndex(player.avatarIndex)}
            alt="thing"
          />
          {currentPlayer?.id === player.id ? (
            <Float placement="top-end" offset={-2}>
              <Badge
                borderRadius="2xl"
                variant="subtle"
                colorPalette="blue"
                size="md"
              >
                You
              </Badge>
            </Float>
          ) : null}
        </Box>
        <Text>{player.nickname}</Text>
      </Stack>
    </Box>
  );
};
