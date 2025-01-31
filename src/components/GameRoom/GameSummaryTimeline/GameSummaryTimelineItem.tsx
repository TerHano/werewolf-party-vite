import {
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineItem,
  TimelineTitle,
} from "@/components/ui/timeline";
import { GameActionDto } from "@/dto/GameActionDto";
import { useRoles } from "@/hooks/useRoles";
import { ActionType } from "@/enum/ActionType";
import { Role } from "@/enum/Role";
import { useRoleActionHelper } from "@/hooks/useRoleActionHelper";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Image } from "@chakra-ui/react";
import voteImg from "@/assets/icons/vote-board.png";

interface TimelineLabels {
  iconSrc?: string;
  title?: string;
  description: string;
}

export const GameSummaryTimelineItem = ({
  action,
}: {
  action: GameActionDto;
}) => {
  const { t } = useTranslation();
  const { data: role } = useRoles();
  const { getActionButtonProps } = useRoleActionHelper();
  const roleDoingAction =
    action.action === ActionType.WerewolfKill
      ? role.find((r) => r.roleName === Role.WereWolf)
      : role.find((r) => r.roleName === action.player?.role);

  const affectedPlayerRole = role.find(
    (r) => r.roleName === action.affectedPlayer?.role
  );

  const timelineLabels = useMemo<TimelineLabels>(() => {
    switch (action.action) {
      case ActionType.VotedOut:
        return {
          iconSrc: voteImg,
          title: t("Group Vote"),
          description: `The villagers chose to lynch ${action.affectedPlayer.nickname}`,
        };

      case ActionType.WerewolfKill:
        return {
          iconSrc: roleDoingAction?.imgSrc,
          title: t("Werewolves"),
          description: `${getActionButtonProps(action.action).pastTenseLabel} ${action.affectedPlayer.nickname}`,
        };
      case ActionType.Revive:
        return {
          iconSrc: roleDoingAction?.imgSrc,
          title: roleDoingAction?.label,
          description: `${getActionButtonProps(action.action).pastTenseLabel} ${action.affectedPlayer.nickname}`,
        };
      case ActionType.Investigate:
        return {
          iconSrc: roleDoingAction?.imgSrc,
          title: roleDoingAction?.label,
          description: `${getActionButtonProps(action.action).pastTenseLabel} ${action.affectedPlayer.nickname}`,
        };

      case ActionType.Suicide:
        return {
          iconSrc: roleDoingAction?.imgSrc,
          title: roleDoingAction?.label,
          description: `${affectedPlayerRole?.label} decided to take their own life`,
        };

      case ActionType.VigilanteKill:
      case ActionType.Kill:
        return {
          iconSrc: roleDoingAction?.imgSrc,
          title: roleDoingAction?.label,
          description: `${getActionButtonProps(action.action).pastTenseLabel} ${action.affectedPlayer.nickname}`,
        };

      default:
        return {
          title: t("Unkown"),
          description: `Unknown`,
        };
    }
  }, [
    action.action,
    action.affectedPlayer.nickname,
    affectedPlayerRole?.label,
    getActionButtonProps,
    roleDoingAction?.imgSrc,
    roleDoingAction?.label,
    t,
  ]);

  return (
    <TimelineItem>
      <TimelineConnector>
        <Image src={timelineLabels.iconSrc} width="24px" />
      </TimelineConnector>
      <TimelineContent>
        <TimelineTitle>{timelineLabels.title}</TimelineTitle>
        <TimelineDescription>{timelineLabels.description}</TimelineDescription>
        {/* <Text textStyle="sm">
          We shipped your product via <strong>FedEx</strong> and it should
          arrive within 3-5 business days.
        </Text> */}
      </TimelineContent>
    </TimelineItem>
  );
};
