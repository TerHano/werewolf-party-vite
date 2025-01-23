import { Role } from "@/enum/Role";
import { useRole, useRoles } from "@/hooks/useRoles";
import { HStack, Separator, Stack, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { ActiveRolesList } from "./ActiveRolesList";

export const RoomRoleSettingsInfo = ({
  numberOfWerewolves,
  activeRoles,
}: {
  numberOfWerewolves: number;
  activeRoles: number[];
}) => {
  const { data: werewolfRole } = useRole(Role.WereWolf);
  const { data } = useRoles({ roles: activeRoles });

  if (!werewolfRole) {
    throw new Error("Problem getting werewolf");
  }
  return (
    <Stack mb="1rem" gap={2}>
      <ActiveRolesList
        numberOfWerewolves={numberOfWerewolves}
        activeRoles={activeRoles}
      />
      <Separator />
      <HStack gap={5}>
        <VStack minW="4rem" gap={1}>
          <img width={36} src={werewolfRole.imgSrc} alt={werewolfRole.label} />
          <Text textStyle="accent" fontSize={18}>
            {werewolfRole.label}
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
            {werewolfRole.shortDescription}
          </Text>
          <Text>{werewolfRole.description}</Text>
        </Stack>
      </HStack>
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
