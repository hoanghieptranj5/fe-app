import React, { useState } from "react";
import { TextField, Button, Typography, Paper, Box } from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Import useNavigate
import "./Login.scss"; // Import SCSS

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"; // Fallback to avoid undefined API

const isValidJwt = (token: string) => {
  const jwtPattern = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
  return jwtPattern.test(token);
};

// ✅ Define TypeScript Interfaces for Inputs & Response
interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  username: string;
}

// ✅ Updated Async Function for Login to Handle Server Error Messages Properly
const loginUser = async ({ username, password }: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await axios.post<{ value: string; statusCode?: number }>(
      `${API_URL}/user/login`,
      { username, password },
      { headers: { "Content-Type": "application/json" } },
    );

    if (response.status === 200 && response.data.value && isValidJwt(response.data.value)) {
      return { token: `Bearer ${response.data.value}`, username };
    } else {
      throw new Error(response.data.value || "Login failed");
    }
  } catch (error: any) {
    const errorMessage =
      error.message || "Login failed";
    throw new Error(errorMessage);
  }
};

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();  // Use useNavigate hook

  const mutation = useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: (credentials: LoginCredentials) => loginUser(credentials),
    onSuccess: (response: LoginResponse) => {
      console.log("Login successful:", response);
      localStorage.setItem("token", response.token);
      navigate("/");  // Navigate to homepage upon successful login
    },
    onError: (error: Error) => {
      console.error("Login failed:", error.message);
    },
  });

  const handleLogin = () => {
    mutation.mutate({ username, password });
  };

  return (
    <div className="login-page">
      {/* Glassmorphism Login Box */}
      <Paper elevation={6} className="login-container">
        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <LockOutlined style={{ fontSize: 40, color: "#1976d2" }} />
        </Box>
        <Typography variant="h5" sx={{ mt: 2, fontWeight: "bold" }}>
          Sign In
        </Typography>

        <TextField
          label="Email Address"
          variant="outlined"
          fullWidth
          sx={{ mt: 3 }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleLogin}
          disabled={mutation.status === "pending"} // Explicit check
        >
          {mutation.status === "pending" ? "Logging in..." : "Login"}
        </Button>

        {/* ✅ Display server error message when login fails */}
        {mutation.isError && (
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            {mutation.error.message}
          </Typography>
        )}

        <Typography variant="body2" sx={{ mt: 2, color: "gray" }}>
          Don't have an account? <a href="#">Sign Up</a>
        </Typography>
      </Paper>
    </div>
  );
};

export default Login;
