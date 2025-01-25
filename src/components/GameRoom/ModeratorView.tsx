import { useEndGame } from "@/hooks/useEndGame";
import { IconButton, Skeleton, Stack } from "@chakra-ui/react";
import { Button } from "../ui/button";
import { useRoomId } from "@/hooks/useRoomId";
import { useDayDetails } from "@/hooks/useDayDetails";
import { useSocketConnection } from "@/hooks/useSocketConnection";
import { NightCall } from "./NightView/NightCall";
import { ChoppingBlock } from "./DayView/ChoppingBlock";
import { useTranslation } from "react-i18next";
import { DayNightVisual } from "./DayNightVisual";
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { IconSettings } from "@tabler/icons-react";

export const ModeratorView = () => {
  const { t } = useTranslation();
  const roomId = useRoomId();

  const {
    data: dayDetails,
    refetch: refetchDayDetails,
    isLoading: isDayDetailsLoading,
  } = useDayDetails(roomId);

  const { mutate: endGameMutation } = useEndGame();

  useSocketConnection({
    onDayOrTimeUpdated: () => {
      refetchDayDetails();
    },
  });

  const isDay = dayDetails?.isDay ?? false;

  return (
    <Skeleton width="100%" loading={isDayDetailsLoading}>
      <Stack>
        <Stack direction="row" justifyContent="space-between">
          <DrawerRoot placement="bottom">
            <DrawerBackdrop />
            <DrawerTrigger asChild>
              <Button size="sm" variant="subtle" colorPalette="blue">
                <IconSettings /> {t("Settings")}
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerCloseTrigger />
              <DrawerHeader>
                <DrawerTitle>{t("Game Settings")}</DrawerTitle>
              </DrawerHeader>
              <DrawerBody mb={8}>
                <Button
                  w="full"
                  colorPalette="red"
                  onClick={() => {
                    endGameMutation({ roomId });
                  }}
                >
                  End Game
                </Button>
              </DrawerBody>
            </DrawerContent>
          </DrawerRoot>
          <DayNightVisual />
        </Stack>
        {isDay ? <ChoppingBlock /> : <NightCall />}
      </Stack>
    </Skeleton>
  );
};
