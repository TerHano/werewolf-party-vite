import { useMemo } from "react";

export const useAvatars = () => {
  const data = useMemo(
    () => [
      "farmer-1",
      "farmer-2",
      "farmer",
      "halloween",
      "man-1",
      "man-2",
      "man-3",
      "man-4",
      "man-5",
      "man",
      "oktoberfest",
      "pilgrim",
      //'king',
      "thanksgiving",
      "tyrolean-1",
      "tyrolean",
      "woman-1",
      "woman-2",
      "woman-3",
      "woman-4",
      "woman",
      "thanksgiving-man",
      // 'pirate',
      // 'police-dog',
      // 'princess',
      // 'punk-1',
      // 'punk',
      // 'robot',
      // 'siberian-husky',
      // 'spy',
      // 'squirrel',
      // 'student',
      // 'vampire',
      // 'viking',
    ],
    []
  );

  return { data };
};
