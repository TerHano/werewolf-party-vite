export interface RoomRoleSettingsDto {
  id: number;
  roomId: string;
  numberOfWerewolves: number;
  selectedRoles: number[];
  showGameSummary: boolean;
  allowMultipleSelfHeals: boolean;
}
