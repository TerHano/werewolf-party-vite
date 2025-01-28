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

export const PlayerActionCard = ({
  playerDetails,
  allPlayerDetails,
  allQueuedActions,
}: {
  playerDetails: PlayerRoleWithDetails;
  allPlayerDetails: PlayerRoleWithDetails[];
  allQueuedActions: QueuedActionDto[];
}) => {
  const playerRoleActions = playerDetails.actions;

  const queuedAction = useMemo(() => {
    if (playerDetails.role === Role.WereWolf) {
      return allQueuedActions.find(
        (action) => action.action === ActionType.WerewolfKill
      );
    }
    return allQueuedActions.find(
      (action) => action.playerId === playerDetails.id
    );
  }, [allQueuedActions, playerDetails.id, playerDetails.role]);

  return (
    <Card.Root alignItems="center" width="100%" borderBottomRadius={0}>
      <Card.Header>
        <PlayerActionCardHeader
          roleLabel={playerDetails.roleInfo.label}
          isActionQueued={!!queuedAction}
        />
      </Card.Header>
      <Card.Body>
        <PlayerActionCardBody playerDetails={[playerDetails]} />
      </Card.Body>
      <Card.Footer>
        {!queuedAction ? (
          <ActionButtonList
            playerId={playerDetails.id}
            actions={playerRoleActions}
          />
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
