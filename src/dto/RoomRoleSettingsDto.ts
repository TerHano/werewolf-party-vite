import { NumberOfWerewolves } from "@/enum/NumberOfWerewolves";
import { Role } from "@/enum/Role";

export interface RoomRoleSettingsDto {
  id: number;
  roomId: string;
  werewolves: NumberOfWerewolves;
  selectedRoles: number[];
}
