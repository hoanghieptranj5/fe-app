// darkMode.ts (or theme.ts)
import { createTheme } from "@mui/material/styles";

export const darkGlassTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#020617", // page background
      paper: "transparent", // cards use our custom glass
    },
    text: {
      primary: "rgba(248,250,252,0.96)",
      secondary: "rgba(148,163,184,0.95)",
    },
    primary: {
      main: "#3b82f6",
    },
  },
  shape: {
    borderRadius: 20,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
        },
      },
    },

    // 👇 Global glassy buttons
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 999,
          paddingInline: theme.spacing(2.75),
          paddingBlock: theme.spacing(1),
          fontWeight: 600,
          letterSpacing: 0.3,
          textTransform: "none",
          fontSize: 13.5,

          // base glass
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))",
          backdropFilter: "blur(12px) saturate(180%)",
          WebkitBackdropFilter: "blur(12px) saturate(180%)",
          border: "1px solid rgba(148,163,184,0.45)",
          boxShadow: "0 4px 18px rgba(15,23,42,0.9)",
          color: "rgba(226,232,240,0.92)",

          transition: "all 0.18s ease-out",

          "&:hover": {
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
            boxShadow: "0 7px 26px rgba(15,23,42,0.95)",
          },

          "&:active": {
            transform: "scale(0.97)",
            boxShadow: "0 3px 14px rgba(15,23,42,0.9)",
          },

          "&.Mui-disabled": {
            opacity: 0.35,
            borderColor: "rgba(148,163,184,0.3)",
            boxShadow: "none",
            backdropFilter: "none",
          },
        }),

        // solid blue buttons (e.g. NEXT)
        containedPrimary: {
          background:
            "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
          color: "#ffffff",
          border: "none",
          boxShadow: "0 8px 24px rgba(37,99,235,0.7)",

          "&:hover": {
            background:
              "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)",
            boxShadow: "0 10px 30px rgba(37,99,235,0.9)",
          },
        },

        // outlined pills (e.g. BACK / PREVIOUS)
        outlined: {
          background:
            "linear-gradient(135deg, rgba(15,23,42,0.85), rgba(15,23,42,0.7))",
          border: "1.5px solid rgba(148,163,184,0.5)",
          color: "rgba(203,213,225,0.96)",

          "&:hover": {
            background:
              "linear-gradient(135deg, rgba(30,64,175,0.55), rgba(15,23,42,0.9))",
            border: "1.5px solid rgba(191,219,254,0.8)",
          },
        },

        // plain text buttons (if you use them)
        text: {
          backgroundColor: "transparent",
          border: "none",
          boxShadow: "none",
          paddingInline: 0,

          "&:hover": {
            backgroundColor: "rgba(15,23,42,0.6)",
          },
        },

        sizeSmall: {
          paddingInline: 14,
          paddingBlock: 6,
          fontSize: 12,
        },
      },
    },
  },
});
