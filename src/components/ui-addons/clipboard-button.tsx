import {
  IconButton,
  HStack,
  Clipboard as ChakraClipboard,
  IconButtonProps,
  Text,
  ButtonProps,
  Button,
} from "@chakra-ui/react";
import { IconClipboard, IconClipboardCheck } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

export interface ClipboardIconButtonProps {
  label: string;
  value: string;
  iconButton: IconButtonProps;
}

export interface ClipboardButtonProps {
  children: React.ReactNode;
  value: string;
  button?: ButtonProps;
}

export const ClipboardIconButton = ({
  iconButton,
  value,
  label,
}: ClipboardIconButtonProps) => {
  const { t } = useTranslation();
  return (
    <ChakraClipboard.Root timeout={1000} value={value}>
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

export const ClipboardButton = ({
  button,
  children,
  value,
}: ClipboardButtonProps) => {
  const { t } = useTranslation();
  return (
    <ChakraClipboard.Root timeout={1000} value={value}>
      <ChakraClipboard.Trigger asChild>
        <ChakraClipboard.Indicator
          copied={
            <Button {...button} colorPalette="green">
              <HStack p={3}>
                <Text>{t("Copied!")}</Text>
                <IconClipboardCheck />
              </HStack>
            </Button>
          }
        >
          <Button {...button}>{children}</Button>
        </ChakraClipboard.Indicator>
      </ChakraClipboard.Trigger>
    </ChakraClipboard.Root>
  );
};
