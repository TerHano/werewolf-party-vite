import { Role } from "@/enum/Role";
import {
  CheckboxGroup,
  Float,
  HStack,
  RadioCardItemIndicator,
  Separator,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { RadioCardItem, RadioCardRoot } from "../ui/radio-card";
import werewolfImg from "@/assets/icons/roles/werewolf-color.png";
import { CheckboxCard, CheckboxCardIndicator } from "../ui/checkbox-card";
import { useRoles } from "@/hooks/useRoles";
import { RoleType } from "@/enum/RoleType";
import { set, SubmitHandler, useController, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import { useRoomRoleSettings } from "@/hooks/useRoomRoleSettings";
import { useRoomId } from "@/hooks/useRoomId";
import { RoomRoleSettingsDto } from "@/dto/RoomRoleSettingsDto";
import { useUpdateRoomRoleSettings } from "@/hooks/useUpdateRoomRoleSettings";
import { Button } from "../ui/button";

interface EditRoomRoleSettingsForm {
  //roomId: string;
  werewolves: string;
  traditonalRoles: string[];
  specialRoles: string[];
}

export const EditRoomRoleSettings = ({
  closeDrawerCallback,
}: {
  closeDrawerCallback: () => void;
}) => {
  const { t } = useTranslation();
  const roomId = useRoomId();
  const { mutate, isPending: isUpdatingSettings } = useUpdateRoomRoleSettings();
  const { data, isRoleType } = useRoles();
  const { data: savedRoleSettings, isLoading } = useRoomRoleSettings(roomId);
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EditRoomRoleSettingsForm>();
  const onSubmit: SubmitHandler<EditRoomRoleSettingsForm> = useCallback(
    (data) => {
      const request: RoomRoleSettingsDto = {
        id: savedRoleSettings?.id!,
        roomId: roomId,
        werewolves: parseInt(data.werewolves),
        selectedRoles: [
          ...data.traditonalRoles.map((val) => parseInt(val)),
          ...data.specialRoles.map((val) => parseInt(val)),
        ],
      };
      console.log(request);
      void mutate(request, {
        onSuccess: () => {
          closeDrawerCallback();
        },
      });
    },
    [savedRoleSettings]
  );

  const traditonalRoles = data?.filter(
    (role) => role.roleType === RoleType.Traditional
  );
  const specialRoles = data?.filter(
    (role) => role.roleType === RoleType.Special
  );

  const werewolvesController = useController({
    control,
    name: "werewolves",
    defaultValue: "2",
  });

  const traditonalRolesController = useController({
    control,
    name: "traditonalRoles",
    defaultValue: [],
  });

  const specialRolesController = useController({
    control,
    name: "specialRoles",
    defaultValue: [],
  });

  useEffect(() => {
    if (savedRoleSettings) {
      setValue("werewolves", savedRoleSettings.werewolves.toString());
      const savedTraditonalRoles = savedRoleSettings.selectedRoles.filter(
        (role) => isRoleType(role, RoleType.Traditional)
      );
      const savedSpecialRoles = savedRoleSettings.selectedRoles.filter((role) =>
        isRoleType(role, RoleType.Special)
      );
      setValue(
        "traditonalRoles",
        savedTraditonalRoles.map((role) => role.toString())
      );
      setValue(
        "specialRoles",
        savedSpecialRoles.map((role) => role.toString())
      );
    }
  }, [savedRoleSettings]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack w="full" mb={2} gap={3}>
        <RadioCardRoot
          name={werewolvesController.field.name}
          value={werewolvesController.field.value}
          onChange={werewolvesController.field.onChange}
          orientation="vertical"
          align="center"
        >
          <Text textStyle="accent" fontSize="lg">
            Number of Werewolves
          </Text>
          <HStack align="stretch">
            <RadioCardItem
              icon={
                <img src={werewolfImg} alt="werewolf" width="46" height="46" />
              }
              indicator={
                <Float placement="top-end" offset="6">
                  <RadioCardItemIndicator w="1rem" h="1rem" />
                </Float>
              }
              key="werewolves-1"
              value={"1"}
              label={
                <Text fontSize="lg" fontWeight="bold" textStyle="accent">
                  {t("One Werewolf")}
                </Text>
              }
            />
            <RadioCardItem
              icon={
                <HStack gap={-6}>
                  <img
                    src={werewolfImg}
                    alt="werewolf"
                    width="46"
                    height="46"
                  />
                  <img
                    src={werewolfImg}
                    alt="werewolf"
                    width="46"
                    height="46"
                  />
                </HStack>
              }
              indicator={
                <Float placement="top-end" offset="6">
                  <RadioCardItemIndicator w="1rem" h="1rem" />
                </Float>
              }
              key="werewolves-2"
              value={"2"}
              label={
                <Text fontSize="lg" fontWeight="bold" textStyle="accent">
                  {t("Two Werewolves")}
                </Text>
              }
            />
          </HStack>
        </RadioCardRoot>
        <Separator />

        <CheckboxGroup
          name={traditonalRolesController.field.name}
          value={traditonalRolesController.field.value}
          onValueChange={traditonalRolesController.field.onChange}
        >
          <Text textStyle="accent" fontSize="lg">
            Traditional Roles
          </Text>

          <SimpleGrid columns={{ base: 2, sm: 3, md: 5, lg: 8 }} gap="2">
            {traditonalRoles.map((role) => (
              <CheckboxCard
                variant="surface"
                align="center"
                key={role.label}
                icon={
                  <img
                    src={role.imgSrc}
                    alt={role.label}
                    width="46"
                    height="46"
                  />
                }
                label={
                  <Text fontSize="lg" fontWeight="bold" textStyle="accent">
                    {role.label}
                  </Text>
                }
                indicator={
                  <Float placement="top-end" offset="6">
                    <CheckboxCardIndicator w="1rem" h="1rem" />
                  </Float>
                }
                value={role.roleName.toString()}
              />
            ))}
          </SimpleGrid>
        </CheckboxGroup>

        <Separator />
        <CheckboxGroup
          name={specialRolesController.field.name}
          value={specialRolesController.field.value}
          onValueChange={specialRolesController.field.onChange}
        >
          <Text textStyle="accent" fontSize="lg">
            Special Roles
          </Text>
          <SimpleGrid columns={{ base: 2, sm: 3, md: 5, lg: 8 }} gap="2">
            {specialRoles.map((role) => (
              <CheckboxCard
                variant="surface"
                align="center"
                key={role.label}
                icon={
                  <img
                    src={role.imgSrc}
                    alt={role.label}
                    width="46"
                    height="46"
                  />
                }
                indicator={
                  <Float placement="top-end" offset="6">
                    <CheckboxCardIndicator w="1rem" h="1rem" />
                  </Float>
                }
                label={
                  <Text fontSize="lg" fontWeight="bold" textStyle="accent">
                    {role.label}
                  </Text>
                }
                value={role.roleName.toString()}
              />
            ))}
          </SimpleGrid>
        </CheckboxGroup>
        <Button loading={isUpdatingSettings} type="submit">
          {t("Update Settings")}
        </Button>
      </Stack>
    </form>
  );
};
