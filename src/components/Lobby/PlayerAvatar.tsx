import { PlayerDto } from "@/dto/PlayerDto";
import { usePlayerAvatar } from "@/hooks/usePlayerAvatar";
import { Badge, Box, Float } from "@chakra-ui/react";
import { CSSProperties } from "react";

export const PlayerAvatar = ({
  player,
  className,
  css,
}: {
  player: PlayerDto;
  className?: string;
  css?: CSSProperties;
}) => {
  const { getAvatarImageSrcForIndex } = usePlayerAvatar();

  return (
    <Box w="3rem" h="4.5rem">
      <Box position="relative" className={className} style={css}>
        <img src={getAvatarImageSrcForIndex(player.avatarIndex)} alt="thing" />
        <Float placement="bottom-center" offset={-2}>
          <Badge
            borderRadius="2xl"
            variant="surface"
            colorPalette="current"
            size="md"
          >
            {player.nickname}
          </Badge>
        </Float>
      </Box>
    </Box>
  );
};
