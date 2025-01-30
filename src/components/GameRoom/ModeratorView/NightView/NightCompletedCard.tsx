import { Card, Text, Button, Image, Stack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import nightToDayImg from "@/assets/icons/game-room/to-day.png";
import { useEndNight } from "@/hooks/useEndNight";
import { useRoomId } from "@/hooks/useRoomId";

export const NightCompletedCard = () => {
  const { t } = useTranslation();
  const roomId = useRoomId();
  const { mutate, isPending: isLoading } = useEndNight();
  return (
    <Card.Root alignItems="center" width="100%" borderBottomRadius={0}>
      <Card.Header>
        <Text fontSize="xl" textStyle="accent">
          {t(`Everyone, Close Your Eyes!`)}
        </Text>
      </Card.Header>
      <Card.Body className="animate-fade-in-from-bottom">
        <Image width="10rem" src={nightToDayImg} />
      </Card.Body>
      <Card.Footer>
        <Stack direction="column" gap={0}>
          <Text fontSize="xl" textStyle="accent">
            {t(`Ready to sleep until day?`)}
          </Text>
          <Button
            disabled={isLoading}
            onClick={() => {
              mutate({ roomId });
            }}
            size="sm"
          >
            {t("Wake Up")}
          </Button>
        </Stack>
      </Card.Footer>
    </Card.Root>
  );
};
