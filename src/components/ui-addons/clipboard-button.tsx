import {
  IconButton,
  HStack,
  Clipboard as ChakraClipboard,
  IconButtonProps,
  Text,
} from "@chakra-ui/react";
import { IconClipboard, IconClipboardCheck } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

export interface ClipboardButtonProps {
  label: string;
  iconButton: IconButtonProps;
}

export const ClipboardButton = ({
  iconButton,
  label,
}: ClipboardButtonProps) => {
  const { t } = useTranslation();
  return (
    <ChakraClipboard.Root timeout={1000} value={window.location.href}>
      <ChakraClipboard.Trigger asChild>
        <ChakraClipboard.Indicator
          copied={
            <IconButton {...iconButton} colorPalette="green">
              <HStack p={3}>
                <Text>{t("Copied!")}</Text>
                <IconClipboardCheck />
              </HStack>
            </IconButton>
          }
        >
          <IconButton {...iconButton}>
            <HStack p={3}>
              <Text>{label}</Text>
              <IconClipboard />
            </HStack>
          </IconButton>
        </ChakraClipboard.Indicator>
      </ChakraClipboard.Trigger>
    </ChakraClipboard.Root>
  );
};
