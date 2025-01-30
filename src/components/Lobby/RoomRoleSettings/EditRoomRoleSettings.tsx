import {
  CheckboxGroup,
  Float,
  Group,
  Image,
  Separator,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import werewolfImg from "@/assets/icons/roles/werewolf-color.png";
import { CheckboxCard, CheckboxCardIndicator } from "../../ui/checkbox-card";
import { useRoles } from "@/hooks/useRoles";
import { RoleType } from "@/enum/RoleType";
import { SubmitHandler, useController, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect } from "react";
import { useRoomRoleSettings } from "@/hooks/useRoomRoleSettings";
import { useRoomId } from "@/hooks/useRoomId";
import { RoomRoleSettingsDto } from "@/dto/RoomRoleSettingsDto";
import { useUpdateRoomRoleSettings } from "@/hooks/useUpdateRoomRoleSettings";
import { Button } from "../../ui/button";
import { toaster } from "../../ui/toaster";
import { SegmentedControl } from "../../ui/segmented-control";
import { Field } from "../../ui/field";
import { RoleInformationDialog } from "@/components/Lobby/RoleInformationDialog";

interface EditRoomRoleSettingsForm {
  numberOfWerewolves: string;
  traditonalRoles: string[];
  specialRoles: string[];
}

export const EditRoomRoleSettings = ({
  roomRoleSettingsQuery,
  closeDrawerCallback,
}: {
  roomRoleSettingsQuery: ReturnType<typeof useRoomRoleSettings>;
  closeDrawerCallback: () => void;
}) => {
  const { t } = useTranslation();
  const roomId = useRoomId();
  const { mutate, isPending: isUpdatingSettings } = useUpdateRoomRoleSettings({
    onSuccess: async () => {
      toaster.create({
        title: t("Role Settings Updated"),
        //description: t("You are now the moderator!"),
        type: "success",
        duration: 1500,
      });
    },
  });
  const { data, isRoleType } = useRoles();
  const { data: savedRoleSettings, isLoading: isRoomRoleSettingsLoading } =
    roomRoleSettingsQuery;
  const { control, handleSubmit, setValue } =
    useForm<EditRoomRoleSettingsForm>();
  const onSubmit: SubmitHandler<EditRoomRoleSettingsForm> = useCallback(
    (data) => {
      if (!savedRoleSettings) {
        throw new Error("error");
      }
      const request: RoomRoleSettingsDto = {
        id: savedRoleSettings.id,
        roomId: roomId,
        numberOfWerewolves: parseInt(data.numberOfWerewolves),
        selectedRoles: [
          ...data.traditonalRoles.map((val) => parseInt(val)),
          ...data.specialRoles.map((val) => parseInt(val)),
        ],
      };
      void mutate(request, {
        onSuccess: () => {
          closeDrawerCallback();
        },
      });
    },
    [closeDrawerCallback, mutate, roomId, savedRoleSettings]
  );

  const traditonalRoles = data?.filter(
    (role) => role.roleType === RoleType.Traditional
  );
  const specialRoles = data?.filter(
    (role) => role.roleType === RoleType.Special
  );

  const werewolvesController = useController({
    control,
    name: "numberOfWerewolves",
    defaultValue: "1",
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
      setValue(
        "numberOfWerewolves",
        savedRoleSettings.numberOfWerewolves.toString()
      );
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
  }, [isRoleType, savedRoleSettings, setValue]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack w="full" gap={3}>
          <Group>
            <Field
              label={
                <Text textStyle="accent" fontWeight={600} fontSize="lg">
                  Number of Werewolves
                </Text>
              }
            >
              <SegmentedControl
                name={werewolvesController.field.name}
                value={werewolvesController.field.value}
                onChange={werewolvesController.field.onChange}
                size="lg"
                defaultValue="1"
                items={["1", "2", "3", "4"]}
              />
            </Field>
            <Image src={werewolfImg} alt="werewolf" w="64px" />
          </Group>
          {/* <RadioCardRoot
          variant="surface"
          name={werewolvesController.field.name}
          value={werewolvesController.field.value}
          onChange={werewolvesController.field.onChange}
          orientation="vertical"
          align="center"
        >
          <Text textStyle="accent" fontWeight={600} fontSize="lg">
            Number of Werewolves
          </Text>
          <Skeleton
            w="full"
            loading={isRoomRoleSettingsLoading}
            minH={isRoomRoleSettingsLoading ? "100px" : undefined}
          >
            <HStack align="stretch">
              <RadioCardItem
                icon={
                  <img
                    src={werewolfImg}
                    alt="werewolf"
                    width="46"
                    height="46"
                  />
                }
                indicator={
                  <Float placement="top-end" offset="1em">
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
                  <Float placement="top-end" offset="1em">
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
          </Skeleton>
        </RadioCardRoot> */}

          <Separator />

          <CheckboxGroup
            name={traditonalRolesController.field.name}
            value={traditonalRolesController.field.value}
            onValueChange={traditonalRolesController.field.onChange}
          >
            <Group>
              <Text textStyle="accent" fontWeight={600} fontSize="lg">
                Traditional Roles
              </Text>
              <RoleInformationDialog roles={traditonalRoles} />
            </Group>
            <Skeleton
              w="full"
              loading={isRoomRoleSettingsLoading}
              minH={isRoomRoleSettingsLoading ? "100px" : undefined}
            >
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
                        width="36"
                        height="36"
                      />
                    }
                    label={
                      <Text fontSize="lg" fontWeight="bold" textStyle="accent">
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
            </Skeleton>
          </CheckboxGroup>

          <Separator />
          <CheckboxGroup
            name={specialRolesController.field.name}
            value={specialRolesController.field.value}
            onValueChange={specialRolesController.field.onChange}
          >
            <Group>
              <Text textStyle="accent" fontWeight={600} fontSize="lg">
                Special Roles
              </Text>{" "}
              <RoleInformationDialog roles={specialRoles} />
            </Group>
            <Skeleton
              w="full"
              loading={isRoomRoleSettingsLoading}
              minH={isRoomRoleSettingsLoading ? "100px" : undefined}
            >
              <SimpleGrid
                columns={{ base: 2, xs: 3, sm: 4, md: 5, lg: 8 }}
                gap="2"
              >
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
            </Skeleton>
          </CheckboxGroup>
          <Button mb={6} mt={3} loading={isUpdatingSettings} type="submit">
            {t("Update Settings")}
          </Button>
        </Stack>
      </form>
    </>
  );
};
