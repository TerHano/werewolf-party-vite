import { useCallback, useMemo, useState } from "react";
import {
  DialogBackdrop,
  DialogRoot,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { PlayerList } from "../ActionModals/PlayerList";
import {
  DialogContext,
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
import { WerewolfInvestigationResult } from "@/components/GameRoom/ModeratorView/NightView/InvestigationModals/WerewolfInvestigationResult";

export interface InvestigationProps {
  playerId: string;
  action: RoleActionDto;
}

interface InvestigationModalProps {
  title: string;
  resultNode: React.ReactNode;
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
      setStep(1);
    },
  });

  const alivePlayers =
    allPlayers?.filter((player) => player.isAlive && player.id !== playerId) ??
    [];

  const onSubmit = useCallback(() => {
    if (selectedPlayerId) {
      createUpdateQueuedAction({
        roomId,
        playerId: playerId,
        affectedPlayerId: selectedPlayerId,
        action: action.type,
      });
    }
  }, [action, createUpdateQueuedAction, playerId, roomId, selectedPlayerId]);

  const investigationModalProps = useMemo<InvestigationModalProps>(() => {
    switch (action.type) {
      default:
        return {
          title: t("Who do we think is the Werewolf"),
          resultNode: (
            <WerewolfInvestigationResult
              allPlayers={allPlayers ?? []}
              playerId={playerId}
            />
          ),
        };
    }
  }, [action.type, allPlayers, playerId, t]);

  return (
    <DialogRoot size="md" placement="center" onExitComplete={() => setStep(0)}>
      <DialogBackdrop />
      <DialogTrigger>
        <Button disabled={!action.enabled} size="sm" colorPalette="blue">
          <IconSearch size={14} />
          {t("Investigate")}
        </Button>
      </DialogTrigger>
      <DialogContent minH="20rem">
        <DialogCloseTrigger />
        <DialogHeader>
          <DialogTitle>
            <Text textStyle="accent">
              {step === 0
                ? investigationModalProps.title
                : t("Investigation Result")}
            </Text>
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
              {investigationModalProps.resultNode}
            </StepsContent>
          </StepsRoot>
        </DialogBody>
        <DialogFooter>
          <DialogContext>
            {(context) => (
              <>
                {step === 0 && (
                  <Button onClick={onSubmit} size="sm">
                    {t("Investigate")}
                  </Button>
                )}
                {step === 1 && (
                  <Button
                    onClick={() => {
                      context.setOpen(false);
                    }}
                    size="sm"
                  >
                    {t("Close")}
                  </Button>
                )}
              </>
            )}
          </DialogContext>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
