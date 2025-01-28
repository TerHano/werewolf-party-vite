import { Role } from "@/enum/Role";
import { useRole, useRoles } from "@/hooks/useRoles";
import { Stack } from "@chakra-ui/react";
import { ActiveRolesList } from "./ActiveRolesList";
import { useMeasure } from "@uidotdev/usehooks";
import { RoleInfoList } from "../RoleInfoList";
import { RoleInformationDialog } from "../RoleInformationDialog";
import { useTranslation } from "react-i18next";

export const RoomRoleSettingsInfo = ({
  numberOfWerewolves,
  activeRoles,
}: {
  numberOfWerewolves: number;
  activeRoles: number[];
}) => {
  const { t } = useTranslation();
  const { data: werewolfRole } = useRole(Role.WereWolf);
  const { data: allRoles } = useRoles();
  const activeRolesData = allRoles?.filter((role) =>
    activeRoles.includes(role.roleName)
  );
  const [ref, { width }] = useMeasure();

  if (!werewolfRole) {
    throw new Error("Problem getting werewolf");
  }
  return (
    <Stack ref={ref} mb="1rem" gap={3}>
      <ActiveRolesList
        justify="center"
        widthOfContainer={width}
        numberOfWerewolves={numberOfWerewolves}
        activeRoles={activeRoles}
      />

      <RoleInfoList roles={[werewolfRole, ...activeRolesData]} />
      <RoleInformationDialog
        roles={allRoles}
        button={{
          children: t("Learn All The Roles"),
        }}
      />
    </Stack>
  );
};
