import { Card, Text, Image, Badge, VStack, Group } from "@chakra-ui/react";
import { ActionType } from "@/enum/ActionType";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { useRole } from "@/hooks/useRoles";
import { QueuedActionDto } from "@/dto/QueuedActionDto";
import { Role } from "@/enum/Role";
import { IconGrave2, IconUser } from "@tabler/icons-react";
import { PlayerRoleWithDetails } from "../NightCall";
import { ActionButtonList } from "./ActionButtonList";
import { QueuedActionCard } from "./QueuedActionCard";

export const WerewolfPlayersActionCard = ({
  allPlayerDetails,
  allQueuedActions,
}: {
  allPlayerDetails: PlayerRoleWithDetails[];
  allQueuedActions: QueuedActionDto[];
}) => {
  const { t } = useTranslation();
  const { data: werewolfRole } = useRole(Role.WereWolf);

  const queuedAction = useMemo(() => {
    return allQueuedActions.find(
      (action) => action.action === ActionType.WerewolfKill
    );
  }, [allQueuedActions]);

  const werewolfPlayers = allPlayerDetails.filter(
    (player) => player.role === Role.WereWolf
  );

  const roleActions = werewolfPlayers[0]?.actions;

  return (
    <Card.Root alignItems="center" width="100%">
      <Card.Header>
        <Text fontSize="xl" textStyle="accent">
          {t(`Wake Up, Werewolves!`)}
        </Text>
      </Card.Header>
      <Card.Body className="animate-fade-in-from-bottom">
        <VStack gap={1}>
          <Image width="8rem" src={werewolfRole!.imgSrc} />
          <Group>
            {werewolfPlayers.map((player) =>
              player.isAlive ? (
                <Badge colorPalette="current">
                  <IconUser size={12} />
                  {player.nickname}
                </Badge>
              ) : (
                <Badge colorPalette="red">
                  <IconGrave2 size={16} />
                  {player.nickname}
                </Badge>
              )
            )}
          </Group>
        </VStack>
      </Card.Body>
      <Card.Footer>
        {!queuedAction ? (
          <ActionButtonList actions={roleActions} />
        ) : (
          <QueuedActionCard
            queuedAction={queuedAction}
            allPlayersDetails={allPlayerDetails}
          />
        )}
      </Card.Footer>
    </Card.Root>
  );
};
