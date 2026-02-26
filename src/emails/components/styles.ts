import { CSSProperties } from "react";

export const theme = {
  colors: {
    background: "#F4F1EE",        // Warm bone
    container: "#E7E1D8",          // Soft beige
    border: "#DCD5CB",             // Warm taupe
    text: {
      primary: "#1C1C1C",          // Matte black
      secondary: "#4A4A4A",        // Soft charcoal
      muted: "#8E8E8E",            // Warm gray
    },
    accent: "#1C1C1C",              // Matte black
    walnut: "#5C4332",               // Deep walnut
    titanium: "#BFC3C7",             // Soft silver
  },
  fonts: {
    body: 'Avenir, "Helvetica Neue", Helvetica, Arial, sans-serif',
  },
  spacing: {
    xs: "8px",
    sm: "16px",
    md: "24px",
    lg: "32px",
    xl: "40px",
    xxl: "60px",
  },
  borderRadius: {
    none: "0px",
    sm: "4px",
    md: "8px",
    full: "9999px",
  },
  letterSpacing: {
    tight: "0.5px",
    normal: "1px",
    wide: "2px",
    wider: "4px",
  },
};

export const globalStyles: Record<string, CSSProperties> = {
  main: {
    backgroundColor: theme.colors.background,
    fontFamily: theme.fonts.body,
    padding: theme.spacing.xl,
    margin: 0,
  },
  container: {
    backgroundColor: theme.colors.container,
    border: `1px solid ${theme.colors.border}`,
    margin: `${theme.spacing.xl} auto`,
    padding: theme.spacing.xl,
    maxWidth: "600px",
    width: "100%",
  },
  logoText: {
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: theme.letterSpacing.wider,
    color: theme.colors.text.primary,
    textAlign: "center" as const,
    marginBottom: theme.spacing.xl,
    textTransform: "uppercase" as const,
  },
  h1: {
    color: theme.colors.text.primary,
    fontSize: "26px",
    fontWeight: "500",
    textAlign: "center" as const,
    margin: `${theme.spacing.lg} 0`,
    lineHeight: 1.3,
    letterSpacing: theme.letterSpacing.normal,
  },
  h2: {
    color: theme.colors.text.primary,
    fontSize: "20px",
    fontWeight: "500",
    textAlign: "center" as const,
    margin: `${theme.spacing.md} 0`,
    letterSpacing: theme.letterSpacing.normal,
  },
  text: {
    color: theme.colors.text.secondary,
    fontSize: "15px",
    lineHeight: 1.6,
    textAlign: "center" as const,
    margin: `${theme.spacing.sm} 0`,
  },
  textLeft: {
    color: theme.colors.text.secondary,
    fontSize: "15px",
    lineHeight: 1.6,
    textAlign: "left" as const,
    margin: `${theme.spacing.sm} 0`,
  },
  buttonContainer: {
    textAlign: "center" as const,
    margin: `${theme.spacing.lg} 0`,
  },
  button: {
    backgroundColor: theme.colors.accent,
    color: theme.colors.container,
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: theme.letterSpacing.wide,
    textDecoration: "none",
    display: "inline-block",
    borderRadius: theme.borderRadius.none,
    textTransform: "uppercase" as const,
  },
  hr: {
    borderColor: theme.colors.border,
    margin: `${theme.spacing.lg} 0`,
    borderStyle: "solid" as const,
    borderWidth: "1px 0 0 0",
  },
  footer: {
    color: theme.colors.text.muted,
    fontSize: "10px",
    textAlign: "center" as const,
    letterSpacing: theme.letterSpacing.normal,
    lineHeight: 1.6,
    textTransform: "uppercase" as const,
  },
  orderBox: {
    border: `1px solid ${theme.colors.border}`,
    padding: theme.spacing.lg,
    margin: `${theme.spacing.lg} 0`,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: theme.spacing.sm,
    margin: `${theme.spacing.md} 0`,
  },
  productItem: {
    padding: theme.spacing.xs,
    borderBottom: `1px solid ${theme.colors.border}`,
  },
};