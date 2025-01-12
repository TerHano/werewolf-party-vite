import { useRef, useState } from "react";
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
import {
  Avatar,
  defineStyle,
  Float,
  HStack,
  IconButton,
  Input,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { AddEditPlayerDetailsDto } from "@/dto/AddEditPlayerDetailsDto";
import { IconPencil, IconUser } from "@tabler/icons-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { usePlayerAvatar } from "@/hooks/usePlayerAvatar";

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

  const { data: avatarNames, getAvatarImageSrcForIndex } = usePlayerAvatar();

  const [isDialogOpen, setDialogOpen] = useState(true);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<AddEditPlayerModalForm>({
    defaultValues: {
      nickname: "",
      avatarIndex: getRandomInt(0, avatarNames.length),
    },
  });

  const watchAvatarIndex = watch("avatarIndex");

  const onSubmit: SubmitHandler<AddEditPlayerModalForm> = (data) =>
    submitCallback(data);
  const focusRef = useRef<HTMLInputElement | null>(null);
  const { ref, ...nicknameField } = register("nickname", {
    required: { value: true, message: t("Nickname is required") },
    maxLength: {
      value: 10,
      message: t("Nickname must be 3 - 10 characters"),
    },
    minLength: {
      value: 3,
      message: t("Nickname must be 3 - 10 characters"),
    },
  });

  const ringCss = defineStyle({
    outlineWidth: "2px",
    outlineColor: "blue.500",
    outlineOffset: "2px",
    outlineStyle: "solid",
    backgroundColor: "blue.800/50",
  });
  return (
    <>
      <DialogRoot
        closeOnEscape={isEdit}
        closeOnInteractOutside={isEdit}
        initialFocusEl={() => focusRef.current}
        open={isDialogOpen}
      >
        <DialogBackdrop />
        {isEdit && (
          <DialogTrigger>
            <Button>{t("Edit Details")}</Button>
          </DialogTrigger>
        )}
        <DialogContent>
          {isEdit ? (
            <DialogCloseTrigger onClick={() => setDialogOpen(false)} />
          ) : null}
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
                {/* <EnhancedAvatar
                
                  shape="rounded"
                  size="2xl"
                  src={getAvatarImageSrcForIndex(selectedAvatarIndex)}
                >
                
                </EnhancedAvatar> */}
                <Avatar.Root
                  variant="subtle"
                  size="2xl"
                  onClick={() => {
                    setDrawerOpen(true);
                  }}
                  style={{ cursor: "pointer" }}
                  css={{
                    outlineWidth: "2px",
                    outlineColor: "white.500",
                    outlineOffset: "2px",
                    outlineStyle: "solid",
                    backgroundColor: "gray.1000",
                  }}
                >
                  <Avatar.Image
                    marginTop={1}
                    src={getAvatarImageSrcForIndex(watchAvatarIndex)}
                  />

                  <Float placement="bottom-center">
                    <IconButton rounded="full" size="2xs">
                      <IconPencil />
                    </IconButton>
                  </Float>
                </Avatar.Root>
                <Field
                  invalid={!!errors.nickname}
                  errorText={errors.nickname?.message}
                  helperText={
                    <Text fontSize="small">
                      {t("How others will see you!")}
                    </Text>
                  }
                  label={t("Nickname")}
                >
                  <Input
                    {...nicknameField}
                    ref={(e) => {
                      ref(e);
                      focusRef.current = e;
                    }}
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
      <DialogRoot
        scrollBehavior="inside"
        size="cover"
        open={isDrawerOpen}
        onOpenChange={(e) => {
          setDrawerOpen(e.open);
        }}
      >
        <DialogBackdrop />
        <DialogContent borderRadius="sm">
          <DialogHeader>
            <HStack gap={1}>
              <IconUser size={18} />
              <Text fontWeight={500} fontSize="lg">
                Pick A Avatar
              </Text>
            </HStack>
          </DialogHeader>
          <DialogBody>
            <SimpleGrid columns={{ base: 2, xs: 3, sm: 5, md: 5 }} gap={5}>
              {avatarNames.map((avatarName, index) => {
                return (
                  <Avatar.Root
                    variant="subtle"
                    css={watchAvatarIndex === index ? ringCss : undefined}
                    size="2xl"
                    key={avatarName}
                    onClick={() => {
                      setValue("avatarIndex", index);
                      setDrawerOpen(false);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <Avatar.Image
                      marginTop={1}
                      src={getAvatarImageSrcForIndex(index)}
                    />
                    <Avatar.Fallback>SA</Avatar.Fallback>
                  </Avatar.Root>
                );
              })}
            </SimpleGrid>
          </DialogBody>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
    </>
  );
};

function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}
