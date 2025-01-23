import { PlayerDto } from "@/dto/PlayerDto";
import { usePlayerAvatar } from "@/hooks/usePlayerAvatar";
import { Badge, Box, Image, Stack, Text } from "@chakra-ui/react";
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

  const isCurrentPlayer = currentPlayer?.id === player.id;

  return (
    <Box className={className} style={css}>
      <Stack direction="column" align="center" gap={0}>
        <Image
          width="3rem"
          src={getAvatarImageSrcForIndex(player.avatarIndex)}
          alt="thing"
        />
        <Badge colorPalette={isCurrentPlayer ? "blue" : "white"} size="sm">
          <Text fontSize="md" textStyle="accent">
            {player.nickname}
          </Text>
        </Badge>
      </Stack>
    </Box>
  );
};
