import { useCallback, useState } from "react";
import {
  DialogBackdrop,
  DialogRoot,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlayerList } from "./PlayerList";
import {
  DialogContext,
  Group,
  StepsContent,
  StepsItem,
  StepsList,
  Text,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useCreateUpdateQueuedAction } from "@/hooks/useCreateUpdateQueuedAction";
import { Button } from "@/components/ui/button";
import { useRoomId } from "@/hooks/useRoomId";
import { StepsRoot } from "@/components/ui/steps";
import { useAllPlayerRoles } from "@/hooks/useAllPlayerRoles";
import { RoleActionDto } from "@/dto/RoleActionDto";
import { IconSearch } from "@tabler/icons-react";
import { Role } from "@/enum/Role";

//type InvestigationActionTypes = ActionType.Investigate;

export interface InvestigationProps {
  playerId: string;
  action: RoleActionDto;
}

export const InvestigationModal = ({
  playerId,
  action,
}: InvestigationProps) => {
  const roomId = useRoomId();
  const { t } = useTranslation();
  const { data: allPlayers } = useAllPlayerRoles(roomId);

  const [step, setStep] = useState(0);

  const [selectedPlayerId, setSelectedPlayerId] = useState<string>();
  const { mutate: createUpdateQueuedAction } = useCreateUpdateQueuedAction({
    onSuccess: async () => {
      // close();
    },
  });

  const alivePlayers =
    allPlayers?.filter((player) => player.isAlive && player.id !== playerId) ??
    [];

  const selectedPlayerDetails = allPlayers?.find(
    (player) => player.id === selectedPlayerId
  );

  const onSubmit = useCallback(() => {
    if (selectedPlayerId) {
      createUpdateQueuedAction({
        roomId,
        playerId: playerId,
        affectedPlayerId: selectedPlayerId,
        action: action.type,
      });
      setStep(1);
    }
  }, [action, createUpdateQueuedAction, playerId, roomId, selectedPlayerId]);

  return (
    <DialogRoot placement="center" onExitComplete={() => setStep(0)}>
      <DialogBackdrop />
      <DialogTrigger>
        <Button disabled={!action.enabled} size="sm" colorPalette="blue">
          <IconSearch size={14} />
          {t("Investigate")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogCloseTrigger />
        <DialogHeader>
          <DialogTitle>
            <Text textStyle="accent">{t("Investigate")}</Text>
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <StepsRoot step={step} defaultStep={0} count={2}>
            <StepsList>
              <StepsItem index={0} title={t("Pick A Player")} />
              <StepsItem index={1} title={t("Results")} />
            </StepsList>

            <StepsContent index={0}>
              <PlayerList
                selectedPlayer={selectedPlayerId}
                players={alivePlayers}
                onPlayerSelect={(playerId) => {
                  setSelectedPlayerId(playerId);
                }}
              />
            </StepsContent>
            <StepsContent index={1}>
              {selectedPlayerDetails?.role === Role.WereWolf ? "Yup" : "Nope"}
            </StepsContent>
            <DialogContext>
              {(context) => (
                <Group>
                  {step === 0 && (
                    <Button onClick={onSubmit} variant="outline" size="sm">
                      Investigate Guy
                    </Button>
                  )}
                  {step === 1 && (
                    <Button
                      onClick={() => {
                        context.setOpen(false);
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Close
                    </Button>
                  )}
                </Group>
              )}
            </DialogContext>
          </StepsRoot>
        </DialogBody>
        {/* <DialogFooter>
          <Button onClick={onSubmit} disabled={selectedPlayerId === undefined}>
            Test
          </Button>
        </DialogFooter> */}
      </DialogContent>
    </DialogRoot>
  );
};
