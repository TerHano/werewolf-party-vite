import { GameSummaryTimelineItem } from "@/components/GameRoom/GameSummaryTimeline/GameSummaryTimelineItem";
import { GameActionDto } from "@/dto/GameActionDto";
import { Badge, Card, Stack, TimelineRoot, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export const NightSummary = ({
  night,
  actions,
}: {
  night: number;
  actions: GameActionDto[];
}) => {
  const { t } = useTranslation();
  const nightLabel = night === 0 ? t("First Night") : t(`Night ${night + 1}`);
  return (
    <Stack gap={3}>
      <Badge w="fit-content" colorPalette="purple">
        {nightLabel}
      </Badge>
      <TimelineRoot size="xl" variant="subtle">
        {actions.length === 0 ? (
          <NightNoActionsTaken />
        ) : (
          actions.map((a) => <GameSummaryTimelineItem action={a} />)
        )}
      </TimelineRoot>
    </Stack>
  );
};

const NightNoActionsTaken = () => {
  const { t } = useTranslation();

  return (
    <Card.Root bgColor="purple.subtle">
      <Card.Body>
        <Text color="purple.fg">{t("No actions were taken")}</Text>
      </Card.Body>
    </Card.Root>
  );
};
