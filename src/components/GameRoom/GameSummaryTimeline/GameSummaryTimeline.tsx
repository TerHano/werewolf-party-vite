import { useRoomId } from "@/hooks/useRoomId";
import { useGameSummary } from "@/hooks/useGameSummary";
import { Stack, Text } from "@chakra-ui/react";
import { DaySummary } from "@/components/GameRoom/GameSummaryTimeline/DaySummary";
import { NightSummary } from "@/components/GameRoom/GameSummaryTimeline/NightSummary";
import { useTranslation } from "react-i18next";

export const GameSummaryTimeline = () => {
  const { t } = useTranslation();
  const roomId = useRoomId();

  const { data: gameSummary } = useGameSummary(roomId);
  return (
    <Stack mt={4} gap={3} justify="start" w="full">
      <Text fontSize="md">{t("Game History")}</Text>
      {gameSummary?.map((summary) => {
        return (
          <Stack>
            <NightSummary
              night={summary.night}
              actions={summary.nightActions}
            />
            <DaySummary day={summary.night} actions={summary.dayActions} />
          </Stack>
        );
      })}
    </Stack>
  );

  //   {gameSummary?.map((summary) =>
  //     <TimelineRoot>
  //    {sumamry.nightActions.map((a) => {
  //       return <GameSummaryTimelineItem action={a} />;
  //     })}</TimelineRoot>
  //   )}
  // </TimelineRoot>
};
