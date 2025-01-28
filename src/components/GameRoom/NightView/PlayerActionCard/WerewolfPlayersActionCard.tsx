import { Card } from "@chakra-ui/react";
import { ActionType } from "@/enum/ActionType";
import { useMemo } from "react";
import { QueuedActionDto } from "@/dto/QueuedActionDto";
import { Role } from "@/enum/Role";
import { PlayerRoleWithDetails } from "../NightCall";
import { ActionButtonList } from "./ActionButtonList";
import { QueuedActionCard } from "./QueuedActionCard";
import { PlayerActionCardHeader } from "./PlayerActionCardHeader";
import { PlayerActionCardBody } from "./PlayerActionCardBody";

export const WerewolfPlayersActionCard = ({
  allPlayerDetails,
  allQueuedActions,
}: {
  allPlayerDetails: PlayerRoleWithDetails[];
  allQueuedActions: QueuedActionDto[];
}) => {
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
    <Card.Root alignItems="center" width="100%" borderBottomRadius={0}>
      <Card.Header>
        <PlayerActionCardHeader
          roleLabel="Werewolves"
          isActionQueued={!!queuedAction}
        />
      </Card.Header>
      <Card.Body>
        <PlayerActionCardBody playerDetails={werewolfPlayers} />
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
