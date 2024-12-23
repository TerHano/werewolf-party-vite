import {
  Card,
  Group,
  HStack,
  Image,
  Input,
  Separator,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Field } from "../ui/field";
import { Button } from "../ui/button";
import { IconArrowRight, IconUsersGroup } from "@tabler/icons-react";
import campIcon from "../../assets/icons/lobby-icon.png";
import { useCreateRoom } from "@/hooks/useCreateRoom";
import { useCheckRoom } from "@/hooks/useCheckRoom";
import { SubmitHandler, useForm } from "react-hook-form";
import { toaster } from "../ui/toaster";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

type CheckRoomForm = {
  roomId: string;
};

export const MainMenu = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    mutate: createNewRoom,
    isPending: isCreatingRoomPending,
    isSuccess: isCreatingRoomSuccess,
  } = useCreateRoom({
    onSuccess: async (newRoomId) => {
      navigate({ to: `/room/$roomId`, params: { roomId: newRoomId } });
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckRoomForm>();
  const onSubmit: SubmitHandler<CheckRoomForm> = (data) =>
    checkRoom({
      roomId: data.roomId,
    });
  const { mutate: checkRoom, isPending: isCheckingRoomPending } = useCheckRoom({
    onSuccess: async (doesExist, { roomId }) => {
      if (!doesExist) {
        toaster.create({
          type: "error",
          title: "Room Not Found",
          description: (
            <Text as="span">
              Room with ID:{" "}
              <Text as="span" fontWeight="bold">
                {roomId}
              </Text>{" "}
              not found. Please try again
            </Text>
          ),
        });
      } else {
        navigate({ to: `/room/$roomId`, params: { roomId } });
      }
    },
  });

  return (
    <Card.Root md={{ width: "50%" }} width="full" padding={3}>
      <Stack alignItems="center" gap={3}>
        <Stack alignItems="center" gap={0}>
          <Image width={150} src={campIcon} />
          <Text textStyle="accent" fontSize="2.5rem" fontWeight="bold">
            Werewolf Party
          </Text>
          <Text textStyle="accent" fontSize="medium" color="gray.300">
            {t("Cards for a party game full of lies, deceit, & accusations")}
          </Text>
          <Text textStyle="accent" fontSize="medium" color="gray.300">
            {t("Are you devious enough?")}
          </Text>
        </Stack>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Field
            invalid={!!errors.roomId}
            maxWidth={250}
            label="Join Room"
            helperText={
              <Text fontSize="x-small">
                {t("Enter your 5 character Room ID")}
              </Text>
            }
            errorText={<Text fontSize="x-small">{errors.roomId?.message}</Text>}
          >
            <Group attached>
              <Input
                {...register("roomId", {
                  required: {
                    value: true,
                    message: t("Please enter a Room ID"),
                  },
                  minLength: {
                    value: 5,
                    message: t("Room ID must be 5 characters"),
                  },
                  maxLength: 5,
                })}
                style={{ textTransform: "uppercase" }}
                maxLength={5}
                placeholder="(Ex: 38VF5)"
              />
              <Button loading={isCheckingRoomPending} type="submit" padding={0}>
                <IconArrowRight />
              </Button>
            </Group>
          </Field>
        </form>
        <HStack alignItems="center" w="full">
          <Separator variant="dashed" />
          <Text textStyle="accent" flexShrink="0">
            OR
          </Text>
          <Separator variant="dashed" />
        </HStack>
        <Button
          loading={isCreatingRoomPending || isCreatingRoomSuccess}
          onClick={() => {
            createNewRoom();
          }}
          size="sm"
        >
          {t("Create New Room")} <IconUsersGroup />
        </Button>
        <Text color="gray.500" textStyle="accent">
          {t("Developed By Terry Hanoman")}
        </Text>
      </Stack>
    </Card.Root>
  );
};
