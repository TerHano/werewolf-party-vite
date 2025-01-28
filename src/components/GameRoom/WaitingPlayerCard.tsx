import { Image, Text, Stack } from "@chakra-ui/react";
import { Card } from "@chakra-ui/react/card";
import waitingRoomImg from "@/assets/icons/game-room/waiting-room.png";
import { useTranslation } from "react-i18next";

export const WaitingPlayerCard = () => {
  const { t } = useTranslation();
  return (
    <Card.Root className="animate-fade-in-from-bottom">
      <Card.Body>
        <Stack gap={2}>
          <Image alignSelf="center" width="10rem" src={waitingRoomImg} />
          <Stack gap={0}>
            <Text textStyle="accent" fontSize="2xl">
              {t("Game In Progress")}
            </Text>
            <Text color="gray.400" textStyle="accent" fontSize="xl">
              {t(
                "You will join the next game once the current one is finished"
              )}
            </Text>
          </Stack>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};
