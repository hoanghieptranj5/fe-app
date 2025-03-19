import React, { useState, useRef } from 'react';
import CalculatedTable from "../../components/calculatedTable/CalculatedTable";
import { Typography, Button, Box, Grid, TextField, Paper } from '@mui/material';

const isLoggedIn: () => boolean = () => {
  return localStorage.getItem('token') !== null;
};

const Home: React.FC = () => {
  const token = localStorage.getItem('token') || "invalid_token";

  // State to hold usage value from input
  const [usage, setUsage] = useState<number | string>('');
  const [submittedInput, setSubmittedInput] = useState<number | string>('');

  // Reference to the input field
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleUsageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsage(e.target.value);
  };

  const handleSubmit = () => {
    if (usage) {
      setSubmittedInput(usage);
    }
  }

  const handleFocus = () => {
    if (inputRef.current) {
      // Select all text when the input is focused
      inputRef.current.select();
    }
  };

  if (!isLoggedIn()) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          height: '100vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          You're not logged in
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Please log in to view your calculated prices.
        </Typography>
        <Button variant="contained" color="primary" href="/login">
          Log In
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, padding: 4 }}>
      <Grid container spacing={4}>
        {/* Input Panel - Left */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 2 }}>
            <Typography variant="h6" gutterBottom>
              Enter Usage
            </Typography>
            <TextField
              label="Usage"
              value={usage}
              onChange={handleUsageChange}
              type="number"
              fullWidth
              variant="outlined"
              inputRef={inputRef} // Reference to the input field
              onFocus={handleFocus} // Select all text on focus
              sx={{ marginBottom: 3 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Calculate
            </Button>
          </Paper>
        </Grid>

        {/* Calculated Table - Right */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ padding: 3, boxShadow: 2 }}>
            <Typography variant="h5" gutterBottom>
              Calculated Prices
            </Typography>
            {submittedInput && token !== "invalid_token" ? (
              <CalculatedTable inputUsage={submittedInput} token={token} />
            ) : (
              <Typography variant="body1" color="textSecondary">
                Please enter a valid usage to calculate prices.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
