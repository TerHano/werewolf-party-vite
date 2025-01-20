import { ActionModalOptionsContext } from "@/context/ActionModalOptionsContext";
import React from "react";

export const useActionModalOptionsContext = () => {
  const actionModalOptions = React.useContext(ActionModalOptionsContext);
  if (!actionModalOptions) {
    throw new Error("Must be used with Action Modal Options Context");
  }
  return actionModalOptions;
};
