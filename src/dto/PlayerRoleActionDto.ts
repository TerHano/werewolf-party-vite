import { Role } from "@/enum/Role";
import { RoleActionDto } from "./RoleActionDto";
import { PlayerDto } from "./PlayerDto";

export interface PlayerRoleActionDto extends PlayerDto {
  role: Role;
  actions: RoleActionDto[];
  isAlive: boolean;
}
