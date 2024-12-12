import { Role } from "@/enum/Role";
import { RoleType } from "@/enum/RoleType";

export interface RoleDto {
  label: string;
  shortDescription: string;
  description: string;
  roleName: Role;
  roleType: RoleType;
  iconPath: string;
  colorIconPath: string;
  showInModeratorRoleCall: boolean;
  roleCallPriority: number;
}
