import { useAssignedRole } from "@/hooks/useAssignedRole";
import { useRole } from "@/hooks/useRoles";
import { useRoomId } from "@/hooks/useRoomId";
import { Card, Skeleton, VStack } from "@chakra-ui/react";
import { WaitingPlayerCard } from "@/components/GameRoom/PlayerView/WaitingPlayerCard";
import { PlayerRoleCard } from "@/components/GameRoom/PlayerView/PlayerRoleCard";
import { SkeletonCircle } from "@/components/ui/skeleton";

export const PlayerView = () => {
  const roomId = useRoomId();
  const { data: assignedRole, isFetching: isAssignedRoleLoading } =
    useAssignedRole(roomId);

  const { data: roleInfo } = useRole(assignedRole);

  if (isAssignedRoleLoading) {
    return (
      <Card.Root>
        <Card.Body>
          <VStack gap={2}>
            <SkeletonCircle loading width="10rem" />
            <Skeleton loading height={4} />
          </VStack>
        </Card.Body>
      </Card.Root>
    );
  }

  const isPlayerInWaitingRoom = !roleInfo;

  return (
    <>
      {isPlayerInWaitingRoom ? (
        <WaitingPlayerCard />
      ) : (
        <PlayerRoleCard roleInfo={roleInfo} />
      )}
    </>
  );
};
