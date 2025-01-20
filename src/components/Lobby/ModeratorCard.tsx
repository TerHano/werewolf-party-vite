import { PlayerDto } from "@/dto/PlayerDto";
import { usePlayerAvatar } from "@/hooks/usePlayerAvatar";
import {
  HStack,
  Text,
  Image,
  Badge,
  Float,
  Box,
  Group,
} from "@chakra-ui/react";
import { Card } from "@chakra-ui/react/card";
import { CSSProperties, useCallback, useEffect } from "react";
import { RoomRoleSettingsCard } from "./RoomRoleSettingsCard";
import React from "react";

interface ModeratorCardProps {
  player?: PlayerDto;
  isModerator?: boolean;
  isCurrentPlayer?: boolean;
  isLoading?: boolean;
  css?: CSSProperties;
  className?: string;
}

export const ModeratorCard = ({
  player,
  isModerator = false,
  isCurrentPlayer = false,
  // isLoading = false,
  // css,
  // className,
}: ModeratorCardProps) => {
  const { getAvatarImageSrcForIndex } = usePlayerAvatar();

  const resetAnimation = useCallback(() => {
    setAnimation("none");
    setTimeout(() => {
      setAnimation("");
    }, 50);
  }, []);

  useEffect(() => {
    resetAnimation();
  }, [player, resetAnimation]);

  const [animation, setAnimation] = React.useState<string | undefined>("");

  return (
    <Box
      position="relative"
      // className="animate-fade-in-from-bottom "
      marginTop="52px"
    >
      <RoomRoleSettingsCard />

      <Float w="full" offset={-4} placement="top-center">
        <Card.Root
          bg="colorPalette.900"
          //  bgColor="red"
          className="animate-slide-in-from-bottom"
          animation={animation}
          variant="outline"
          w="full"
        >
          <Card.Body mb={2} p={2}>
            <HStack justify="space-between">
              <Group>
                <Image
                  h="40px"
                  src={getAvatarImageSrcForIndex(player?.avatarIndex)}
                />
                <Text fontWeight={500}>{player?.nickname}</Text>
              </Group>
              <Group>
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
              </Group>
            </HStack>
          </Card.Body>
        </Card.Root>
      </Float>
    </Box>
  );
};
