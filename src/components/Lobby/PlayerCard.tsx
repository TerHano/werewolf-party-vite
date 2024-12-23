import { PlayerDto } from "@/dto/PlayerDto";
import { usePlayerAvatar } from "@/hooks/usePlayerAvatar";
import { HStack, Text, Image, Float, Badge, VStack } from "@chakra-ui/react";
import { Card } from "@chakra-ui/react/card";
import { Skeleton, SkeletonCircle, SkeletonText } from "../ui/skeleton";
import { IconCrown } from "@tabler/icons-react";
import { Avatar } from "../ui/avatar";
import { useMemo } from "react";

interface PlayerCardProps {
  player?: PlayerDto;
  isModerator?: boolean;
  isCurrentPlayer?: boolean;
}

export const PlayerCard = ({
  player,
  isModerator,
  isCurrentPlayer,
}: PlayerCardProps) => {
  const { getAvatarImageSrcForIndex } = usePlayerAvatar();

  const playerAvatarColorPalette = useMemo(() => {
    if (isModerator) {
      return "yellow";
    }
    if (isCurrentPlayer) {
      return "blue";
    }
    return "gray";
  }, [player]);

  if (!player) {
    return (
      <Card.Root w="full">
        <Card.Body>
          <HStack gap={2}>
            <SkeletonCircle loading size="36px" />

            <SkeletonText noOfLines={1} loading />
          </HStack>
        </Card.Body>
      </Card.Root>
    );
  }

  return (
    <Card.Root w="full">
      <Card.Body>
        <HStack gap={2}>
          <Image
            h="36px"
            src={getAvatarImageSrcForIndex(player?.avatarIndex)}
          />

          <VStack gap={0} alignItems="start">
            <HStack gap={1}>
              {isModerator && (
                <Badge variant="subtle" colorPalette="yellow">
                  Moderator
                </Badge>
              )}
              {isCurrentPlayer && (
                <Badge variant="subtle" colorPalette="blue">
                  You
                </Badge>
              )}
            </HStack>

            <Text>{player?.nickname}</Text>
          </VStack>
        </HStack>
      </Card.Body>
    </Card.Root>
  );
};
