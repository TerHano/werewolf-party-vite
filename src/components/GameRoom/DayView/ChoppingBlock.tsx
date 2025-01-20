import { Button } from "../../ui/button";
import { useRoomId } from "@/hooks/useRoomId";
import { useRoles } from "@/hooks/useRoles";
import { useAllPlayerRoles } from "@/hooks/useAllPlayerRoles";
import { useVotePlayerOut } from "@/hooks/useVotePlayerOut";
import { useTranslation } from "react-i18next";
import { useLatestPlayerDeaths } from "@/hooks/useLatestPlayerDeaths";
import { Alert } from "../../ui/alert";
import { Avatar } from "@chakra-ui/react/avatar";
import { Badge, Card, Float, Group, Text } from "@chakra-ui/react";
import { usePlayerAvatar } from "@/hooks/usePlayerAvatar";
import { IconGrave2 } from "@tabler/icons-react";
import { KilledPlayersBanner } from "./KilledPlayersBanner";

export const ChoppingBlock = () => {
  const roomId = useRoomId();
  const { t } = useTranslation();

  //const { t } = useTranslation();

  const { data: allPlayerRoles } = useAllPlayerRoles(roomId);
  const roles = allPlayerRoles?.map((playerRole) => playerRole.role);

  const { mutate: votePlayerOutMutate } = useVotePlayerOut();

  return (
    <>
      <KilledPlayersBanner />
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
