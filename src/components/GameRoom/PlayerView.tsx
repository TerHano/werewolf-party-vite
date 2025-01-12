import { useAssignedRole } from "@/hooks/useAssignedRole";
import { getColorForRoleType, useRole } from "@/hooks/useRoles";
import { useRoomId } from "@/hooks/useRoomId";
import { Badge, Card, Image, Text, VStack } from "@chakra-ui/react";

export const PlayerView = () => {
  const roomId = useRoomId();
  const { data: assignedRole, isLoading: isAssignedRoleLoading } =
    useAssignedRole(roomId);

  const roleInfo = useRole(assignedRole);

  if (isAssignedRoleLoading) {
    return null;
  }

  if (!roleInfo) {
    return "Spectating";
  }

  return (
    <Card.Root alignItems="center">
      <Card.Body>
        <VStack gap={3}>
          <Image src={roleInfo.imgSrc} width="10rem" />
          <VStack gap={0}>
            <Badge
              variant="subtle"
              colorPalette={getColorForRoleType(roleInfo.roleType)}
            >
              <Text lineHeight={1} fontSize="3xl" textStyle="accent">
                {roleInfo.label}
              </Text>
            </Badge>
            <Text
              lineHeight={1}
              color="gray.400"
              fontSize="xl"
              textStyle="accent"
            >
              {roleInfo.shortDescription}
            </Text>
          </VStack>
          <Text
            lineHeight="1.2em"
            textAlign="center"
            textStyle="accent"
            fontSize="lg"
          >
            {roleInfo.description}
          </Text>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};
