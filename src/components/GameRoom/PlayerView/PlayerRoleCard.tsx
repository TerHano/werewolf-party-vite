import { getColorForRoleType, RoleInfo } from "@/hooks/useRoles";
import { Badge, Card, Image, Text, VStack } from "@chakra-ui/react";

export const PlayerRoleCard = ({ roleInfo }: { roleInfo: RoleInfo }) => {
  return (
    <Card.Root className="animate-fade-in-from-bottom" alignItems="center">
      <Card.Body>
        <VStack gap={2}>
          <VStack gap={1}>
            <Image height="10rem" width="10rem" src={roleInfo?.imgSrc} />

            <Badge
              variant="subtle"
              colorPalette={getColorForRoleType(roleInfo?.roleType)}
            >
              <Text lineHeight={1} fontSize="3xl" textStyle="accent">
                {roleInfo?.label ?? "ROLE_LABEL"}
              </Text>
            </Badge>

            <Text
              lineHeight={1}
              color="gray.400"
              fontSize="xl"
              textStyle="accent"
            >
              {roleInfo?.shortDescription ?? "Lorem Ipsum Lorem Ipsum"}
            </Text>
          </VStack>

          <Text
            lineHeight="1.2em"
            textAlign="center"
            textStyle="accent"
            fontSize="lg"
          >
            {roleInfo?.description}
          </Text>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};
