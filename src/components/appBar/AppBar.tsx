import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  BottomNavigation,
  BottomNavigationAction,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import CalculateIcon from "@mui/icons-material/Calculate";
import InfoIcon from "@mui/icons-material/Info";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TranslateIcon from "@mui/icons-material/Translate";
import { FitnessCenter } from "@mui/icons-material";

// ===== routes config =====
const routes = [
  { path: "/", label: "Calculator", icon: <CalculateIcon /> },
  { path: "/about", label: "About", icon: <InfoIcon /> },
  { path: "/shared", label: "Shared", icon: <AccountCircleIcon /> },
  { path: "/hanzi", label: "Hanzi", icon: <TranslateIcon /> },
  { path: "/workout", label: "Workout", icon: <FitnessCenter /> },
];

// ===== styled components =====

// Glassy top app bar
const GlassyTopBar = styled(AppBar)(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(90deg, rgba(15,23,42,0.95), rgba(15,23,42,0.75))"
      : "linear-gradient(90deg, rgba(248,250,252,0.95), rgba(229,231,235,0.9))",
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 14px 40px rgba(15,23,42,0.9)"
      : "0 6px 20px rgba(15,23,42,0.18)",
  backdropFilter: "blur(18px) saturate(150%)",
  WebkitBackdropFilter: "blur(18px) saturate(150%)",
  borderBottom:
    theme.palette.mode === "dark"
      ? "1px solid rgba(30,64,175,0.45)"
      : "1px solid rgba(148,163,184,0.45)",
  zIndex: theme.zIndex.appBar,
}));

// Wrapper so content doesn't go under the fixed bars
const Shell = styled("div")(({ theme }) => ({
  paddingTop: theme.spacing(7), // top bar height offset
  paddingBottom: theme.spacing(10), // bottom nav offset
}));

// Container that centers the floating nav
const GlassyBottomNavContainer = styled(Box)(({ theme }) => ({
  position: "fixed",
  bottom: 12,
  left: "50%",
  transform: "translateX(-50%)",
  width: "100%",
  maxWidth: 520,
  paddingInline: theme.spacing(2),
  zIndex: theme.zIndex.appBar + 1,
  pointerEvents: "none", // let only the nav itself receive events
}));

// Glassy nav bar itself
const GlassyBottomNav = styled(BottomNavigation)(({ theme }) => ({
  pointerEvents: "auto",
  borderRadius: 999,
  paddingInline: theme.spacing(1),
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(135deg, rgba(15,23,42,0.98), rgba(15,23,42,0.8))"
      : "linear-gradient(135deg, rgba(248,250,252,0.98), rgba(229,231,235,0.9))",
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 18px 45px rgba(15,23,42,0.95)"
      : "0 12px 32px rgba(15,23,42,0.25)",
  backdropFilter: "blur(22px) saturate(160%)",
  WebkitBackdropFilter: "blur(22px) saturate(160%)",
  border:
    theme.palette.mode === "dark"
      ? "1px solid rgba(51,65,85,0.9)"
      : "1px solid rgba(148,163,184,0.7)",
}));

// Actions with modern icon/label behavior
const GlassyBottomNavAction = styled(BottomNavigationAction)(({ theme }) => ({
  minWidth: 0,
  paddingTop: 6,
  paddingBottom: 4,
  color: theme.palette.mode === "dark" ? "rgba(148,163,184,0.9)" : theme.palette.text.secondary,
  "& .MuiSvgIcon-root": {
    fontSize: 22,
  },
  "& .MuiBottomNavigationAction-label": {
    fontSize: 10,
    fontWeight: 500,
    transition: "all 120ms ease-out",
  },
  "&.Mui-selected": {
    color: theme.palette.mode === "dark" ? theme.palette.primary.light : theme.palette.primary.main,
    "& .MuiBottomNavigationAction-label": {
      fontSize: 11,
    },
  },
}));

const CustomAppBar: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const isAuthenticated = localStorage.getItem("token") !== null;

  const getTabValue = (path: string) => {
    const route = routes.find((route) => route.path === path);
    return route ? routes.indexOf(route) : -1;
  };

  useEffect(() => {
    setValue(getTabValue(location.pathname));
  }, [location.pathname]);

  const handleLogoutClick = () => setOpenDialog(true);

  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    setOpenDialog(false);
    navigate("/", { replace: true });
  };

  const handleLogoutCancel = () => setOpenDialog(false);

  return (
    <>
      {/* Top bar */}
      <GlassyTopBar elevation={0}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Omni App
          </Typography>
          {isAuthenticated && (
            <Button
              color="inherit"
              size="small"
              onClick={handleLogoutClick}
              sx={{
                textTransform: "none",
                fontSize: 13,
                px: 1.5,
                py: 0.5,
                borderRadius: 999,
                border: "1px solid rgba(148,163,184,0.5)",
              }}
            >
              Log out
            </Button>
          )}
        </Toolbar>
      </GlassyTopBar>

      {/* Main content wrapper (pads for fixed bars) */}
      <Shell>{children}</Shell>

      {/* Floating bottom nav */}
      <GlassyBottomNavContainer>
        <GlassyBottomNav
          showLabels
          value={value}
          onChange={(_, newValue) => {
            setValue(newValue);
            const route = routes[newValue];
            if (route) navigate(route.path);
          }}
        >
          {routes.map((route) => (
            <GlassyBottomNavAction key={route.path} label={route.label} icon={route.icon} />
          ))}
        </GlassyBottomNav>
      </GlassyBottomNavContainer>

      {/* Logout confirmation dialog (also glassy) */}
      <Dialog
        open={openDialog}
        onClose={handleLogoutCancel}
        PaperProps={{
          sx: (theme) => ({
            borderRadius: 3,
            background:
              theme.palette.mode === "dark"
                ? "linear-gradient(135deg, rgba(15,23,42,0.98), rgba(15,23,42,0.85))"
                : "linear-gradient(135deg, rgba(248,250,252,0.98), rgba(229,231,235,0.95))",
            boxShadow: "0 22px 60px rgba(15,23,42,0.9)",
            backdropFilter: "blur(22px) saturate(160%)",
            WebkitBackdropFilter: "blur(22px) saturate(160%)",
          }),
        }}
      >
        <DialogTitle>Confirm log out</DialogTitle>
        <DialogContent>Are you sure you want to log out?</DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel}>Cancel</Button>
          <Button onClick={handleLogoutConfirm} color="secondary">
            Log out
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CustomAppBar;
