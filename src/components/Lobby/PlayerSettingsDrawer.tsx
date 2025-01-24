import {
  Button,
  DrawerRootProvider,
  IconButton,
  Stack,
  useDrawer,
} from "@chakra-ui/react";
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { IconMenu2 } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { AddEditPlayerModal } from "./AddEditPlayerModal";
import { useUpdateCurrentPlayerDetails } from "@/hooks/useUpdateCurrentPlayerDetails";
import { useRoomId } from "@/hooks/useRoomId";
import { useLeaveRoom } from "@/hooks/useLeaveRoom";
import { useNavigate } from "@tanstack/react-router";

export const PlayerSettingsDrawer = () => {
  const { t } = useTranslation();
  const roomId = useRoomId();
  const navigate = useNavigate();

  const { mutate: updatePlayerDetailsMutate } = useUpdateCurrentPlayerDetails();
  const { mutate: leaveRoomMutate } = useLeaveRoom({
    onSuccess: async () => {
      await navigate({ to: "/" });
    },
  });

  const playerSettingsDrawer = useDrawer({
    closeOnInteractOutside: false,
  });

  return (
    <DrawerRootProvider value={playerSettingsDrawer}>
      <DrawerBackdrop />
      <DrawerTrigger asChild>
        <IconButton variant="ghost" size="md">
          <IconMenu2 size="48px" />
        </IconButton>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t("Settings")}</DrawerTitle>
        </DrawerHeader>
        <DrawerCloseTrigger />

        <DrawerBody>
          <Stack gap={3}>
            <AddEditPlayerModal
              isEdit
              submitCallback={(playerDetails) => {
                updatePlayerDetailsMutate(playerDetails);
                playerSettingsDrawer.setOpen(false);
              }}
            />
            <Button
              onClick={() => {
                leaveRoomMutate({ roomId });
              }}
              colorPalette="red"
            >
              {t("Leave Room")}
            </Button>
          </Stack>
        </DrawerBody>
      </DrawerContent>
    </DrawerRootProvider>
  );
};
