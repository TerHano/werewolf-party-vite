import { useModerator } from "@/hooks/useModerator";
import { usePlayers } from "@/hooks/usePlayers";
import { PlayerCard } from "./PlayerCard";
import {
  Card,
  HStack,
  Image,
  Separator,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { useCurrentPlayer } from "@/hooks/useCurrentPlayer";
import { RoomRoleSettingsCard } from "./RoomRoleSettingsCard";
import { EmptyState } from "../ui/empty-state";
import { useTranslation } from "react-i18next";
import { IconPlayCardStar } from "@tabler/icons-react";

export const Lobby = ({ roomId }: { roomId: string }) => {
  const { t } = useTranslation();
  const { data: moderator, isLoading: isModeratorLoading } =
    useModerator(roomId);
  const { data: players } = usePlayers(roomId);
  const { data: currentPlayer } = useCurrentPlayer(roomId);
  return (
    <Stack w="full" gap={2}>
      <PlayerCard
        player={moderator}
        isModerator
        isCurrentPlayer={moderator?.id === currentPlayer?.id}
      />
      <RoomRoleSettingsCard />
      <Separator my={3} />
      <VStack gap={3}>
        {players && players.length > 0 ? (
          players?.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              isCurrentPlayer={player.id === currentPlayer?.id}
            />
          ))
        ) : (
          <Card.Root w="full">
            <EmptyState
              icon={<IconPlayCardStar />}
              title={t("Invite Some Friends!")}
            />
          </Card.Root>
        )}
      </VStack>
    </Stack>
  );
};
