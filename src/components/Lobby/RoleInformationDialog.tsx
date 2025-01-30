import { Button, IconButton } from "@chakra-ui/react";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { RoleInfoList } from "./RoleInfoList";
import { RoleInfo } from "@/hooks/useRoles";
import { useTranslation } from "react-i18next";
import { IconQuestionMark } from "@tabler/icons-react";

interface RoleInformationDialogProps {
  roles: RoleInfo[];
}

export const RoleInformationDialog = ({
  roles,
}: RoleInformationDialogProps) => {
  const { t } = useTranslation();
  return (
    <DialogRoot scrollBehavior="inside">
      <DialogTrigger asChild>
        <IconButton borderRadius="full" variant="outline" size="2xs">
          <IconQuestionMark />
        </IconButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Role Information")}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <RoleInfoList roles={roles} />
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button w="full" variant="outline">
              {t("Close")}
            </Button>
          </DialogActionTrigger>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
