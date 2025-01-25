import { Card, Text, Image, Badge, VStack } from "@chakra-ui/react";
import { usePlayerRoleActions } from "@/hooks/usePlayerRoleActions";
import { useRoomId } from "@/hooks/useRoomId";
import { ActionType } from "@/enum/ActionType";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo } from "react";
import { QueuedActionDto } from "@/dto/QueuedActionDto";
import { Role } from "@/enum/Role";
import { IconSkull, IconUser } from "@tabler/icons-react";
import { PlayerRoleWithDetails } from "../NightCall";
import { ActionButtonList } from "./ActionButtonList";
import { QueuedActionCard } from "./QueuedActionCard";
import { useAnimationReset } from "@/hooks/useAnimationReset";

export const PlayerActionCard = ({
  playerDetails,
  allPlayerDetails,
  allQueuedActions,
}: {
  playerDetails: PlayerRoleWithDetails;
  allPlayerDetails: PlayerRoleWithDetails[];
  allQueuedActions: QueuedActionDto[];
}) => {
  const { t } = useTranslation();
  //const roomId = useRoomId();
  const { animation, resetAnimation } = useAnimationReset();
  const playerRoleActions = playerDetails.actions;
  // const { data: playerRoleActions, isFetching: isRoleActionsLoading } =
  //   usePlayerRoleActions(roomId, playerDetails.id, {
  //     initialData: playerDetails.actions,
  //   });
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

  useEffect(() => {
    resetAnimation();
  }, [queuedAction, resetAnimation]);

  return (
    <Card.Root alignItems="center" width="100%">
      <Card.Header>
        <Text
          className="animate-fade-in-from-bottom"
          fontSize="xl"
          textStyle="accent"
          animation={animation}
        >
          {queuedAction
            ? t(`${playerDetails.roleInfo.label}, Close Your Eyes!`)
            : t(`Wake Up, ${playerDetails.roleInfo.label}!`)}
        </Text>
      </Card.Header>
      <Card.Body
        animationDelay="moderate"
        className="animate-fade-in-from-bottom"
      >
        <VStack gap={1}>
          <Image width="8rem" src={playerDetails.roleInfo.imgSrc} />

          {!playerDetails.isAlive ? (
            <Badge colorPalette="red">
              <IconSkull size={12} />
              {playerDetails.nickname}
            </Badge>
          ) : (
            <Badge colorPalette="current">
              <IconUser size={12} />
              {playerDetails.nickname}
            </Badge>
          )}
        </VStack>
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
