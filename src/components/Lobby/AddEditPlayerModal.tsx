import { useState } from "react";
import {
  DialogBackdrop,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";

interface AddEditPlayerModalProps {
  isEdit?: boolean;
}

export const AddEditPlayerModal = ({
  isEdit = false,
}: AddEditPlayerModalProps) => {
  const { t } = useTranslation();
  const [isDialogOpen, setDialogOpen] = useState(true);

  return (
    <DialogRoot open={isDialogOpen}>
      <DialogBackdrop />
      {isEdit && (
        <DialogTrigger>
          <Button>{t("Edit Details")}</Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hey There</DialogTitle>
        </DialogHeader>
        <DialogBody></DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};
