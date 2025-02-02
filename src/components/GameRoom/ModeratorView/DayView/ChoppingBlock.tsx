import { Button } from "@/components/ui/button";
import { useRoomId } from "@/hooks/useRoomId";
import { useAllPlayerRoles } from "@/hooks/useAllPlayerRoles";
import { useVotePlayerOut } from "@/hooks/useVotePlayerOut";
import { useTranslation } from "react-i18next";
import { KilledPlayersBanner } from "./KilledPlayersBanner";
import { Card, Separator, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { PlayerList } from "@/components/GameRoom/ModeratorView/NightView/ActionModals/PlayerList";

export const ChoppingBlock = () => {
  const roomId = useRoomId();

  const { t } = useTranslation();

  const { data: allPlayerRoles } = useAllPlayerRoles(roomId);
  const alivePlayers = allPlayerRoles?.filter((player) => player.isAlive);
  const [selectedPlayer, setSelectedPlayer] = useState<number | undefined>();
  const { mutate: votePlayerOutMutate } = useVotePlayerOut();

  return (
    <Stack direction="column" gap={6}>
      <KilledPlayersBanner />
      <Separator />
      <Card.Root
        animationDelay="moderate"
        className="animate-fade-in-from-bottom"
      >
        <Card.Body>
          <Card.Title>
            <Text textStyle="accent" fontSize="xl">
              {t("Villagers, who do you think it is?")}
            </Text>
            {/* <InfoTip
              content={
                <Text truncate>
                  {t(
                    "All the players should now be discussing who they think is the werewolf. Once an agreement is reached, the players will vote to lynch the player. If the players are unable to reach an agreement, the players can abstain from voting for the night."
                  )}
                </Text>
              }
            /> */}
          </Card.Title>
          <Card.Description>
            <Text fontSize="xs">
              {t(
                "All the players should now be discussing who they think is the werewolf. Once an agreement is reached, the players will vote to lynch the player. If the players are unable to reach an agreement, the players can abstain from voting for the night."
              )}
            </Text>
          </Card.Description>
          <Stack mt={4} gap={3}>
            <PlayerList
              selectedPlayer={selectedPlayer}
              players={alivePlayers ?? []}
              onPlayerSelect={setSelectedPlayer}
            />

            <SimpleGrid columns={2} gap={4}>
              <Button
                w="100%"
                variant="subtle"
                onClick={() => {
                  votePlayerOutMutate({
                    roomId,
                    playerRoleId: undefined,
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
                    playerRoleId: selectedPlayer,
                  });
                }}
              >
                {t("Lynch Player")}
              </Button>
            </SimpleGrid>
          </Stack>
        </Card.Body>
      </Card.Root>
    </Stack>
  );
};
