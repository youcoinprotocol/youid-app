import { ThemeOptions, createTheme } from "@mui/material";
import { TypographyOptions } from "@mui/material/styles/createTypography";
import { Roboto } from "next/font/google";

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    hero: true;
    superscript: true;
    bodyMedium: true;
    bodySmall: true;
    headlineLarge: true;
    headlineMedium: true;
    headlineMediumNoGradient: true;
    headlineSmall: true;
    notice: true;
  }
}

interface ExtendedTypographyOptions extends TypographyOptions {
  hero: React.CSSProperties;
  superscript: React.CSSProperties;
  bodyMedium: React.CSSProperties;
  bodySmall: React.CSSProperties;
  headlineLarge: React.CSSProperties;
  headlineMedium: React.CSSProperties;
  headlineMediumNoGradient: React.CSSProperties;
  headlineSmall: React.CSSProperties;
  notice: React.CSSProperties;
}

const defaultTheme = createTheme();

const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
});

export const theme = createTheme({
  typography: {
    fontSize: 14,
    fontFamily: roboto.style.fontFamily,
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        hero: {
          fontSize: 60,
          fontWeight: 700,
          background: "linear-gradient(45deg, #004DFF 0%, #00DBFF 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        },
        superscript: {
          color: "#3B3F53",
          fontSize: 16,
          fontWeight: 700,
        },
        bodyMedium: {
          color: "#7E84A3",
          fontSize: 16,
          fontWeight: 300,
          lineHeight: 1.5,
        },
        bodySmall: {
          color: "#3B3F53",
          fontSize: 14,
          fontWeight: 400,
          whiteSpace: "pre-line",
          lineHeight: 1.5,
        },
        headlineLarge: {
          color: "rgba(28, 28, 30, 1)",
          fontSize: 48,
          fontWeight: 500,
        },
        headlineMedium: {
          fontSize: 28,
          fontWeight: 300,
          color: "rgba(28, 28, 30, 1)",
          [defaultTheme.breakpoints.down("md")]: {
            fontSize: 20,
          },
        },
        headlineMediumNoGradient: {
          fontSize: 48,
          fontWeight: 700,
        },
        headlineSmall: {
          backgroundImage: "linear-gradient(45deg, #004DFF 0%, #00DBFF 100%)",
          fontSize: 14,
          fontWeight: 700,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          whiteSpace: "pre-wrap",
        },
        notice: {
          color: "#FDFDFD",
          fontSize: 13,
          whiteSpace: "pre-line",
        },
      } as ExtendedTypographyOptions,
    },
  },
} as ThemeOptions);
