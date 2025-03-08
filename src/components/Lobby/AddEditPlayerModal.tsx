import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { Field } from "../ui/field";
import {
  Alert,
  DialogRootProvider,
  Input,
  Skeleton,
  Text,
  useDialog,
  VStack,
} from "@chakra-ui/react";
import { AddEditPlayerDetailsDto } from "@/dto/AddEditPlayerDetailsDto";
import { IconPencil } from "@tabler/icons-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { usePlayerAvatar } from "@/hooks/usePlayerAvatar";
import { useCurrentPlayer } from "@/hooks/useCurrentPlayer";
import { useRoomId } from "@/hooks/useRoomId";
import { useGameState } from "@/hooks/useGameState";
import { GameState } from "@/enum/GameState";
import { useToaster } from "@/hooks/ui/useToaster";
import { SkeletonCircle, SkeletonComposed } from "../ui-addons/skeleton";

const AvatarScrollPicker = lazy(
  () => import("@/components/Lobby/AvatarScrollPicker")
);

interface AddEditPlayerModalProps {
  isEdit?: boolean;
  submitCallback: (playerDetails: AddEditPlayerDetailsDto) => Promise<void>;
}

type AddEditPlayerModalForm = {
  nickname: string;
  avatarIndex: number;
};

const alphaNumericalPattern = /^[a-zA-Z0-9]*$/;

export const AddEditPlayerModal = ({
  isEdit = false,
  submitCallback,
}: AddEditPlayerModalProps) => {
  const roomId = useRoomId();
  const { showToast } = useToaster();
  const { t } = useTranslation();
  const { data: currentPlayer, isFetching: isCurrentPlayerLoading } =
    useCurrentPlayer(roomId, { enabled: isEdit });
  const { data: gameState } = useGameState(roomId);

  const { data: avatarNames } = usePlayerAvatar();

  const [isSubmitLoading, setSubmitLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AddEditPlayerModalForm>({
    defaultValues: {
      nickname: "",
      avatarIndex: getRandomInt(0, avatarNames.length),
    },
  });

  const dialog = useDialog({
    defaultOpen: !isEdit,
    closeOnEscape: isEdit,
    closeOnInteractOutside: false,
    initialFocusEl: () => focusRef.current,
  });

  const onSubmit: SubmitHandler<AddEditPlayerModalForm> = (data) => {
    setSubmitLoading(true);
    submitCallback({ ...data, roomId }).finally(() => {
      dialog.setOpen(false);
      setSubmitLoading(false);
      if (isEdit) {
        showToast({
          type: "success",
          title: t("Player Details Updated"),
          withDismissButton: true,
        });
      }
    });
  };
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
    validate: (val) => {
      if (!alphaNumericalPattern.test(val)) {
        return t("Nickname can only contains letters/numbers");
      }
    },
  });

  useEffect(() => {
    if (currentPlayer) {
      setValue("nickname", currentPlayer.nickname);
      setValue("avatarIndex", currentPlayer.avatarIndex);
    }
  }, [currentPlayer, setValue]);

  return (
    <>
      <DialogRootProvider size="xs" value={dialog}>
        <DialogBackdrop />
        {isEdit && (
          <DialogTrigger>
            <Button size="2xs" variant="outline">
              {t("Edit Name")} <IconPencil />
            </Button>
          </DialogTrigger>
        )}
        <DialogContent>
          {isEdit ? <DialogCloseTrigger /> : null}
          <DialogHeader>
            <DialogTitle>
              <Text textStyle="accent">
                {isEdit ? t("Update Details") : t("Who are you?")}
              </Text>
            </DialogTitle>
          </DialogHeader>
          <DialogBody>
            {
              //Warn player if they are joining a game in progress
            }
            {!isEdit && gameState === GameState.CardsDealt ? (
              <Alert.Root mb={4} size="sm" status="info">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>{t("Game In Progress")}</Alert.Title>
                  <Alert.Description>
                    {t(
                      "You will join the game in the waiting room until the current game ends. "
                    )}
                  </Alert.Description>
                </Alert.Content>
              </Alert.Root>
            ) : null}
            <form id="player-details-form" onSubmit={handleSubmit(onSubmit)}>
              <Suspense
                fallback={
                  <VStack gap={4}>
                    <SkeletonCircle loading size="3rem" />
                    <Skeleton height={4} w="full" />
                  </VStack>
                }
              >
                <SkeletonComposed
                  skeleton={
                    <VStack gap={4}>
                      <SkeletonCircle loading size="3rem" />
                      <Skeleton height={4} w="full" />
                    </VStack>
                  }
                  loading={isCurrentPlayerLoading}
                >
                  <VStack gap={4}>
                    <Field label={t("Avatar")}>
                      <AvatarScrollPicker
                        setAvatarIndex={(index) => {
                          setValue("avatarIndex", index);
                        }}
                        initialAvatarIndex={currentPlayer?.avatarIndex}
                      />
                    </Field>

                    <Field
                      invalid={!!errors.nickname}
                      errorText={errors.nickname?.message}
                      helperText={
                        <Text fontSize="small">
                          {t("How others will see you!")}
                        </Text>
                      }
                      defaultValue={currentPlayer?.nickname}
                      label={t("Nickname")}
                    >
                      <Input
                        size="lg"
                        {...nicknameField}
                        ref={(e) => {
                          ref(e);
                          focusRef.current = e;
                        }}
                      />
                    </Field>
                  </VStack>
                </SkeletonComposed>
              </Suspense>
            </form>
          </DialogBody>
          <DialogFooter>
            <Button
              loading={isSubmitLoading}
              disabled={isSubmitLoading}
              form="player-details-form"
              type="submit"
            >
              {isEdit ? t("Update Details") : t("Join Room")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRootProvider>
    </>
  );
};

function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}
