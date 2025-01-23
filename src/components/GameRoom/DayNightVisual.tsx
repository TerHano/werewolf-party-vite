import { useDayDetails } from "@/hooks/useDayDetails";
import { useRoomId } from "@/hooks/useRoomId";
import { useSocketConnection } from "@/hooks/useSocketConnection";
import { useMemo } from "react";
import dayImg from "@/assets/icons/game-room/cloudy-day.png";
import nightImg from "@/assets/icons/game-room/cloudy-night.png";
import { Badge, Box, Float, Image, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export const DayNightVisual = () => {
  const roomId = useRoomId();
  const { t } = useTranslation();
  const { data: dayDetails, refetch: refetchDayDetails } =
    useDayDetails(roomId);

  useSocketConnection({
    onDayOrTimeUpdated: () => {
      refetchDayDetails();
    },
  });

  const isDay = dayDetails?.isDay ?? false;

  const timeText = useMemo(() => {
    if (!dayDetails) {
      return "Unknown";
    }
    if (dayDetails.currentNight === 0) {
      if (dayDetails.isDay) {
        return t("First Day");
      } else {
        return t("First Night");
      }
    } else {
      if (dayDetails.isDay) {
        return t(`Day ${dayDetails.currentNight}`);
      } else {
        return t(`Night ${dayDetails.currentNight}`);
      }
    }
  }, [dayDetails, t]);

  return (
    <Box mx={3} mb={5} position="relative" width="3rem">
      <Image src={isDay ? dayImg : nightImg} />
      <Float placement="bottom-center">
        <Badge colorPalette={isDay ? "blue" : "purple"}>
          <Text>{timeText}</Text>
        </Badge>
      </Float>
    </Box>
  );
};
