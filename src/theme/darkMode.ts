import { createTheme } from "@mui/material/styles";

export const darkGlassTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#020617", // Deep space blue/black
      paper: "transparent",
    },
    text: {
      primary: "rgba(255,255,255,0.95)",
      secondary: "rgba(148,163,184,0.9)",
    },
    primary: {
      main: "#3b82f6",
    },
  },
  shape: {
    borderRadius: 24, // Smoother curves for glass
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(15, 23, 42, 0.3)", // Subtle base glass
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          boxShadow: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
          backgroundImage: "none", // Remove default overlay
        },
      },
    },

    // 🔮 THE ULTIMATE GLASS BUTTONS
    MuiButton: {
      defaultProps: {
        disableRipple: true, // Ripples ruin the glass illusion; we use CSS transitions instead
      },
      styleOverrides: {
        // Base Glass Pill
        root: ({ theme }) => ({
          borderRadius: 9999, // Perfect pill shape
          paddingInline: theme.spacing(3),
          paddingBlock: theme.spacing(1.2),
          fontWeight: 600,
          fontFamily: '"Inter", "Roboto", sans-serif',
          letterSpacing: "0.02em",
          textTransform: "none",
          fontSize: "0.9375rem",

          // The Glass Recipe 🧪
          background: "linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",

          // The Frost Border & Inner Glow
          borderTop: "1px solid rgba(255, 255, 255, 0.15)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
          borderRight: "1px solid rgba(255, 255, 255, 0.08)",

          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1), inset 0px 1px 0px rgba(255, 255, 255, 0.1)",

          color: "rgba(255, 255, 255, 0.9)",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",

          "&:hover": {
            // Brighter glass on hover
            background: "linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)",
            transform: "translateY(-1px)",
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3), inset 0px 1px 0px rgba(255, 255, 255, 0.2)",
            borderColor: "rgba(255, 255, 255, 0.25)",
            color: "#ffffff",
          },

          "&:active": {
            transform: "translateY(1px)",
            background: "rgba(255, 255, 255, 0.05)",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2), inset 0px 2px 4px rgba(0, 0, 0, 0.1)",
          },

          "&.Mui-disabled": {
            background: "rgba(255, 255, 255, 0.02)",
            borderColor: "rgba(255, 255, 255, 0.02)",
            color: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "none",
            boxShadow: "none",
          },
        }),

        // 💎 The "Sapphire" Action Button (Contained Primary)
        containedPrimary: {
          // A rich, deep blue glass, not just a solid color
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.6) 0%, rgba(37, 99, 235, 0.4) 100%)",
          border: "1px solid rgba(96, 165, 250, 0.3)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          color: "#ffffff",
          textShadow: "0px 1px 2px rgba(0,0,0,0.3)",

          "&:hover": {
            background: "linear-gradient(135deg, rgba(59, 130, 246, 0.7) 0%, rgba(37, 99, 235, 0.5) 100%)",
            border: "1px solid rgba(147, 197, 253, 0.4)",
            boxShadow: "0 8px 32px 0 rgba(59, 130, 246, 0.5), inset 0 0 10px rgba(255,255,255,0.1)",
          },

          "&:active": {
            background: "rgba(37, 99, 235, 0.5)",
            boxShadow: "inset 0 2px 10px rgba(0,0,0,0.2)",
          },
        },

        // 🧊 The "Etched Ice" Button (Outlined)
        outlined: {
          background: "transparent",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          color: "rgba(255, 255, 255, 0.8)",
          boxShadow: "none",

          "&:hover": {
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.4)", // Bright white border pop
            color: "#ffffff",
            boxShadow: "0 0 15px rgba(255, 255, 255, 0.05)",
          },
        },

        // 👻 Minimal Text Button
        text: {
          background: "transparent",
          border: "none",
          boxShadow: "none",
          color: "rgba(148, 163, 184, 0.9)",
          paddingInline: 8,

          "&:hover": {
            background: "rgba(255, 255, 255, 0.05)",
            color: "#ffffff",
          },
        },

        sizeSmall: {
          paddingInline: 16,
          paddingBlock: 6,
          fontSize: "0.8125rem",
        },
        sizeLarge: {
          paddingInline: 32,
          paddingBlock: 16,
          fontSize: "1.05rem",
        },
      },
    },
  },
});
