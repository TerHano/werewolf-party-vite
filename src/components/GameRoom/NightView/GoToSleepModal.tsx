import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { Image, Text } from "@chakra-ui/react";
import { useRole } from "@/hooks/useRoles";
import { Role } from "@/enum/Role";

interface GoToSleepModalProps {
  open: boolean;
  role: Role | undefined;
}

export const GoToSleepModal = ({ open, role }: GoToSleepModalProps) => {
  const { data: roleInfo } = useRole(role);
  return (
    <DialogRoot
      placement="center"
      lazyMount
      open={open}
      // onOpenChange={(x) => onOpenChange(x.open)}
    >
      <DialogBackdrop />
      <DialogContent>
        <DialogCloseTrigger />
        <DialogHeader>
          <DialogTitle>
            <Text textStyle="accent">{`${roleInfo?.label} close your eyes`}</Text>
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Image width="6rem" src={roleInfo?.imgSrc} />
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};
