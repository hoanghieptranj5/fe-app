// src/pages/FlashCardsView.tsx
import React, { useState } from "react";
import { Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import type { Flashcard } from "../../types/hanzi";

interface LocationState {
  flashcards?: Flashcard[];
}

const FlashCardsView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const flashcards = state?.flashcards ?? [];

  const [index, setIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);

  if (!flashcards.length) {
    return (
      <Box
        p={3}
        minHeight="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        bgcolor="#f8f9fa"
      >
        <Typography variant="h5" gutterBottom>
          No flashcards loaded
        </Typography>
        <Typography variant="body2" mb={2}>
          Go back to the Hanzi list and start flashcard practice from there.
        </Typography>
        <Button variant="outlined" onClick={() => navigate("/")}>
          Back to Hanzi List
        </Button>
      </Box>
    );
  }

  const current = flashcards[index];

  const handleFlip = () => setShowBack((prev) => !prev);

  const handleNext = () => {
    setShowBack(false);
    setIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setShowBack(false);
    setIndex((prev) => (prev === 0 ? flashcards.length - 1 : prev - 1));
  };

  return (
    <Box
      p={4}
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{
        background: "linear-gradient(135deg, #f5f7fa, #e6efff)",
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        width="100%"
        maxWidth={600}
        mb={3}
        justifyContent="space-between"
      >
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Back
        </Button>
        <Typography variant="h6">
          Flashcards: {index + 1} / {flashcards.length}
        </Typography>
      </Stack>

      {/* Flip wrapper */}
      <Box
        sx={{
          perspective: 1000,
          mb: 3,
        }}
        onClick={handleFlip}
      >
        <Box
          sx={{
            position: "relative",
            width: 420,
            height: 280,
            transformStyle: "preserve-3d",
            transition: "transform 0.6s",
            transform: showBack ? "rotateY(180deg)" : "rotateY(0deg)",
            cursor: "pointer",
          }}
        >
          {/* FRONT */}
          <Card
            sx={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 4,
              boxShadow: "0px 4px 16px rgba(0,0,0,0.15)",
              background: "white",
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: 100,
                  fontFamily: `"Kaiti SC","STKaiti","KaiTi","DFKai-SB","Noto Serif SC","Noto Serif CJK SC","serif"`,
                  color: "#1f2937",
                }}
              >
                {current.hanzi}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Click to flip
              </Typography>
            </CardContent>
          </Card>

          {/* BACK */}
          <Card
            sx={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              borderRadius: 4,
              boxShadow: "0px 4px 16px rgba(0,0,0,0.15)",
              background: "#ffffff",
            }}
          >
            <CardContent
              sx={{
                textAlign: "center",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <Typography variant="subtitle1" color="primary">
                Pronunciations
              </Typography>

              <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                {current.pronunciations.map((p, idx) => (
                  <Chip key={idx} label={p} variant="outlined" />
                ))}
              </Stack>

              {current.pronunciations.length === 0 && (
                <Typography variant="body2" sx={{ opacity: 0.7, mt: 1 }}>
                  No pronunciation data.
                </Typography>
              )}

              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Click to flip back
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Stack direction="row" spacing={2} mt={1}>
        <Button onClick={handlePrev} variant="outlined">
          Previous
        </Button>
        <Button onClick={handleNext} variant="contained">
          Next
        </Button>
      </Stack>
    </Box>
  );
};

export default FlashCardsView;
