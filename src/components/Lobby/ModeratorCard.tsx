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
import { useCallback } from "react";
import { RoomRoleSettingsCard } from "./RoomRoleSettings/RoomRoleSettingsCard";
import React from "react";
import { useCurrentPlayer } from "@/hooks/useCurrentPlayer";
import { useRoomId } from "@/hooks/useRoomId";
import { toaster } from "../ui/toaster";
import { useTranslation } from "react-i18next";
import { useModerator } from "@/hooks/useModerator";
import { useSocketConnection } from "@/hooks/useSocketConnection";
import { Skeleton, SkeletonCircle } from "../ui/skeleton";

export const ModeratorCard = () => {
  const { t } = useTranslation();
  const roomId = useRoomId();
  const {
    data: currentModerator,
    isLoading: isModeratorLoading,
    refetch: refetchModerator,
  } = useModerator(roomId);
  const { data: currentPlayer } = useCurrentPlayer(roomId);
  const { getAvatarImageSrcForIndex } = usePlayerAvatar();

  const resetAnimation = useCallback(() => {
    setAnimation("none");
    setTimeout(() => {
      setAnimation("");
    }, 50);
  }, []);

  const onModeratorUpdated = useCallback(
    (newModeratorId: string) => {
      if (newModeratorId === currentPlayer?.id) {
        toaster.create({
          title: t("You're In Charge!"),
          description: t("You are now the moderator!"),
          duration: 2500,
        });
      }
      resetAnimation();
      refetchModerator();
    },
    [currentPlayer?.id, refetchModerator, resetAnimation, t]
  );

  useSocketConnection({
    onModeratorUpdated,
    onLobbyUpdated: useCallback(() => {
      void refetchModerator();
    }, [refetchModerator]),
  });

  const isModeratorCurrentPlayer = currentModerator?.id === currentPlayer?.id;

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
                <SkeletonCircle loading={isModeratorLoading}>
                  <Image
                    h="40px"
                    src={getAvatarImageSrcForIndex(
                      currentModerator?.avatarIndex
                    )}
                  />
                </SkeletonCircle>
                <Skeleton loading={isModeratorLoading}>
                  <Text textStyle="accent" fontSize="xl" fontWeight={500}>
                    {currentModerator?.nickname}
                  </Text>
                </Skeleton>
              </Group>
              <Group>
                <Badge variant="subtle" colorPalette="yellow">
                  Moderator
                </Badge>
                {isModeratorCurrentPlayer && (
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
