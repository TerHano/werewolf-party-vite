import { VStack, Image, Badge, Stack } from "@chakra-ui/react";
import { IconSkull, IconUser } from "@tabler/icons-react";
import { PlayerRoleWithDetails } from "../NightCall";
import { SkeletonCircle } from "@/components/ui/skeleton";

export const PlayerActionCardBody = ({
  playerDetails,
}: {
  playerDetails: PlayerRoleWithDetails[];
}) => {
  const roleImg = playerDetails[0]?.roleInfo.imgSrc;

  return (
    <VStack
      animationDelay="moderate"
      className="animate-fade-in-from-bottom"
      gap={1}
    >
      <SkeletonCircle loading={!roleImg} size="8rem">
        <Image src={roleImg} />
      </SkeletonCircle>
      <Stack direction="row" gap={1}>
        {playerDetails.map((playerDetail) =>
          !playerDetail.isAlive ? (
            <Badge colorPalette="red">
              <IconSkull size={12} />
              {playerDetail.nickname}
            </Badge>
          ) : (
            <Badge colorPalette="current">
              <IconUser size={12} />
              {playerDetail.nickname}
            </Badge>
          )
        )}
      </Stack>
    </VStack>
  );
};
