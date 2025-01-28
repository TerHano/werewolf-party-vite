import { useAssignedRole } from "@/hooks/useAssignedRole";
import { getColorForRoleType, useRole } from "@/hooks/useRoles";
import { useRoomId } from "@/hooks/useRoomId";
import { Badge, Card, Image, Skeleton, Text, VStack } from "@chakra-ui/react";
import { SkeletonCircle, SkeletonText } from "../ui/skeleton";
import { WaitingPlayerCard } from "./WaitingPlayerCard";

export const PlayerView = () => {
  const roomId = useRoomId();
  const { data: assignedRole, isFetching: isAssignedRoleLoading } =
    useAssignedRole(roomId);

  const { data: roleInfo } = useRole(assignedRole);

  // if (isAssignedRoleLoading) {
  //   return null;
  // }

  if (!isAssignedRoleLoading && !roleInfo) {
    return <WaitingPlayerCard />;
  }

  return (
    <Card.Root className="animate-fade-in-from-bottom" alignItems="center">
      <Card.Body>
        <VStack gap={2}>
          {/* <Skeleton asChild loading={isAssignedRoleLoading}> */}

          {/* </Skeleton> */}
          <VStack gap={1}>
            <SkeletonCircle
              height="10rem"
              width="10rem"
              loading={isAssignedRoleLoading}
            >
              <Image src={roleInfo?.imgSrc} />
            </SkeletonCircle>
            {/* <Skeleton loading={isAssignedRoleLoading}> */}
            <Skeleton loading={isAssignedRoleLoading}>
              <Badge
                variant="subtle"
                colorPalette={getColorForRoleType(roleInfo?.roleType)}
              >
                <Text lineHeight={1} fontSize="3xl" textStyle="accent">
                  {roleInfo?.label ?? "ROLE_LABEL"}
                </Text>
              </Badge>
            </Skeleton>
            {/* </Skeleton> */}
            {/* <Skeleton loading={isAssignedRoleLoading}> */}
            <Skeleton loading={isAssignedRoleLoading}>
              <Text
                lineHeight={1}
                color="gray.400"
                fontSize="xl"
                textStyle="accent"
              >
                {roleInfo?.shortDescription ?? "Lorem Ipsum Lorem Ipsum"}
              </Text>
            </Skeleton>
            {/* </Skeleton> */}
          </VStack>
          {isAssignedRoleLoading ? (
            <SkeletonText noOfLines={4} loading />
          ) : (
            <Text
              lineHeight="1.2em"
              textAlign="center"
              textStyle="accent"
              fontSize="lg"
            >
              {roleInfo?.description}
            </Text>
          )}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};
