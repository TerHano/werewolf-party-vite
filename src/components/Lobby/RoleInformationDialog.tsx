import { Button } from "@chakra-ui/react";
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
import { ButtonProps } from "../ui/button";
import { RoleInfo } from "@/hooks/useRoles";
import { useTranslation } from "react-i18next";

interface RoleInformationDialogProps {
  roles: RoleInfo[];
  button: ButtonProps;
}

export const RoleInformationDialog = ({
  roles,
  button,
}: RoleInformationDialogProps) => {
  const { t } = useTranslation();
  return (
    <DialogRoot scrollBehavior="inside">
      <DialogTrigger asChild>
        <Button {...button} />
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
