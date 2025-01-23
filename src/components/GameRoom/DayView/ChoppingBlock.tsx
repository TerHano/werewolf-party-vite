import { Button } from "../../ui/button";
import { useRoomId } from "@/hooks/useRoomId";
import { useAllPlayerRoles } from "@/hooks/useAllPlayerRoles";
import { useVotePlayerOut } from "@/hooks/useVotePlayerOut";
import { useTranslation } from "react-i18next";
import { KilledPlayersBanner } from "./KilledPlayersBanner";
import {
  Avatar,
  Badge,
  defineStyle,
  Separator,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { usePlayerAvatar } from "@/hooks/usePlayerAvatar";

export const ChoppingBlock = () => {
  const roomId = useRoomId();

  const { t } = useTranslation();

  const { data: allPlayerRoles } = useAllPlayerRoles(roomId);
  const alivePlayers = allPlayerRoles?.filter((player) => player.isAlive);
  const [selectedPlayer, setSelectedPlayer] = useState<string | undefined>();
  const { getAvatarImageSrcForIndex } = usePlayerAvatar();
  const { mutate: votePlayerOutMutate } = useVotePlayerOut();

  const ringCss = defineStyle({
    outlineWidth: "2px",
    outlineColor: "blue.500",
    outlineOffset: "2px",
    outlineStyle: "solid",
  });

  return (
    <Stack direction="column" gap={6}>
      <KilledPlayersBanner />
      <Separator />
      <Text textStyle="accent" fontSize="2xl">
        {t("Pick a player to lynch...")}
      </Text>
      <SimpleGrid columns={{ base: 2, xs: 3, sm: 5, md: 5 }} gap={5}>
        {alivePlayers?.map((player) => {
          return (
            <Stack gap={0} align="center">
              <Avatar.Root
                variant="subtle"
                size="2xl"
                borderRadius="xl"
                onClick={() => setSelectedPlayer(player.id)}
                key={player.id}
                style={{ cursor: "pointer" }}
                css={selectedPlayer === player.id ? ringCss : undefined}
              >
                <Avatar.Image
                  marginTop={1}
                  src={getAvatarImageSrcForIndex(player.avatarIndex)}
                />
              </Avatar.Root>{" "}
              <Badge
                colorPalette={selectedPlayer === player.id ? "blue" : undefined}
              >
                {player.nickname}
              </Badge>
            </Stack>
          );
        })}
      </SimpleGrid>
      <Separator />
      <SimpleGrid columns={2} gap={4}>
        <Button
          w="100%"
          variant="subtle"
          onClick={() => {
            votePlayerOutMutate({
              roomId,
              playerId: undefined,
            });
          }}
        >
          {t("Abstain Vote")}
        </Button>
        <Button
          w="100%"
          disabled={!selectedPlayer}
          onClick={() => {
            votePlayerOutMutate({
              roomId,
              playerId: selectedPlayer,
            });
          }}
        >
          {t("Lynch Player")}
        </Button>
      </SimpleGrid>
    </Stack>
  );
};
