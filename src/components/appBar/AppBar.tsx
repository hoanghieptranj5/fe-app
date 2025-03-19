import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, BottomNavigation, BottomNavigationAction, Button, Box, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CalculateIcon from "@mui/icons-material/Calculate";
import InfoIcon from "@mui/icons-material/Info";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TranslateIcon from '@mui/icons-material/Translate';

const CustomAppBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  // Array of route configuration
  const routes = [
    { path: "/", label: "Calculator", icon: <CalculateIcon /> },
    { path: "/about", label: "About", icon: <InfoIcon /> },
    { path: "/users", label: "Users", icon: <AccountCircleIcon /> },
    { path: "/hanzi", label: "Hanzi", icon: <TranslateIcon /> },
  ];

  // Helper function to get the value based on path
  const getTabValue = (path: string) => {
    const route = routes.find(route => route.path === path);
    return route ? routes.indexOf(route) : -1;
  };

  // Update state based on location
  useEffect(() => {
    setValue(getTabValue(location.pathname));
  }, [location.pathname]);

  const handleLogoutClick = () => {
    // Open logout confirmation dialog
    setOpenDialog(true);
  };

  const handleLogoutConfirm = () => {
    // Remove token from localStorage and close the dialog
    localStorage.removeItem("token");
    setOpenDialog(false);
    console.log("Logged out");

    // Navigate to the home page after logging out
    navigate("/", { replace: true });
  };

  const handleLogoutCancel = () => {
    // Close the dialog without logging out
    setOpenDialog(false);
  };

  // Check if the user is authenticated
  const isAuthenticated = localStorage.getItem("token") !== null;

  return (
    <div>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Omni App
          </Typography>
          <Box>
            {isAuthenticated && (
              <Button color="inherit" onClick={handleLogoutClick}>
                Log Out
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => setValue(newValue)}
        sx={{
          width: "100%",
          position: "fixed",
          bottom: 0,
          left: 0,
          zIndex: 1000,
          backgroundColor: "white",
          boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.1)", // Optional shadow for better visibility
        }}
      >
        {routes.map((route, index) => (
          <BottomNavigationAction
            key={route.path}
            label={route.label}
            icon={route.icon}
            component={Link}
            to={route.path}
          />
        ))}
      </BottomNavigation>

      {/* Logout Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleLogoutCancel}>
        <DialogTitle>Confirm Log Out</DialogTitle>
        <DialogContent>
          Are you sure you want to log out?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogoutConfirm} color="secondary">
            Log Out
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CustomAppBar;
