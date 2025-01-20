import { RoleActionDto } from "@/dto/RoleActionDto";
import { useActionModalContext } from "@/hooks/useActionModalContext";
import { useRoleActionHelper } from "@/hooks/useRoleActionHelper";
import { Button, Flex, Group, Stack, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { DisabledActionsTooltip } from "./DisabledActionsTooltip";

export const ActionButtonList = ({
  playerId,
  actions,
}: {
  playerId?: string;
  actions?: RoleActionDto[];
}) => {
  const { t } = useTranslation();
  const { getActionButtonProps } = useRoleActionHelper();
  const { actionModalCallback } = useActionModalContext();

  return (
    <Stack>
      <Group>
        <Text fontSize="lg" textStyle="accent">
          {t("Choose a player to...")}
        </Text>
        <DisabledActionsTooltip actions={actions} />
      </Group>
      <Group justifyContent="center">
        {actions?.map((action) => {
          const props = getActionButtonProps(action.type);
          return (
            <Button
              minWidth="5rem"
              size="sm"
              disabled={!action.enabled}
              onClick={() => {
                actionModalCallback(action.type, playerId);
              }}
              colorPalette={props.color}
            >
              <Flex alignItems="center" justifyItems="space-between" gap={1}>
                {props.icon} {props.label}
              </Flex>
            </Button>
          );
        })}
      </Group>
    </Stack>
  );
};
