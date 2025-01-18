import { useEndGame } from "@/hooks/useEndGame";
import { Badge, Separator, Stack } from "@chakra-ui/react";
import { Button } from "../ui/button";
import { useRoomId } from "@/hooks/useRoomId";
import { RoleInfo, useRoles } from "@/hooks/useRoles";
import { useCallback, useMemo, useState } from "react";
import { useAllPlayerRoles } from "@/hooks/useAllPlayerRoles";
import { ActionType } from "@/enum/ActionType";
import { useAllQueuedActions } from "@/hooks/useAllQueuedActions";
import { useDayDetails } from "@/hooks/useDayDetails";
import { useSocketConnection } from "@/hooks/useSocketConnection";
import { NightCall } from "./NightCall";
import { ChoppingBlock } from "./ChoppingBlock";
import { useTranslation } from "react-i18next";

interface ActionModalDetails {
  playerId: string;
  actionType: ActionType;
}

export const ModeratorView = () => {
  const { t } = useTranslation();
  const roomId = useRoomId();

  const { data: allPlayerRoles } = useAllPlayerRoles(roomId);
  const roles = allPlayerRoles?.map((playerRole) => playerRole.role);
  const { data: roleDetails } = useRoles({ roles: roles });
  const { data: allQueuedActions } = useAllQueuedActions(roomId);
  const { data: dayDetails, refetch: refetchDayDetails } =
    useDayDetails(roomId);
  // const playerRolesWithDetails = useMemo<PlayerRoleWithDetails[]>(() => {
  //   if (!allPlayerRoles || !roleDetails) {
  //     return [];
  //   }
  //   return (
  //     allPlayerRoles
  //       .map<PlayerRoleWithDetails>((assignedRole) => {
  //         return {
  //           ...assignedRole,
  //           roleInfo: getRoleForRoleId(assignedRole.role),
  //         };
  //       })
  //       //.filter((assignedRole) => assignedRole.roleInfo.showInModeratorRoleCall)
  //       .sort(
  //         (a, b) => a.roleInfo.roleCallPriority - b.roleInfo.roleCallPriority
  //       )
  //   );
  // }, [allPlayerRoles, roleDetails]);

  const { mutate: endGameMutation } = useEndGame();

  useSocketConnection({
    onDayOrTimeUpdated: () => {
      refetchDayDetails();
    },
  });

  const isDay = dayDetails?.isDay ?? false;

  const timeText = useMemo(() => {
    if (dayDetails?.currentNight === 0) {
      if (dayDetails.isDay) {
        return t("First Day");
      } else {
        return t("First Night");
      }
    } else {
      if (dayDetails?.isDay) {
        return t(`Day ${dayDetails?.currentNight}`);
      } else {
        return t(`Night ${dayDetails?.currentNight}`);
      }
    }
    return "Unknown";
  }, [dayDetails?.currentNight, dayDetails?.isDay, t]);

  return (
    <Stack width="100%">
      <Button
        onClick={() => {
          endGameMutation({ roomId });
        }}
      >
        End Game
      </Button>
      <Separator />
      <Badge colorPalette={isDay ? "yellow" : "purple"}>{timeText}</Badge>
      {isDay ? <ChoppingBlock /> : <NightCall />}
    </Stack>
  );
};
