import React from "react";
import { TextField, Button, Typography, Paper } from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import "./Login.scss"; // Import SCSS

const Login: React.FC = () => {
  return (
    <div className="login-page">
      {/* Animated blurry blobs */}
      <div className="blob"></div>
      <div className="blob"></div>
      <div className="blob"></div>

      {/* Glassmorphism Login Box */}
      <Paper elevation={6} className="login-container">
        <LockOutlined sx={{ fontSize: 40, color: "#1976d2" }} />
        <Typography variant="h5" sx={{ mt: 2, fontWeight: "bold" }}>
          Sign In
        </Typography>

        <TextField label="Email Address" variant="outlined" fullWidth sx={{ mt: 3 }} />
        <TextField label="Password" type="password" variant="outlined" fullWidth sx={{ mt: 2 }} />
        <Button variant="contained" fullWidth sx={{ mt: 3 }}>
          Login
        </Button>

        <Typography variant="body2" sx={{ mt: 2, color: "gray" }}>
          Don't have an account? <a href="#">Sign Up</a>
        </Typography>
      </Paper>
    </div>
  );
};

export default Login;
