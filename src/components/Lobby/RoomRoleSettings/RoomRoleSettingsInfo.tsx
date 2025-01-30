import { Role } from "@/enum/Role";
import { useRole, useRoles } from "@/hooks/useRoles";
import { Separator, Stack } from "@chakra-ui/react";
import { ActiveRolesList } from "./ActiveRolesList";
import { useMeasure } from "@uidotdev/usehooks";
import { RoleInfoList } from "../RoleInfoList";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";

type ShowRoleControl = "active" | "all";

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

  const [roleControl, setRoleControl] = useState<ShowRoleControl>("active");

  if (!werewolfRole) {
    throw new Error("Problem getting werewolf");
  }

  const roleList =
    roleControl === "all" ? allRoles : [werewolfRole, ...activeRolesData];

  return (
    <Stack ref={ref} mb="1rem" align="center" gap={3}>
      <ActiveRolesList
        widthOfContainer={width}
        numberOfWerewolves={numberOfWerewolves}
        activeRoles={activeRoles}
      />
      <Separator />
      <SegmentedControl
        w="fit-content"
        value={roleControl}
        onValueChange={(e) => setRoleControl(e.value as ShowRoleControl)}
        items={[
          { label: t("Active"), value: "active" },
          { label: t("All"), value: "all" },
        ]}
      />
      <RoleInfoList roles={roleList} />
      {/* <RoleInformationDialog
        roles={allRoles}
        button={{
          children: t("Learn All The Roles"),
        }}
      /> */}
    </Stack>
  );
};
