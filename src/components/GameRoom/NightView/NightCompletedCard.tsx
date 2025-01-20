import { Card, Text, Button, Image } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import nightToDayImg from "@/assets/icons/game-room/to-day.png";
import { useEndNight } from "@/hooks/useEndNight";
import { useRoomId } from "@/hooks/useRoomId";

export const NightCompletedCard = () => {
  const { t } = useTranslation();
  const roomId = useRoomId();
  const { mutate, isPending: isLoading } = useEndNight();
  return (
    <Card.Root alignItems="center" width="100%">
      <Card.Header>
        <Text fontSize="xl" textStyle="accent">
          {t(`Ready to sleep until day?`)}
        </Text>
      </Card.Header>
      <Card.Body>
        <Image width="10rem" src={nightToDayImg} />
      </Card.Body>
      <Card.Footer>
        <Button
          disabled={isLoading}
          onClick={() => {
            mutate({ roomId });
          }}
          size="sm"
        >
          {t("Wake Up")}
        </Button>
      </Card.Footer>
    </Card.Root>
  );
};
