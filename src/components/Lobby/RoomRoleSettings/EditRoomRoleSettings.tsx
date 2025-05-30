import {
  CheckboxGroup,
  Field as ChakraField,
  Float,
  Group,
  Image,
  Separator,
  SimpleGrid,
  Stack,
  Tabs,
  Text,
  DrawerFooter,
  HStack,
  Badge,
  useDrawer,
  DrawerRootProvider,
} from "@chakra-ui/react";
import werewolfImg from "@/assets/icons/roles/werewolf-color.png";
import { CheckboxCard, CheckboxCardIndicator } from "../../ui/checkbox-card";
import { useRoles } from "@/hooks/useRoles";
import { RoleType } from "@/enum/RoleType";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import { useRoomRoleSettings } from "@/hooks/useRoomRoleSettings";
import { useRoomId } from "@/hooks/useRoomId";
import { RoomRoleSettingsDto } from "@/dto/RoomRoleSettingsDto";
import { useUpdateRoomRoleSettings } from "@/hooks/useUpdateRoomRoleSettings";
import { Button } from "../../ui/button";
import { SegmentedControl } from "../../ui/segmented-control";
import { RoleInformationDialog } from "@/components/Lobby/RoleInformationDialog";
import { Switch } from "@/components/ui/switch";
import { Field } from "@/components/ui/field";
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { IconCards, IconSettings } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui-addons/skeleton";
import { useToaster } from "@/hooks/ui/useToaster";
import { DrawerPlacementForMobileDesktop } from "@/util/drawer";

interface EditRoomRoleSettingsForm {
  numberOfWerewolves: string;
  traditonalRoles: string[];
  specialRoles: string[];
  showGameSummary: boolean;
  allowMultipleSelfHeals: boolean;
}

export const EditRoomRoleSettings = ({
  roomRoleSettingsQuery,
}: {
  roomRoleSettingsQuery: ReturnType<typeof useRoomRoleSettings>;
}) => {
  const { t } = useTranslation();
  const { showToast } = useToaster();
  const roomId = useRoomId();
  const drawer = useDrawer({ closeOnInteractOutside: false });
  const { mutate, isPending: isUpdatingSettings } = useUpdateRoomRoleSettings({
    onSuccess: async () => {
      showToast({
        title: t("Role Settings Updated"),
        // description: t("Your new roles and game settings have been saved!"),
        withDismissButton: true,
        type: "success",
        duration: 2500,
      });
    },
  });
  const { data, isRoleType } = useRoles();
  const { data: savedRoleSettings, isLoading: isRoomRoleSettingsLoading } =
    roomRoleSettingsQuery;
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty: isFormDirty },
  } = useForm<EditRoomRoleSettingsForm>();
  const onSubmit: SubmitHandler<EditRoomRoleSettingsForm> = useCallback(
    (data) => {
      if (!savedRoleSettings) {
        throw new Error("error");
      }
      console.log(data);
      const request: RoomRoleSettingsDto = {
        id: savedRoleSettings.id,
        roomId: roomId,
        numberOfWerewolves: parseInt(data.numberOfWerewolves),
        selectedRoles: [
          ...data.traditonalRoles.map((val) => parseInt(val)),
          ...data.specialRoles.map((val) => parseInt(val)),
        ],
        showGameSummary: data.showGameSummary,
        allowMultipleSelfHeals: data.allowMultipleSelfHeals,
      };
      void mutate(request, {
        onSuccess: () => {
          drawer.setOpen(false);
          reset(data);
        },
      });
    },
    [drawer, mutate, reset, roomId, savedRoleSettings]
  );

  const traditonalRoles = data.filter(
    (role) => role.roleType === RoleType.Traditional
  );
  const specialRoles = data.filter(
    (role) => role.roleType === RoleType.Special
  );

  return (
    <DrawerRootProvider
      value={drawer}
      onExitComplete={() => reset()}
      size={{ base: "full", md: "md" }}
      placement={DrawerPlacementForMobileDesktop}
    >
      <DrawerBackdrop />
      <DrawerTrigger asChild>
        <Button size="sm" w="full" variant="subtle" colorPalette="blue">
          <IconSettings /> {t("Edit Settings")}
        </Button>
      </DrawerTrigger>
      <form>
        <DrawerContent>
          <DrawerCloseTrigger />

          <DrawerHeader>
            <HStack gap={1}>
              <IconCards size={18} />
              <Text fontWeight={500} fontSize="lg">
                {t("Role Settings")}
              </Text>
            </HStack>
          </DrawerHeader>
          <DrawerBody>
            <Tabs.Root fitted defaultValue="roles">
              <Tabs.List>
                <Tabs.Trigger value="roles">{t("Roles")}</Tabs.Trigger>
                <Tabs.Trigger value="settings">{t("Settings")}</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content
                _open={{
                  animationName: "fade-in-from-bottom",
                  animationDuration: "500ms",
                }}
                value="roles"
              >
                <Stack w="full" gap={3}>
                  <Group>
                    <Field
                      label={
                        <Text textStyle="accent" fontWeight={600} fontSize="lg">
                          {t("Number of Werewolves")}
                        </Text>
                      }
                    >
                      <Skeleton height={10} loading={isRoomRoleSettingsLoading}>
                        <Controller
                          name="numberOfWerewolves"
                          control={control}
                          defaultValue={savedRoleSettings?.numberOfWerewolves.toString()}
                          render={({ field }) => (
                            <SegmentedControl
                              name={field.name}
                              value={field.value}
                              onChange={field.onChange}
                              size="lg"
                              items={["1", "2", "3", "4"]}
                            />
                          )}
                        />
                      </Skeleton>
                    </Field>
                    <Image src={werewolfImg} alt="werewolf" w="64px" />
                  </Group>

                  <Separator flex="1" />
                  <Skeleton height="6rem" loading={isRoomRoleSettingsLoading}>
                    <Controller
                      name="traditonalRoles"
                      control={control}
                      defaultValue={savedRoleSettings?.selectedRoles
                        .filter((role) =>
                          isRoleType(role, RoleType.Traditional)
                        )
                        .map((role) => role.toString())}
                      render={({ field }) => (
                        <CheckboxGroup
                          name={field.name}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <Group>
                            <Text
                              textStyle="accent"
                              fontWeight={600}
                              fontSize="lg"
                            >
                              {t("Traditional Roles")}
                            </Text>
                            <RoleInformationDialog roles={traditonalRoles} />
                          </Group>

                          <SimpleGrid columns={{ base: 3, md: 4 }} gap="2">
                            {traditonalRoles.map((role) => (
                              <CheckboxCard
                                variant="surface"
                                align="center"
                                key={role.label}
                                icon={
                                  <img
                                    src={role.imgSrc}
                                    alt={role.label}
                                    width="36"
                                    height="36"
                                  />
                                }
                                label={
                                  <Text
                                    fontSize="lg"
                                    fontWeight="bold"
                                    textStyle="accent"
                                  >
                                    {role.label}
                                  </Text>
                                }
                                indicator={
                                  <Float placement="top-end" offset="1em">
                                    <CheckboxCardIndicator w="1rem" h="1rem" />
                                  </Float>
                                }
                                value={role.roleName.toString()}
                              />
                            ))}
                          </SimpleGrid>
                        </CheckboxGroup>
                      )}
                    />
                  </Skeleton>

                  <Separator flex="1" />
                  <Skeleton height="6rem" loading={isRoomRoleSettingsLoading}>
                    <Controller
                      name="specialRoles"
                      control={control}
                      defaultValue={savedRoleSettings?.selectedRoles
                        .filter((role) => isRoleType(role, RoleType.Special))
                        .map((role) => role.toString())}
                      render={({ field }) => (
                        <CheckboxGroup
                          name={field.name}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <Group>
                            <Text
                              textStyle="accent"
                              fontWeight={600}
                              fontSize="lg"
                            >
                              {t("Special Roles")}
                            </Text>
                            <RoleInformationDialog roles={specialRoles} />
                          </Group>
                          <Skeleton
                            w="full"
                            loading={isRoomRoleSettingsLoading}
                            minH={
                              isRoomRoleSettingsLoading ? "100px" : undefined
                            }
                          >
                            <SimpleGrid columns={{ base: 3, md: 4 }} gap="2">
                              {specialRoles.map((role) => (
                                <CheckboxCard
                                  variant="surface"
                                  align="center"
                                  key={role.label}
                                  icon={
                                    <img
                                      src={role.imgSrc}
                                      alt={role.label}
                                      width="36"
                                      height="36"
                                    />
                                  }
                                  indicator={
                                    <Float placement="top-end" offset="1em">
                                      <CheckboxCardIndicator
                                        w="1rem"
                                        h="1rem"
                                      />
                                    </Float>
                                  }
                                  label={
                                    <Text
                                      fontSize="lg"
                                      fontWeight="bold"
                                      textStyle="accent"
                                    >
                                      {role.label}
                                    </Text>
                                  }
                                  value={role.roleName.toString()}
                                />
                              ))}
                            </SimpleGrid>
                          </Skeleton>
                        </CheckboxGroup>
                      )}
                    />
                  </Skeleton>
                </Stack>
              </Tabs.Content>
              <Tabs.Content
                _open={{
                  animationName: "fade-in-from-bottom",
                  animationDuration: "500ms",
                }}
                value="settings"
              >
                <Stack gap={4}>
                  <ChakraField.Root>
                    <ChakraField.Label>
                      <Text>{t("Show Game Summary")}</Text>
                    </ChakraField.Label>
                    <Skeleton
                      height={6}
                      width={12}
                      loading={isRoomRoleSettingsLoading}
                    >
                      <Controller
                        name="showGameSummary"
                        control={control}
                        defaultValue={savedRoleSettings?.showGameSummary}
                        render={({ field }) => (
                          <Switch
                            size="lg"
                            name={field.name}
                            checked={field.value}
                            onCheckedChange={({ checked }) =>
                              field.onChange(checked)
                            }
                            inputProps={{ onBlur: field.onBlur }}
                          />
                        )}
                      />
                    </Skeleton>
                    <ChakraField.HelperText>
                      {t(
                        "Toggles whether or not to show the game summary to players once the game is done"
                      )}
                    </ChakraField.HelperText>
                  </ChakraField.Root>
                  <ChakraField.Root>
                    <ChakraField.Label>
                      <Text>{t("Allow Continuous Self Heals")} </Text>
                      <Badge size="xs" colorPalette="yellow" variant="subtle">
                        {t("Coming Soon")}
                      </Badge>
                    </ChakraField.Label>
                    <Skeleton
                      height={6}
                      width={12}
                      loading={isRoomRoleSettingsLoading}
                    >
                      <Controller
                        name="allowMultipleSelfHeals"
                        control={control}
                        render={({ field }) => (
                          <Switch
                            size="lg"
                            disabled
                            name={field.name}
                            checked={field.value}
                            onCheckedChange={({ checked }) =>
                              field.onChange(checked)
                            }
                            inputProps={{ onBlur: field.onBlur }}
                          />
                        )}
                      />
                    </Skeleton>
                    <ChakraField.HelperText>
                      {t("Restricts how often a healer can heal themselves")}
                    </ChakraField.HelperText>
                  </ChakraField.Root>
                </Stack>
              </Tabs.Content>
            </Tabs.Root>
          </DrawerBody>
          <DrawerFooter>
            <Button
              disabled={!isFormDirty}
              w="full"
              onClick={handleSubmit(onSubmit)}
              loading={isUpdatingSettings}
              type="submit"
            >
              {t("Update Settings")}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </DrawerRootProvider>
  );
};

export default EditRoomRoleSettings;
