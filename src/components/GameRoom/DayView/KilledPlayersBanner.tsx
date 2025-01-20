import { useLatestPlayerDeaths } from "@/hooks/useLatestPlayerDeaths";
import { usePlayerAvatar } from "@/hooks/usePlayerAvatar";
import { useRoomId } from "@/hooks/useRoomId";
import { Card, Group, Avatar, Float, Badge, Text } from "@chakra-ui/react";
import { IconGrave2 } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

export const KilledPlayersBanner = () => {
  const { t } = useTranslation();
  const roomId = useRoomId();
  const { data: latestPlayerDeaths } = useLatestPlayerDeaths(roomId);
  const { getAvatarImageSrcForIndex } = usePlayerAvatar();

  if (!latestPlayerDeaths || latestPlayerDeaths.length === 0) {
    return <></>;
  }

  return (
    <Card.Root variant="outline">
      <Card.Header>
        <Card.Title>
          <Group gap={1} align="center">
            <IconGrave2 size={20} />
            <Text> {t("Deaths")}</Text>
          </Group>
        </Card.Title>
        <Card.Description>
          {t("These are the players killed the previous night")}
        </Card.Description>
      </Card.Header>
      <Card.Body py={2}>
        <Group mt="1rem">
          {latestPlayerDeaths.map((death) => (
            <Avatar.Root
              variant="subtle"
              size="2xl"
              key={death.id}
              style={{ cursor: "pointer" }}
            >
              <Avatar.Image
                marginTop={1}
                src={getAvatarImageSrcForIndex(death.avatarIndex)}
              />
              <Float>
                <Badge>{death.nickname}</Badge>
              </Float>
            </Avatar.Root>
          ))}
        </Group>
      </Card.Body>
    </Card.Root>
  );
};
