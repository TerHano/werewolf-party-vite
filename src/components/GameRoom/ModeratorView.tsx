import { useEndGame } from "@/hooks/useEndGame";
import { Group, Image, Stack, Text } from "@chakra-ui/react";
import { Button } from "../ui/button";
import { useRoomId } from "@/hooks/useRoomId";
import {
  StepsCompletedContent,
  StepsContent,
  StepsItem,
  StepsList,
  StepsNextTrigger,
  StepsPrevTrigger,
  StepsRoot,
} from "../ui/steps";
import { getRoleForRoleId, RoleInfo, useRoles } from "@/hooks/useRoles";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { PlayerRoleActionDto } from "@/dto/PlayerRoleActionDto";
import { useAllPlayerRoles } from "@/hooks/useAllAssignedRoles";

interface PlayerRoleWithDetails extends PlayerRoleActionDto {
  roleInfo: RoleInfo;
}

export const ModeratorView = () => {
  const roomId = useRoomId();
  const { t } = useTranslation();
  const { data: allPlayerRoles } = useAllPlayerRoles(roomId);
  const roles = allPlayerRoles?.map((playerRole) => playerRole.role);
  const { data: roleDetails } = useRoles({ roles: roles });
  const playerRolesWithDetails = useMemo<PlayerRoleWithDetails[]>(() => {
    if (!allPlayerRoles || !roleDetails) {
      return [];
    }
    return allPlayerRoles
      .map<PlayerRoleWithDetails>((assignedRole) => {
        return {
          ...assignedRole,
          roleInfo: getRoleForRoleId(assignedRole.role),
        };
      })
      .filter((assignedRole) => assignedRole.roleInfo.showInModeratorRoleCall)
      .sort(
        (a, b) => a.roleInfo.roleCallPriority - b.roleInfo.roleCallPriority
      );
  }, [allPlayerRoles, roleDetails]);
  const { mutate: endGameMutation } = useEndGame();

  return (
    <>
      <Button
        onClick={() => {
          endGameMutation({ roomId });
        }}
      >
        End Game
      </Button>
      <StepsRoot
        orientation="vertical"
        size="lg"
        width="100%"
        defaultValue={0}
        count={playerRolesWithDetails.length}
      >
        <StepsList
          minHeight="50vh"
          height={`${70 * playerRolesWithDetails.length}px`}
          maxHeight="80vh"
        >
          {playerRolesWithDetails.map((playerRole, index) => {
            return (
              <StepsItem
                icon={<Image width="24px" src={playerRole.roleInfo.imgSrc} />}
                key={`item-${playerRole.id}`}
                index={index}
                // title={playerRole.roleInfo.label}
              />
            );
          })}
        </StepsList>
        <Stack
          height="80vh"
          width="100%"
          alignItems="center"
          justifyContent="center"
        >
          {playerRolesWithDetails.map((playerRole, index) => {
            return (
              <StepsContent key={`content-${playerRole.id}`} index={index}>
                <Text fontSize="xl" textStyle="accent">
                  {t(`Wake Up, ${playerRole.roleInfo.label}!`)}
                </Text>
              </StepsContent>
            );
          })}
          <StepsCompletedContent>All steps are complete!</StepsCompletedContent>

          <Group>
            <StepsPrevTrigger asChild>
              <Button variant="outline" size="sm">
                Prev
              </Button>
            </StepsPrevTrigger>
            <StepsNextTrigger asChild>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </StepsNextTrigger>
          </Group>
        </Stack>
      </StepsRoot>
    </>
  );
};
