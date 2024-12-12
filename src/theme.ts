import {
  createSystem,
  defaultConfig,
  defineTextStyles,
} from "@chakra-ui/react";

const textStyles = defineTextStyles({
  accent: {
    description: "Style used to display custom font",
    value: {
      fontFamily: "Poor Story",
    },
  },
});

export const system = createSystem(defaultConfig, {
  theme: {
    textStyles: textStyles,
  },
});
