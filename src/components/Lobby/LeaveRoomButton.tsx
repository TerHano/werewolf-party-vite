import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useLeaveRoom } from "@/hooks/useLeaveRoom";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { useRoomId } from "@/hooks/useRoomId";
import { IconLogout2 } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { Alert, Stack, Text } from "@chakra-ui/react";
import { useIsModerator } from "@/hooks/useIsModerator";
import { useSocketConnection } from "@/hooks/useSocketConnection";

export const LeaveRoomButton = () => {
  const { t } = useTranslation();
  const roomId = useRoomId();
  const navigate = useNavigate();
  const { getConnectionId } = useSocketConnection({});

  const { mutate: leaveRoomMutate, isPending: isLeavingRoom } = useLeaveRoom({
    onSuccess: async () => {
      await navigate({ to: "/" });
    },
  });
  const { data: isModerator } = useIsModerator(roomId);
  return (
    <DialogRoot role="alertdialog">
      <DialogTrigger asChild>
        <Button size="sm" variant="subtle" colorPalette="red">
          <IconLogout2 /> {t("Leave")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Text textStyle="accent" fontSize="xl">
              {t("Are you sure you want to leave?")}
            </Text>
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Stack gap={2}>
            {isModerator ? (
              <Alert.Root size="sm" status="warning">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>{t("You Are The Moderator")}</Alert.Title>
                  <Alert.Description>
                    {t(
                      "Another player will be assigned as the moderator if you leave."
                    )}
                  </Alert.Description>
                </Alert.Content>
              </Alert.Root>
            ) : null}
            <Text fontSize="xs">
              {t(
                "You will not be able to participate if you join the room again while a game is in progress."
              )}
            </Text>
          </Stack>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline">{t("Stay")}</Button>
          </DialogActionTrigger>
          <Button
            loading={isLeavingRoom}
            disabled={isLeavingRoom}
            onClick={() => {
              leaveRoomMutate({ roomId, connectionId: getConnectionId() });
            }}
            colorPalette="red"
          >
            {t("Leave Room")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
