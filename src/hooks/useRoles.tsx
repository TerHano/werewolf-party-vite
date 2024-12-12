import { RoleDto } from "@/dto/RoleDto";
import { Role } from "@/enum/Role";
import { RoleType } from "@/enum/RoleType";
import { useMemo } from "react";

export const useRoles = () => {
  const data = useMemo<RoleDto[]>(() => {
    return [
      {
        label: "Moderator",
        shortDescription: "Game Master",
        description:
          "The flow of the game lives and dies by the Moderator's hand. They are the sole player that knows the role of each player, and walks the rest of the players through day, night and death the following morning. It's their job to keep the game moving, so some Moderators opt for a 5 minute time limit during the day for everyone to decide who to kill off. They also are the one who calls for a vote when a nominee to be killed off has arisen. The Moderator may find it helpful to use the app to keep track of each role and who has been killed that night should there be a large quantity of players.",
        roleName: Role.Moderator,
        roleType: RoleType.Moderator,
        iconPath: getIconPath(Role.Moderator),
        colorIconPath: getIconPath(Role.Moderator, true),
        roleCallPriority: 0,
        showInModeratorRoleCall: false,
      },
      {
        label: "Werewolf",
        shortDescription: "Take over the Village",
        description:
          "The goal of the werewolves is to decide on one villager to secretly kill off during the night, while posing as villagers during the day so they're not killed off themselves.",
        roleName: Role.WereWolf,
        roleType: RoleType.Enemy,
        iconPath: getIconPath(Role.WereWolf),
        colorIconPath: getIconPath(Role.WereWolf, true),
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
        iconPath: getIconPath(Role.Doctor),
        colorIconPath: getIconPath(Role.Doctor, true),
        showInModeratorRoleCall: true,
        roleCallPriority: 2,
      },
      {
        label: "Detective",
        shortDescription: "Find the Werewolves",
        description:
          "When called awake by the Moderator, the Detective can point to any of their fellow players and the Moderator must nod yes or no as to whether or not they are indeed a Werewolf.",
        roleName: Role.Seer,
        roleType: RoleType.Traditional,
        iconPath: getIconPath(Role.Seer),
        colorIconPath: getIconPath(Role.Seer, true),
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
        iconPath: getIconPath(Role.Witch),
        colorIconPath: getIconPath(Role.Witch, true),
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
        iconPath: getIconPath(Role.Drunk),
        colorIconPath: getIconPath(Role.Drunk, true),
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
      //     iconPath: getIconPath(Role.Sherrif),
      //     colorIconPath: getIconPath(Role.Sherrif, true),
      // },
      {
        label: "Villager",
        shortDescription: "Defend The Village",
        description:
          "The most commonplace role, a simple Villager, spends the game trying to root out who they believe the werewolves (and other villagers) are.",
        roleName: Role.Villager,
        roleType: RoleType.Villager,
        iconPath: getIconPath(Role.Villager),
        colorIconPath: getIconPath(Role.Villager, true),
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
        iconPath: getIconPath(Role.Vigilante),
        colorIconPath: getIconPath(Role.Vigilante, true),
        showInModeratorRoleCall: true,
        roleCallPriority: 7,
      },
      {
        label: "Cursed",
        shortDescription: "Prove Your Innocence!",
        description:
          "The Cursed think they are regular villagers, but they were cursed with the mark of the wolf at birth and are seen as members of the wolfpack by the detective.",
        roleName: Role.Lycan,
        roleType: RoleType.Special,
        iconPath: getIconPath(Role.Lycan),
        colorIconPath: getIconPath(Role.Lycan, true),
        showInModeratorRoleCall: false,
        roleCallPriority: 8,
      },
    ];
  }, []);

  return data;
};

function getIconPath(role: Role, inColor?: boolean) {
  let iconPath = `/icons/roles/{role}-color.png`;
  let roleImgName = Role[role];
  return iconPath.replace("{role}", roleImgName.toLowerCase());
}
