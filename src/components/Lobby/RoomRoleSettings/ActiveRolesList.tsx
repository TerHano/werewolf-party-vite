import { Role } from "@/enum/Role";
import { useRoles } from "@/hooks/useRoles";
import { HStack, Box, Float, Badge } from "@chakra-ui/react";
import werewolfImg from "@/assets/icons/roles/werewolf-color.png";
export const ActiveRolesList = ({
  numberOfWerewolves = 1,
  activeRoles = [],
}: {
  numberOfWerewolves?: number;
  activeRoles?: Role[];
}) => {
  const { data } = useRoles({ roles: activeRoles });
  return (
    <HStack justify="center">
      <Box position="relative" w="32px" h="32px">
        <img src={werewolfImg} alt="werewolf" width="32" height="32" />
        {numberOfWerewolves > 1 ? (
          <Float placement="top-end">
            <Badge variant="surface" size="xs">
              x{numberOfWerewolves}
            </Badge>
          </Float>
        ) : null}
      </Box>

      {data.map((role, index) => {
        return (
          <img
            key={`${role.roleName}-${index}`}
            src={role.imgSrc}
            alt={role.label}
            width="32"
            height="32"
          />
        );
      })}
    </HStack>
  );
};
