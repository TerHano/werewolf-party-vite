import { useRoomId } from "@/hooks/useRoomId";
import { useRoomRoleSettings } from "@/hooks/useRoomRoleSettings";
import {
  Card,
  DrawerBackdrop,
  DrawerHeader,
  HStack,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { IconArrowRight, IconCards } from "@tabler/icons-react";
import {
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerRoot,
} from "../../ui/drawer";
import React, { useCallback, useMemo } from "react";
import { EditRoomRoleSettings } from "./EditRoomRoleSettings";
import { useSocketConnection } from "@/hooks/useSocketConnection";
import { useModerator } from "@/hooks/useModerator";
import { useCurrentPlayer } from "@/hooks/useCurrentPlayer";
import { RoomRoleSettingsInfo } from "./RoomRoleSettingsInfo";
import { ActiveRolesList } from "./ActiveRolesList";
import { useMeasure } from "@uidotdev/usehooks";

export const RoomRoleSettingsCard = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const roomId = useRoomId();
  const roomRoleSettingsQuery = useRoomRoleSettings(roomId);
  const {
    data: settings,
    isLoading: isRoomRoleSettingsLoading,
    refetch: refetchRoomRoleSettings,
  } = roomRoleSettingsQuery;
  const [ref, { width }] = useMeasure();
  const { data: currentModerator } = useModerator(roomId);
  const { data: currentPlayer } = useCurrentPlayer(roomId);

  const isModerator = useMemo(() => {
    if (!currentModerator || !currentPlayer) return false;
    return currentModerator.id === currentPlayer.id;
  }, [currentModerator, currentPlayer]);

  const onRoomRoleSettingsUpdated = useCallback(() => {
    void refetchRoomRoleSettings();
  }, [refetchRoomRoleSettings]);

  useSocketConnection({
    onRoomRoleSettingsUpdated,
  });

  const closeDrawerCallback = useCallback(() => {
    setIsOpen(false);
  }, []);

  const numberOfWerewolves = settings?.numberOfWerewolves ?? 1;

  return (
    <>
      <Card.Root
        zIndex={1}
        variant="elevated"
        onClick={() => {
          setIsOpen(true);
        }}
        w="full"
      >
        <Card.Body p="1rem">
          <HStack justifyContent="space-between">
            <VStack w="100%" alignItems="start">
              <Card.Title>
                <HStack gap={1}>
                  <IconCards size={16} />
                  <Text fontWeight="semibold" fontSize="sm">
                    Role Settings
                  </Text>
                </HStack>
              </Card.Title>
              <Card.Body ref={ref} w="100%" p={0} mt={2}>
                <Skeleton
                  minW={isRoomRoleSettingsLoading ? "25%" : undefined}
                  loading={isRoomRoleSettingsLoading}
                >
                  <ActiveRolesList
                    widthOfContainer={width}
                    numberOfWerewolves={numberOfWerewolves}
                    activeRoles={settings?.selectedRoles ?? []}
                  />
                </Skeleton>
              </Card.Body>
            </VStack>
            <IconArrowRight />
          </HStack>
        </Card.Body>
      </Card.Root>
      <DrawerRoot
        open={isOpen}
        onOpenChange={(e) => {
          setIsOpen(e.open);
        }}
        placement="bottom"
      >
        <DrawerBackdrop />

        <DrawerContent borderRadius="sm">
          <DrawerHeader>
            <HStack gap={1}>
              <IconCards size={18} />
              <Text fontWeight={500} fontSize="lg">
                Role Settings
              </Text>
            </HStack>
          </DrawerHeader>
          <DrawerBody>
            {isModerator ? (
              <EditRoomRoleSettings
                roomRoleSettingsQuery={roomRoleSettingsQuery}
                closeDrawerCallback={closeDrawerCallback}
              />
            ) : (
              <RoomRoleSettingsInfo
                numberOfWerewolves={numberOfWerewolves}
                activeRoles={settings?.selectedRoles ?? []}
              />
            )}
          </DrawerBody>
          <DrawerCloseTrigger />
        </DrawerContent>
      </DrawerRoot>
    </>
  );
};
