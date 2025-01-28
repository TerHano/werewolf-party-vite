import { useAnimationReset } from "@/hooks/useAnimationReset";
import { useTranslation } from "react-i18next";
import { Group, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { IconEyeClosed, IconEye } from "@tabler/icons-react";

export const PlayerActionCardHeader = ({
  roleLabel,
  isActionQueued,
}: {
  roleLabel: string;
  isActionQueued: boolean;
}) => {
  const { t } = useTranslation();
  const { animation, resetAnimation } = useAnimationReset();
  useEffect(() => {
    resetAnimation();
  }, [isActionQueued, resetAnimation]);
  return (
    <Text
      className="animate-fade-in-from-bottom"
      fontSize="xl"
      textStyle="accent"
      animation={animation}
    >
      {isActionQueued ? (
        <Group>
          <Text>{t(`${roleLabel}, Close Your Eyes!`)}</Text>
          <IconEyeClosed />
        </Group>
      ) : (
        <Group>
          <Text>{t(`Wake Up, ${roleLabel}!`)}</Text>
          <IconEye />
        </Group>
      )}
    </Text>
  );
};
