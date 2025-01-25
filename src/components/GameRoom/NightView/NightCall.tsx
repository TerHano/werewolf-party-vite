import { Flex, Group, Image, Stack } from "@chakra-ui/react";
import { Button } from "../../ui/button";
import { useRoomId } from "@/hooks/useRoomId";
import { StepsContent, StepsItem, StepsList, StepsRoot } from "../../ui/steps";
import { getRoleForRoleId, RoleInfo, useRoles } from "@/hooks/useRoles";
import { useCallback, useMemo, useState } from "react";
import { PlayerRoleActionDto } from "@/dto/PlayerRoleActionDto";
import { useAllPlayerRoles } from "@/hooks/useAllPlayerRoles";
import { PlayerActionCard } from "./PlayerActionCard/PlayerActionCard";
import { NightCompletedCard } from "./NightCompletedCard";
import { ActionType } from "@/enum/ActionType";
import { ActionModal } from "./ActionModals/ActionModal";
import { useAllQueuedActions } from "@/hooks/useAllQueuedActions";
import { IconSunFilled } from "@tabler/icons-react";
import { Role } from "@/enum/Role";
import werewolfImg from "@/assets/icons/roles/werewolf-color.png";
import { WerewolfPlayersActionCard } from "./PlayerActionCard/WerewolfPlayersActionCard";
import { ActionModalContext } from "@/context/ActionModalContext";
import { useTranslation } from "react-i18next";

export interface PlayerRoleWithDetails extends PlayerRoleActionDto {
  roleInfo: RoleInfo;
}

interface ActionModalDetails {
  playerId?: string;
  actionType: ActionType;
}

export const NightCall = () => {
  const roomId = useRoomId();
  const [isActionModalOpen, setActionModalOpen] = useState(false);
  const [actionModalProps, setActionModalProps] = useState<
    ActionModalDetails | undefined
  >();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const { t } = useTranslation();

  const openActionModalCb = useCallback(
    (actionType: ActionType, playerId?: string) => {
      setActionModalProps({ playerId, actionType });
      setActionModalOpen(true);
    },
    []
  );
  const { data: allPlayerRoles } = useAllPlayerRoles(roomId);
  const roles = allPlayerRoles?.map((playerRole) => playerRole.role);
  const { data: roleDetails } = useRoles({ roles: roles });
  const { data: allQueuedActions } = useAllQueuedActions(roomId);
  const playerRolesWithDetails = useMemo<PlayerRoleWithDetails[]>(() => {
    if (!allPlayerRoles || !roleDetails) {
      return [];
    }
    return (
      allPlayerRoles
        .map<PlayerRoleWithDetails>((assignedRole) => {
          return {
            ...assignedRole,
            roleInfo: getRoleForRoleId(assignedRole.role),
          };
        })
        //.filter((assignedRole) => assignedRole.roleInfo.showInModeratorRoleCall)
        .sort(
          (a, b) => a.roleInfo.roleCallPriority - b.roleInfo.roleCallPriority
        )
    );
  }, [allPlayerRoles, roleDetails]);

  const rolesToCallExcludingWerewolves = playerRolesWithDetails.filter(
    (assignedRole) =>
      assignedRole.roleInfo.showInModeratorRoleCall &&
      assignedRole.role !== Role.WereWolf
  );

  //Adding werewolf and 'Go to sleep' card to count
  const nightCallLength = rolesToCallExcludingWerewolves.length + 1;

  return (
    <ActionModalContext.Provider value={openActionModalCb}>
      {actionModalProps ? (
        <ActionModal
          isOpen={isActionModalOpen}
          onOpenChange={(isOpen) => {
            setActionModalOpen(isOpen);
          }}
          allPlayers={playerRolesWithDetails}
          playerId={actionModalProps?.playerId}
          actionType={actionModalProps?.actionType}
        />
      ) : null}

      <Stack height="auto" direction="column" width="100%" gap={4}>
        <StepsRoot
          step={currentStep}
          variant="subtle"
          size="lg"
          defaultValue={0}
          count={nightCallLength}
          gap={2}
        >
          <StepsList justifyContent="center">
            <Flex wrap="wrap" gapY={2}>
              <StepsItem
                maxW="10rem"
                minW="6rem"
                onClick={() => setCurrentStep(0)}
                icon={<Image width="24px" src={werewolfImg} />}
                key={`item-werewolves`}
                index={0}
              />
              {rolesToCallExcludingWerewolves.map((playerRole, index) => {
                return (
                  <StepsItem
                    maxW="10rem"
                    minW="6rem"
                    onClick={() => setCurrentStep(index + 1)}
                    icon={
                      <Image width="24px" src={playerRole.roleInfo.imgSrc} />
                    }
                    key={`item-${playerRole.id}`}
                    index={index + 1}
                    // title={playerRole.roleInfo.label}
                  />
                );
              })}
              <StepsItem
                onClick={() => setCurrentStep(nightCallLength)}
                icon={<IconSunFilled />}
                key={`item-complete`}
                index={nightCallLength}
                // title={playerRole.roleInfo.label}
              />
            </Flex>
          </StepsList>
          <Stack
            height="80vh"
            width="100%"
            alignItems="center"
            justifyContent="start"
          >
            <StepsContent width="100%" key={`content-werewolves`} index={0}>
              <WerewolfPlayersActionCard
                allPlayerDetails={playerRolesWithDetails}
                allQueuedActions={allQueuedActions ?? []}
              />
            </StepsContent>
            {rolesToCallExcludingWerewolves.map((playerRole, index) => {
              return (
                <StepsContent
                  width="100%"
                  key={`content-${playerRole.id}`}
                  index={index + 1}
                >
                  <>
                    <PlayerActionCard
                      playerDetails={playerRole}
                      allPlayerDetails={playerRolesWithDetails}
                      allQueuedActions={allQueuedActions ?? []}
                    />
                  </>
                </StepsContent>
              );
            })}
            <StepsContent
              width="100%"
              key={`content-complete`}
              index={nightCallLength}
            >
              <NightCompletedCard />
            </StepsContent>

            <Group>
              <Button
                disabled={currentStep === 0}
                onClick={() => setCurrentStep(currentStep - 1)}
                variant="outline"
                size="sm"
              >
                {t("Previous")}
              </Button>
              <Button
                disabled={currentStep === nightCallLength}
                onClick={() => setCurrentStep(currentStep + 1)}
                variant="outline"
                size="sm"
              >
                {t("Next")}
              </Button>
            </Group>
          </Stack>
        </StepsRoot>
      </Stack>
    </ActionModalContext.Provider>
  );
};
