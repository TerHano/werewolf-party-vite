import { Role } from "@/enum/Role";
import { RoleType } from "@/enum/RoleType";
import { useCallback, useMemo } from "react";
import moderatorImg from "@/assets/icons/roles/moderator-color.png";
import werewolfImg from "@/assets/icons/roles/werewolf-color.png";
import doctorImg from "@/assets/icons/roles/doctor-color.png";
import detectiveImg from "@/assets/icons/roles/seer-color.png";
import witchImg from "@/assets/icons/roles/witch-color.png";
import drunkImg from "@/assets/icons/roles/drunk-color.png";
import villagerImg from "@/assets/icons/roles/villager-color.png";
import vigilanteImg from "@/assets/icons/roles/vigilante-color.png";
import lycanImg from "@/assets/icons/roles/lycan-color.png";

export interface RoleInfo {
  label: string;
  shortDescription: string;
  description: string;
  roleName: Role;
  roleType: RoleType;
  imgSrc: string;
  showInModeratorRoleCall: boolean;
  roleCallPriority: number;
}

const data: RoleInfo[] = [
  {
    label: "Moderator",
    shortDescription: "Game Master",
    description:
      "The flow of the game lives and dies by the Moderator's hand. They are the sole player that knows the role of each player, and walks the rest of the players through day, night and death the following morning. It's their job to keep the game moving, so some Moderators opt for a 5 minute time limit during the day for everyone to decide who to kill off. They also are the one who calls for a vote when a nominee to be killed off has arisen. The Moderator may find it helpful to use the app to keep track of each role and who has been killed that night should there be a large quantity of players.",
    roleName: Role.Moderator,
    roleType: RoleType.Moderator,
    roleCallPriority: 0,
    showInModeratorRoleCall: false,
    imgSrc: moderatorImg,
  },
  {
    label: "Werewolf",
    shortDescription: "Take over the Village",
    description:
      "The goal of the werewolves is to decide on one villager to secretly kill off during the night, while posing as villagers during the day so they're not killed off themselves.",
    roleName: Role.WereWolf,
    roleType: RoleType.Enemy,
    imgSrc: werewolfImg,
    showInModeratorRoleCall: true,
    roleCallPriority: 1,
  },
  {
    label: "Doctor",
    shortDescription: "Heal the Innocent",
    description:
      "The Doctor has the ability to heal themselves or another villager when called awake by the Moderator during the night. Should they heal themselves, they will be safe from being killed by the werewolves, or should they want to prove themselves the Doctor or fear the death of a fellow villager, can opt to heal them instead.",
    roleName: Role.Doctor,
    roleType: RoleType.Traditional,
    imgSrc: doctorImg,
    showInModeratorRoleCall: true,
    roleCallPriority: 2,
  },
  {
    label: "Detective",
    shortDescription: "Find the Werewolves",
    description:
      "When called awake by the Moderator, the Detective can point to any of their fellow players and the Moderator must nod yes or no as to whether or not they are indeed a Werewolf.",
    roleName: Role.Detective,
    roleType: RoleType.Traditional,
    imgSrc: detectiveImg,
    showInModeratorRoleCall: true,
    roleCallPriority: 3,
  },
  {
    label: "Witch",
    shortDescription: "Heal the Innocent, Kill the Werewolves",
    description:
      "The Witch has the additional powers of one potion and one poison, which they may use at any point throughout the game. They can only use one per evening until both are gone, and have the ability to save them until a point in the game they deem fit.",
    roleName: Role.Witch,
    roleType: RoleType.Special,
    imgSrc: witchImg,

    showInModeratorRoleCall: true,
    roleCallPriority: 4,
  },
  {
    label: "Drunk",
    shortDescription: "Don't Speak!",
    description:
      "Also a villager, the Drunk has the additional burden of only being able to communicate with gestures or noises. They may not talk during the day at all, and if they do, automatically die during that night.",
    roleName: Role.Drunk,
    roleType: RoleType.Special,
    imgSrc: drunkImg,

    showInModeratorRoleCall: false,
    roleCallPriority: 5,
  },
  /*** Remove Sherrif for now */
  // {
  //     label: 'Sherrif',
  //     shortDescription: 'Overruled!',
  //     description:
  //         'A role assigned to a player by other players in the game. They hold the tiebreaker vote if there is a tie between two candidates for lynching, and are able to choose their successor.',
  //     roleName: Role.Sherrif,
  //     roleType: RoleType.Special,

  // },
  {
    label: "Villager",
    shortDescription: "Defend The Village",
    description:
      "The most commonplace role, a simple villager, spends the game trying to root out who they believe the werewolves (and other villagers) are.",
    roleName: Role.Villager,
    roleType: RoleType.Villager,
    imgSrc: villagerImg,
    showInModeratorRoleCall: false,
    roleCallPriority: 6,
  },
  {
    label: "Vigilante",
    shortDescription: "Protect The Village",
    description:
      "The Vigilante has the ability to kill another villager each night, but if the villager you kill is not a Werewolf, you will commit suicide the next night out of guilt",
    roleName: Role.Vigilante,
    roleType: RoleType.Special,
    imgSrc: vigilanteImg,
    showInModeratorRoleCall: true,
    roleCallPriority: 7,
  },
  {
    label: "Cursed",
    shortDescription: "Prove Your Innocence!",
    description:
      "The Cursed think they are regular villagers, but they were cursed with the mark of the wolf at birth and are seen as members of the wolfpack by the detective.",
    roleName: Role.Cursed,
    roleType: RoleType.Special,
    showInModeratorRoleCall: false,
    roleCallPriority: 8,
    imgSrc: lycanImg,
  },
];

interface UseRoleProps {
  roles?: number[];
}

export const useRoles = ({ roles }: UseRoleProps = {}) => {
  const isRoleType = useCallback((role: number, type: RoleType) => {
    return data
      .filter((x) => x.roleType === type)
      .some((x) => x.roleName == role);
  }, []);

  const filteredRoles = useMemo(() => {
    if (!roles) return data;
    return data
      .sort((a, b) => a.roleCallPriority - b.roleCallPriority)
      .filter((role) => roles?.includes(role.roleName));
  }, [roles]);

  return { data: filteredRoles, isRoleType };
};

export const useRole = (roleId: number | undefined) => {
  let role;
  if (roleId === undefined) {
    role = undefined;
  }
  role = data.find((x) => x.roleName === roleId);
  if (role === undefined) {
    throw new Error(`No Role For Id: ${roleId}`);
  }
  return { data: role };
};

export const getColorForRoleType = (roleType: RoleType) => {
  switch (roleType) {
    case RoleType.Enemy:
      return "red";
    case RoleType.Special:
      return "green";
    case RoleType.Traditional:
      return "blue";
    default:
      return "lightgray";
  }
};

export const getRoleForRoleId = (roleId: number) => {
  const role = data.find((x) => x.roleName === roleId);
  if (role === undefined) {
    throw new Error(`No Role For Id: ${roleId}`);
  }
  return role;
};
