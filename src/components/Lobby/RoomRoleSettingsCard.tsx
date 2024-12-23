import { useRoomId } from "@/hooks/useRoomId";
import { useRoomRoleSettings } from "@/hooks/useRoomRoleSettings";
import {
  Card,
  DrawerBackdrop,
  DrawerHeader,
  HStack,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { IconArrowRight, IconCards, IconSword } from "@tabler/icons-react";
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
  const roomId = useRoomId();
  const { data: settings, refetch: refetchRoomRoleSettings } =
    useRoomRoleSettings(roomId);
  const { data: roleInfos } = useRoles();
  const [isOpen, setIsOpen] = React.useState(false);

  const { data: currentModerator } = useModerator(roomId);
  const { data: currentPlayer } = useCurrentPlayer(roomId);

  const isModerator = useMemo(() => {
    if (!currentModerator || !currentPlayer) return false;
    return currentModerator.id === currentPlayer.id;
  }, [currentModerator, currentPlayer]);

  useSocketConnection({
    onRoomRoleSettingsUpdated: () => {
      void refetchRoomRoleSettings();
    },
  });

  const closeDrawerCallback = useCallback(() => {
    setIsOpen(false);
  }, []);

  const numberOfWerewolves = settings?.werewolves as number | undefined;

  if (!settings) {
    return null;
  }

  return (
    <>
      <Card.Root
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
                <HStack>
                  {Array.from(Array(numberOfWerewolves)).map((_val, index) => {
                    return (
                      <img
                        key={index}
                        src={werewolfImg}
                        alt="werewolf"
                        width="32"
                        height="32"
                      />
                    );
                  })}
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

        <DrawerContent>
          <DrawerHeader>Settings</DrawerHeader>
          <DrawerBody>
            {isModerator ? (
              <EditRoomRoleSettings closeDrawerCallback={closeDrawerCallback} />
            ) : (
              <RoomRoleSettingsInfo activeRoles={settings.selectedRoles} />
            )}
          </DrawerBody>
          <DrawerCloseTrigger />
        </DrawerContent>
      </DrawerRoot>
    </>
  );
};
