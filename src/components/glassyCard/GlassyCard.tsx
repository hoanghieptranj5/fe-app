import { Card, CardContent, CardHeader, CardProps, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const GlassyCard = styled((props: CardProps) => <Card elevation={0} {...props} />)(
  ({ theme }) => ({
    position: "relative",
    borderRadius: 24,
    padding: theme.spacing(2.5),
    background: "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.03))",
    boxShadow: "0 22px 55px rgba(15,23,42,0.55), 0 0 0 1px rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.18)",
    backdropFilter: "blur(22px) saturate(150%)",
    WebkitBackdropFilter: "blur(22px) saturate(150%)",
    overflow: "hidden",

    // soft glow in the corner
    "&::before": {
      content: '""',
      position: "absolute",
      inset: "-40%",
      background: "radial-gradient(circle at 0% 0%, rgba(96,165,250,0.40) 0, transparent 55%)",
      opacity: 0.55,
      pointerEvents: "none",
    },

    "& .MuiCardHeader-root, & .MuiCardContent-root": {
      position: "relative",
      zIndex: 1,
    },

    // small screen breathing room
    [theme.breakpoints.down("sm")]: {
      borderRadius: 18,
      padding: theme.spacing(2),
    },
  }),
);
