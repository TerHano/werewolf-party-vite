import { useRoomId } from "@/hooks/useRoomId";
import { useRoomRoleSettings } from "@/hooks/useRoomRoleSettings";
import {
  Badge,
  Box,
  Card,
  DrawerBackdrop,
  DrawerHeader,
  Float,
  HStack,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { IconArrowRight, IconCards } from "@tabler/icons-react";
import werewolfImg from "@/assets/icons/roles/werewolf-color.png";
import { useRoles } from "@/hooks/useRoles";
import {
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerRoot,
} from "../ui/drawer";
import React, { useCallback, useMemo } from "react";
import { EditRoomRoleSettings } from "./EditRoomRoleSettings";
import { useSocketConnection } from "@/hooks/useSocketConnection";
import { useModerator } from "@/hooks/useModerator";
import { useCurrentPlayer } from "@/hooks/useCurrentPlayer";
import { RoomRoleSettingsInfo } from "./RoomRoleSettingsInfo";

export const RoomRoleSettingsCard = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const roomId = useRoomId();
  const roomRoleSettingsQuery = useRoomRoleSettings(roomId);
  const {
    data: settings,
    isLoading: isRoomRoleSettingsLoading,
    refetch: refetchRoomRoleSettings,
  } = roomRoleSettingsQuery;
  const { data: roleInfos } = useRoles();

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

  const numberOfWerewolves = (settings?.werewolves as number | undefined) ?? 0;

  return (
    <>
      <Card.Root
        zIndex={1}
        variant="outline"
        onClick={() => {
          setIsOpen(true);
        }}
        w="full"
      >
        <Card.Body p="1rem">
          <HStack justifyContent="space-between">
            <VStack alignItems="start">
              <Card.Title>
                <HStack gap={1}>
                  <IconCards size={16} />
                  <Text fontSize="sm">Role Settings</Text>
                </HStack>
              </Card.Title>
              <Card.Description mt={2}>
                <Skeleton
                  minW={isRoomRoleSettingsLoading ? "25%" : undefined}
                  loading={isRoomRoleSettingsLoading}
                >
                  <HStack>
                    <Box position="relative" w="32px" h="32px">
                      <img
                        src={werewolfImg}
                        alt="werewolf"
                        width="32"
                        height="32"
                      />
                      {numberOfWerewolves > 1 ? (
                        <Float placement="top-end">
                          <Badge variant="surface" size="xs">
                            x{numberOfWerewolves}
                          </Badge>
                        </Float>
                      ) : null}
                    </Box>

                    {settings?.selectedRoles.map((role, index) => {
                      const roleInfo = roleInfos?.find(
                        (r) => r.roleName === role
                      );
                      if (!roleInfo) return null;

                      return (
                        <img
                          key={`${roleInfo.roleName}-${index}`}
                          src={roleInfo.imgSrc}
                          alt={roleInfo.label}
                          width="32"
                          height="32"
                        />
                      );
                    })}
                  </HStack>
                </Skeleton>
              </Card.Description>
            </VStack>
            <IconArrowRight />
          </HStack>
        </Card.Body>
      </Card.Root>
      <DrawerRoot
        closeOnEscape={!isModerator}
        closeOnInteractOutside={!isModerator}
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
