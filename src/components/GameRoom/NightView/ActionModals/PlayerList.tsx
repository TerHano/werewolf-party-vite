import {
  Avatar,
  Badge,
  defineStyle,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { PlayerRoleWithDetails } from "../NightCall";
import { usePlayerAvatar } from "@/hooks/usePlayerAvatar";

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
  const { getAvatarImageSrcForIndex } = usePlayerAvatar();
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
          <Stack align="center" gap={1}>
            <Avatar.Root
              variant="subtle"
              borderRadius="xl"
              size="2xl"
              onClick={() => onPlayerSelect(player.id)}
              key={player.id}
              style={{ cursor: "pointer" }}
              css={selectedPlayer === player.id ? ringCss : undefined}
            >
              <Avatar.Image
                marginTop={1}
                src={getAvatarImageSrcForIndex(player.avatarIndex)}
              />
            </Avatar.Root>
            <Badge
              colorPalette={selectedPlayer === player.id ? "blue" : undefined}
            >
              {player.nickname}
            </Badge>
          </Stack>
        );
      })}
    </SimpleGrid>
  );
};
