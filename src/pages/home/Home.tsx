import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import CalculatedTable from "../../components/calculatedTable/CalculatedTable";
import {
  Typography,
  Button,
  Box,
  Grid,
  TextField,
  Paper,
  Container,
  Stack,
  Chip,
  Divider,
} from "@mui/material";

const isLoggedIn: () => boolean = () => {
  return localStorage.getItem("token") !== null;
};

const Home: React.FC = () => {
  const token = localStorage.getItem("token") || "invalid_token";

  const [usage, setUsage] = useState<number | string>("");
  const [submittedInput, setSubmittedInput] = useState<number | string>("");
  const [error, setError] = useState<string>("");

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleUsageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsage(value);
    if (error) setError("");
  };

  const handleSubmit = () => {
    if (usage === "" || usage === null) {
      setError("Please enter a usage value before calculating.");
      return;
    }
    setSubmittedInput(usage);
  };

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.select();
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleQuickSelect = (value: number) => {
    setUsage(value);
    setError("");
    // optional: auto-submit for quick presets
    setSubmittedInput(value);
  };

  if (!isLoggedIn()) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: (theme) => (theme.palette.mode === "dark" ? "background.default" : "#f3f4f6"),
          px: 2,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={4}
            sx={{
              p: 4,
              borderRadius: 3,
              textAlign: "center",
            }}
          >
            <Typography variant="h4" gutterBottom>
              You&apos;re not logged in
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Log in to view and calculate your prices with the latest usage data.
            </Typography>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <Button variant="contained" size="large" fullWidth>
                Log In
              </Button>
            </Link>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? "background.default"
            : "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 50%, #f9fafb 100%)",
        py: 6,
        px: { xs: 2, sm: 3 },
      }}
    >
      <Container maxWidth="lg">
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Usage Price Calculator
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enter your usage and instantly see the calculated prices. Adjust the value to explore
            different scenarios.
          </Typography>
        </Box>

        <Grid container spacing={4} alignItems="stretch">
          {/* Input Panel */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={4}
              sx={{
                p: 3,
                height: "100%",
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                gap: 2.5,
              }}
            >
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  INPUT
                </Typography>
                <Typography variant="h6">Enter Usage</Typography>
                <Typography variant="body2" color="text.secondary">
                  Type your usage value below. You can also tap a quick preset.
                </Typography>
              </Box>

              <Stack spacing={1.5}>
                <TextField
                  label="Usage"
                  value={usage}
                  onChange={handleUsageChange}
                  type="number"
                  fullWidth
                  variant="outlined"
                  inputRef={inputRef}
                  onFocus={handleFocus}
                  onKeyDown={handleKeyDown}
                  error={!!error}
                  helperText={error || "Example: 100, 250, 500"}
                />

                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {[50, 100, 250, 500].map((preset) => (
                    <Chip
                      key={preset}
                      label={preset}
                      variant="outlined"
                      clickable
                      onClick={() => handleQuickSelect(preset)}
                      sx={{ mb: 0.5 }}
                    />
                  ))}
                </Stack>

                <Button variant="contained" size="large" onClick={handleSubmit} sx={{ mt: 1 }}>
                  Calculate
                </Button>
              </Stack>

              <Divider sx={{ my: 1.5 }} />

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Tip: You can press <b>Enter</b> inside the input to calculate faster.
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Results Panel */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={4}
              sx={{
                p: 3,
                borderRadius: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 1,
                }}
              >
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    OUTPUT
                  </Typography>
                  <Typography variant="h5">Calculated Prices</Typography>
                </Box>
                {submittedInput && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 999,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    Current usage:&nbsp;
                    <b>{submittedInput}</b>
                  </Typography>
                )}
              </Box>

              <Divider />

              <Box sx={{ flexGrow: 1, minHeight: 200 }}>
                {submittedInput && token !== "invalid_token" ? (
                  <CalculatedTable inputUsage={submittedInput} token={token} />
                ) : (
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      px: 2,
                    }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      Enter a usage value on the left and click <b>Calculate</b> to see your price
                      breakdown here.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
