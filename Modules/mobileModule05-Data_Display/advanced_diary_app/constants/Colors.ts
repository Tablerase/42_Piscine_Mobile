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
    textDisabled: theme.colors.text.disabled,
    background: theme.colors.neutral.light,
    tint: tintColorLight,
    secondary: theme.colors.secondary.main,
    secondaryBackground: theme.colors.secondary.light,
    icon: theme.colors.neutral.light,
    tabIconDefault: theme.colors.neutral.main,
    tabIconSelected: tintColorLight,
    success: theme.colors.accent.success,
    warning: theme.colors.accent.warning,
    error: theme.colors.accent.error,
    info: theme.colors.accent.info,
    // Additional semantic colors
    surface: theme.colors.neutral.light,
    onSurface: theme.colors.text.primary,
    primary: theme.colors.primary.main,
    onPrimary: theme.colors.primary.contrastText,
    onSecondary: theme.colors.secondary.contrastText,
  },
  dark: {
    text: theme.colors.text.secondary,
    textDisabled: theme.colors.text.disabled,
    background: theme.colors.neutral.dark,
    tint: tintColorDark,
    secondary: theme.colors.secondary.light,
    secondaryBackground: theme.colors.secondary.dark,
    icon: theme.colors.neutral.light,
    tabIconDefault: theme.colors.neutral.main,
    tabIconSelected: tintColorDark,
    success: theme.colors.accent.success,
    warning: theme.colors.accent.warning,
    error: theme.colors.accent.error,
    info: theme.colors.accent.info,
    // Additional semantic colors
    surface: theme.colors.neutral.dark,
    onSurface: theme.colors.text.secondary,
    primary: theme.colors.primary.light,
    onPrimary: theme.colors.primary.contrastText,
    onSecondary: theme.colors.secondary.contrastText,
  },
};
