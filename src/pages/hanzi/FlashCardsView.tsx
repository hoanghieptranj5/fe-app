// src/pages/FlashCardsView.tsx
import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
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

  // 🧷 Handle reload/no state case
  if (!flashcards.length) {
    return (
      <Box p={3}>
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
    setIndex((prev) =>
      prev === 0 ? flashcards.length - 1 : prev - 1
    );
  };

  return (
    <Box p={3} display="flex" flexDirection="column" alignItems="center">
      <Stack direction="row" spacing={2} width="100%" mb={3} justifyContent="space-between">
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Back
        </Button>
        <Typography variant="h6">
          Flashcards: {index + 1} / {flashcards.length}
        </Typography>
      </Stack>

      <Card
        sx={{
          width: 400,
          height: 260,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: 4,
        }}
        onClick={handleFlip}
      >
        <CardContent
          sx={{
            textAlign: "center",
            width: "100%",
          }}
        >
          {!showBack ? (
            // 👉 FRONT: single Hanzi
            <Typography variant="h1" sx={{ fontSize: 96 }}>
              {current.hanzi}
            </Typography>
          ) : (
            // 👉 BACK: pronunciations only
            <Stack spacing={2} alignItems="center">
              <Typography variant="subtitle1" gutterBottom>
                Pronunciations
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                justifyContent="center"
                flexWrap="wrap"
              >
                {current.pronunciations.map((p, idx) => (
                  <Chip
                    key={idx}
                    label={p}
                    variant="outlined"
                  />
                ))}
              </Stack>
              {current.pronunciations.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No pronunciation data for this card.
                </Typography>
              )}
            </Stack>
          )}
        </CardContent>
      </Card>

      <Stack direction="row" spacing={2} mt={3}>
        <Button onClick={handlePrev} variant="outlined">
          Previous
        </Button>
        <Button onClick={handleNext} variant="contained">
          Next
        </Button>
      </Stack>

      <Typography variant="caption" mt={2}>
        Click the card to flip (front = Hanzi, back = pronunciations).
      </Typography>
    </Box>
  );
};

export default FlashCardsView;
