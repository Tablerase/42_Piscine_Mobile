/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * Colors are now based on the comprehensive theme palette defined in theme.ts
 */

import { theme } from "./theme";

const tintColorLight = theme.colors.primary.main;
const tintColorDark = theme.colors.primary.light;

export const Colors = {
  light: {
    text: theme.colors.text.primary,
    background: theme.colors.neutral.light,
    tint: tintColorLight,
    icon: theme.colors.neutral.main,
    tabIconDefault: theme.colors.neutral.main,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: theme.colors.text.secondary,
    background: theme.colors.neutral.dark,
    tint: tintColorDark,
    icon: theme.colors.neutral.main,
    tabIconDefault: theme.colors.neutral.main,
    tabIconSelected: tintColorDark,
  },
};
