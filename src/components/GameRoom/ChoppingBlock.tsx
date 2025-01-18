import { Button } from "../ui/button";
import { useRoomId } from "@/hooks/useRoomId";
import { useRoles } from "@/hooks/useRoles";
import { useAllPlayerRoles } from "@/hooks/useAllPlayerRoles";
import { useVotePlayerOut } from "@/hooks/useVotePlayerOut";
import { useTranslation } from "react-i18next";

export const ChoppingBlock = () => {
  const roomId = useRoomId();
  const { t } = useTranslation();

  //const { t } = useTranslation();

  const { data: allPlayerRoles } = useAllPlayerRoles(roomId);
  const roles = allPlayerRoles?.map((playerRole) => playerRole.role);
  const { data: roleDetails } = useRoles({ roles: roles });

  const { mutate: votePlayerOutMutate } = useVotePlayerOut();
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

  return (
    <>
      <Button
        onClick={() => {
          votePlayerOutMutate({
            roomId,
            playerId: undefined,
          });
        }}
      >
        {t("Abstain Vote")}
      </Button>
    </>
  );
};
