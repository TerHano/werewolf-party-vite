import { useEffect, useRef, useState } from "react";
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
  Avatar,
  defineStyle,
  DialogRootProvider,
  Float,
  HStack,
  IconButton,
  Input,
  SimpleGrid,
  Text,
  useDialog,
  VStack,
} from "@chakra-ui/react";
import { AddEditPlayerDetailsDto } from "@/dto/AddEditPlayerDetailsDto";
import { IconPencil, IconUser } from "@tabler/icons-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { usePlayerAvatar } from "@/hooks/usePlayerAvatar";
import { useCurrentPlayer } from "@/hooks/useCurrentPlayer";
import { useRoomId } from "@/hooks/useRoomId";
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
} from "../ui/drawer";
import { useGameState } from "@/hooks/useGameState";
import { GameState } from "@/enum/GameState";

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
  const roomId = useRoomId();
  const { t } = useTranslation();
  const { data: currentPlayer } = useCurrentPlayer(roomId, { enabled: isEdit });
  const { data: gameState } = useGameState(roomId);

  const { data: avatarNames, getAvatarImageSrcForIndex } = usePlayerAvatar();

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

  const dialog = useDialog({
    defaultOpen: !isEdit,
    closeOnEscape: isEdit,
    closeOnInteractOutside: false,
    initialFocusEl: () => focusRef.current,
  });
  const watchAvatarIndex = watch("avatarIndex");

  const onSubmit: SubmitHandler<AddEditPlayerModalForm> = (data) => {
    dialog.setOpen(false);
    submitCallback({ ...data, roomId });
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
  });

  const ringCss = defineStyle({
    outlineWidth: "2px",
    outlineColor: "blue.500",
    outlineOffset: "2px",
    outlineStyle: "solid",
    backgroundColor: "blue.800/50",
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
            <IconButton size="xs" variant="plain" colorScheme="blue">
              <IconPencil />
            </IconButton>
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
              <VStack gap={2}>
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
                  defaultValue={currentPlayer?.nickname}
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
              {isEdit ? t("Update Details") : t("Join Room")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRootProvider>
      <DrawerRoot
        size="sm"
        placement="bottom"
        open={isDrawerOpen}
        onOpenChange={(e) => {
          setDrawerOpen(e.open);
        }}
      >
        <DrawerBackdrop />
        <DrawerContent mb={3} borderRadius="sm">
          <DrawerHeader>
            <HStack gap={1}>
              <IconUser size={18} />
              <Text fontWeight={500} fontSize="lg">
                Pick A Avatar
              </Text>
            </HStack>
          </DrawerHeader>
          <DrawerBody>
            <SimpleGrid
              justifyItems="center"
              columns={{ base: 2, xs: 3, sm: 4, md: 5 }}
              gapX={3}
              gapY={5}
            >
              {avatarNames.map((avatarName, index) => {
                return (
                  <Avatar.Root
                    variant="subtle"
                    css={watchAvatarIndex === index ? ringCss : undefined}
                    size="2xl"
                    key={avatarName}
                    onClick={() => {
                      setValue("avatarIndex", index);
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
          </DrawerBody>
          {/* <DrawerCloseTrigger /> */}
          <DrawerFooter>
            <Button w="full" onClick={() => setDrawerOpen(false)}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </DrawerRoot>
    </>
  );
};

function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}
