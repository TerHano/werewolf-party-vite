import { ActionModalContext } from "@/context/ActionModalContext";
import React from "react";

export const useActionModalContext = () => {
  const actionModalCallback = React.useContext(ActionModalContext);
  if (!actionModalCallback) {
    throw new Error("Must be used with Action Modal Context");
  }
  return { actionModalCallback };
};
