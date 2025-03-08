import { PlayerRoleActionDto } from "@/dto/PlayerRoleActionDto";
import { Role } from "@/enum/Role";

import werewolfImg from "@/assets/icons/roles/werewolf-color.png";
import villagerImg from "@/assets/icons/roles/villager-color.png";
import { VStack, Image, Text, Highlight } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export const WerewolfInvestigationResult = ({
  playerRoleId,
  allPlayers,
}: {
  playerRoleId: number | undefined;
  allPlayers: PlayerRoleActionDto[];
}) => {
  const { t } = useTranslation();
  const suspect = allPlayers.find((player) => player.id === playerRoleId);
  const isWerewolf =
    suspect?.role == Role.WereWolf || suspect?.role == Role.Cursed;

  if (isWerewolf) {
    return (
      <VStack className="animate-fade-in-from-bottom">
        <Image src={werewolfImg} width="10rem" alt="Werewolf" />
        <Text fontSize="md">
          <Highlight
            styles={{ bg: "green.subtle", color: "green.fg" }}
            query={t("IS")}
          >
            {t(`YIKES! ${suspect.nickname} IS a Werewolf!`)}
          </Highlight>
        </Text>
      </VStack>
    );
  } else {
    return (
      <VStack className="animate-fade-in-from-bottom">
        <Image src={villagerImg} width="10rem" alt="Villager" />
        <Text fontSize="md">
          <Highlight
            styles={{ bg: "red.subtle", color: "red.fg" }}
            query={t("NOT")}
          >
            {t(`${suspect?.nickname} is NOT a Werewolf!`)}
          </Highlight>
        </Text>
      </VStack>
    );
  }
};

export default WerewolfInvestigationResult;
