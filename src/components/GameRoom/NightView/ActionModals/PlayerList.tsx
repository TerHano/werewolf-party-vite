import {
  Avatar,
  Badge,
  defineStyle,
  Float,
  SimpleGrid,
} from "@chakra-ui/react";
import { PlayerRoleWithDetails } from "../NightCall";

export interface PlayerListProps {
  players: PlayerRoleWithDetails[];
  selectedPlayer?: string;
  onPlayerSelect: (selectedPlayerId: string) => void;
}

export const PlayerList = ({
  players,
  selectedPlayer,
  onPlayerSelect,
}: PlayerListProps) => {
  const ringCss = defineStyle({
    outlineWidth: "2px",
    outlineColor: "blue.500",
    outlineOffset: "2px",
    outlineStyle: "solid",
  });
  return (
    <SimpleGrid columns={{ base: 2, xs: 3, sm: 5, md: 5 }} gap={5}>
      {players.map((player) => {
        return (
          <Avatar.Root
            variant="subtle"
            size="2xl"
            onClick={() => onPlayerSelect(player.id)}
            key={player.id}
            style={{ cursor: "pointer" }}
            css={selectedPlayer === player.id ? ringCss : undefined}
          >
            <Avatar.Image marginTop={1} src={player.roleInfo.imgSrc} />
            <Float>
              <Badge>{player.nickname}</Badge>
            </Float>
          </Avatar.Root>
        );
      })}
    </SimpleGrid>
  );
};
