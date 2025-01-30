import { PlayerRoleWithDetails } from "../NightCall";
import { ActionButtonList } from "@/components/GameRoom/ModeratorView/NightView/PlayerActionCard/ActionButtonList";
import { RoleActionDto } from "@/dto/RoleActionDto";
import { QueuedActionCard } from "@/components/GameRoom/ModeratorView/NightView/PlayerActionCard/QueuedActionCard";
import { QueuedActionDto } from "@/dto/QueuedActionDto";

export const PlayerActionCardFooter = ({
  playerId,
  actions,
  queuedAction,
  allPlayerDetails,
}: {
  playerId?: string;
  actions: RoleActionDto[];
  queuedAction: QueuedActionDto | undefined;
  allPlayerDetails: PlayerRoleWithDetails[];
}) => {
  return (
    <>
      <ActionButtonList
        isVisible={!queuedAction}
        playerId={playerId}
        actions={actions}
      />
      {queuedAction ? (
        <QueuedActionCard
          queuedAction={queuedAction}
          allPlayersDetails={allPlayerDetails}
        />
      ) : null}
    </>
  );
};
