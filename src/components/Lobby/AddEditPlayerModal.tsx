import { useState } from "react";
import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { Field } from "../ui/field";
import { Float, IconButton, Input, Text, VStack } from "@chakra-ui/react";
import { AddEditPlayerDetailsDto } from "@/dto/AddEditPlayerDetailsDto";
import { Avatar } from "../ui/avatar";
import { IconPencil } from "@tabler/icons-react";
import { useForm, SubmitHandler } from "react-hook-form";

interface AddEditPlayerModalProps {
  isEdit?: boolean;
  submitCallback: (playerDetails: AddEditPlayerDetailsDto) => void;
}

type AddEditPlayerModalForm = {
  nickname: string;
  avatarIndex: number;
};

export const AddEditPlayerModal = ({
  isEdit = false,
  submitCallback,
}: AddEditPlayerModalProps) => {
  const { t } = useTranslation();
  const [isDialogOpen, setDialogOpen] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddEditPlayerModalForm>();
  const onSubmit: SubmitHandler<AddEditPlayerModalForm> = (data) =>
    submitCallback(data);
  return (
    <DialogRoot open={isDialogOpen}>
      <DialogBackdrop />
      {isEdit && (
        <DialogTrigger>
          <Button>{t("Edit Details")}</Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogCloseTrigger onClick={() => setDialogOpen(false)} />
        <DialogHeader>
          <DialogTitle>
            <Text textStyle="accent">
              {isEdit ? t("Update Details") : t("Who are you?")}
            </Text>
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <form id="player-details-form" onSubmit={handleSubmit(onSubmit)}>
            <VStack gap={2}>
              <Avatar shape="rounded" size="2xl">
                <Float placement="bottom-center">
                  <IconButton rounded="full" size="2xs">
                    <IconPencil />
                  </IconButton>
                </Float>
              </Avatar>
              <Field
                invalid={!!errors.nickname}
                errorText={errors.nickname?.message}
                helperText={
                  <Text fontSize="small">{t("How others will see you!")}</Text>
                }
                label={t("Nickname")}
              >
                <Input
                  {...register("nickname", {
                    maxLength: {
                      value: 10,
                      message: t("Nickname must be 3 - 10 characters"),
                    },
                    minLength: {
                      value: 3,
                      message: t("Nickname must be 3 - 10 characters"),
                    },
                  })}
                />
              </Field>
            </VStack>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button form="player-details-form" type="submit">
            {t("Join Room")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
