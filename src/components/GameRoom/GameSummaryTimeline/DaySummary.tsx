import { GameSummaryTimelineItem } from "@/components/GameRoom/GameSummaryTimeline/GameSummaryTimelineItem";
import { GameActionDto } from "@/dto/GameActionDto";
import { Badge, Card, Stack, Text, TimelineRoot } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export const DaySummary = ({
  day,
  actions,
}: {
  day: number;
  actions: GameActionDto[];
}) => {
  const { t } = useTranslation();
  const dayLabel = day === 0 ? t("First Day") : t(`Day ${day + 1}`);
  return (
    <Stack gap={3}>
      <Badge w="fit-content" colorPalette="blue">
        {dayLabel}
      </Badge>
      <TimelineRoot size="xl" variant="subtle">
        {actions.length === 0 ? (
          <DayNoActionsTaken />
        ) : (
          actions.map((a) => <GameSummaryTimelineItem action={a} />)
        )}
      </TimelineRoot>
    </Stack>
  );
};

const DayNoActionsTaken = () => {
  const { t } = useTranslation();

  return (
    <Card.Root bgColor="blue.subtle">
      <Card.Body>
        <Text color="blue.fg">{t("No actions were taken")}</Text>
      </Card.Body>
    </Card.Root>
  );
};
