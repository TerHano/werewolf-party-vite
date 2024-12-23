import { Role } from "@/enum/Role";
import { useRoles } from "@/hooks/useRoles";
import { HStack, Separator, Stack, Text, VStack } from "@chakra-ui/react";
import React from "react";

export const RoomRoleSettingsInfo = ({
  activeRoles,
}: {
  activeRoles: number[];
}) => {
  const { data } = useRoles({ roles: [Role.WereWolf, ...activeRoles] });
  return (
    <Stack mb="1rem" gap={2}>
      {data.map((role) => (
        <React.Fragment key={role.roleName}>
          <Separator />
          <HStack gap={5}>
            <VStack minW="4rem" gap={1}>
              <img width={36} src={role.imgSrc} alt={role.label} />
              <Text textStyle="accent" fontSize={18}>
                {role.label}
              </Text>
            </VStack>
            <Stack>
              <Text
                textStyle="accent"
                color="gray.400"
                fontStyle="italic"
                fontWeight={600}
                fontSize="1.2rem"
              >
                {role.shortDescription}
              </Text>
              <Text>{role.description}</Text>
            </Stack>
          </HStack>
        </React.Fragment>
      ))}
    </Stack>
  );
};
