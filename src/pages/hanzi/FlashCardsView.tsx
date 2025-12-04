// src/pages/FlashCardsView.tsx
import React, { useState } from "react";
import {
  Box,
  Button,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import type { Flashcard } from "../../types/hanzi";
import { GlassyCard } from "../../components/glassyCard/GlassyCard";

interface LocationState {
  flashcards?: Flashcard[];
}

// ===== styled =====

const Page = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(4),
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(10),
  background:
    theme.palette.mode === "dark"
      ? "radial-gradient(circle at top left, #1e293b 0, #020617 42%, #000 100%)"
      : "linear-gradient(135deg, #f5f7fa, #e6efff)",
}));

const FlipWrapper = styled(Box)(({ theme }) => ({
  perspective: 1000,
  marginBottom: theme.spacing(3),
}));

const FlipInner = styled(Box)<{ $flipped: boolean }>(({ $flipped }) => ({
  position: "relative",
  width: 420,
  maxWidth: "80vw",
  height: 280,
  transformStyle: "preserve-3d",
  transition: "transform 0.6s",
  transform: $flipped ? "rotateY(180deg)" : "rotateY(0deg)",
  cursor: "pointer",
}));

const FlipFace = styled(GlassyCard)(() => ({
  position: "absolute",
  inset: 0,
  backfaceVisibility: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 24,
}));

const FlipBackFace = styled(FlipFace)(() => ({
  transform: "rotateY(180deg)",
}));

const HintText = styled(Typography)(() => ({
  opacity: 0.65,
  marginTop: 8,
}));

// ===== component =====

const FlashCardsView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const flashcards = state?.flashcards ?? [];

  const [index, setIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);

  if (!flashcards.length) {
    return (
      <Page>
        <GlassyCard sx={{ maxWidth: 480, width: "100%", textAlign: "center", py: 4 }}>
          <Typography variant="h5" gutterBottom>
            No flashcards loaded
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
            Go back to the Hanzi list and start flashcard practice from there.
          </Typography>
          <Button variant="outlined" onClick={() => navigate("/hanzi")}>
            Back to Hanzi List
          </Button>
        </GlassyCard>
      </Page>
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
    <Page>
      {/* Header row */}
      <Stack
        direction="row"
        spacing={2}
        width="100%"
        maxWidth={600}
        mb={3}
        justifyContent="space-between"
        alignItems="center"
      >
        <Button variant="outlined" size="small" onClick={() => navigate(-1)}>
          Back
        </Button>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Flashcards: {index + 1} / {flashcards.length}
        </Typography>
      </Stack>

      {/* Flip wrapper */}
      <FlipWrapper onClick={handleFlip}>
        <FlipInner $flipped={showBack}>
          {/* FRONT */}
          <FlipFace>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: 104,
                  fontFamily: `"Kaiti SC","STKaiti","KaiTi","DFKai-SB","Noto Serif SC","Noto Serif CJK SC","serif"`,
                  letterSpacing: 2,
                  color: "rgba(191,219,254,0.98)",
                  textShadow: "0 0 32px rgba(59,130,246,0.9)",
                }}
              >
                {current.hanzi}
              </Typography>
              <HintText variant="caption">Tap to flip</HintText>
            </CardContent>
          </FlipFace>

          {/* BACK */}
          <FlipBackFace>
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
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
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
                    size="small"
                    variant="outlined"
                    sx={{
                      borderRadius: 999,
                      borderColor: "rgba(148,163,184,0.7)",
                      color: "rgba(226,232,240,0.95)",
                    }}
                  />
                ))}
              </Stack>

              {current.pronunciations.length === 0 && (
                <Typography variant="body2" sx={{ opacity: 0.7, mt: 1 }}>
                  No pronunciation data.
                </Typography>
              )}

              <HintText variant="caption">Tap to flip back</HintText>
            </CardContent>
          </FlipBackFace>
        </FlipInner>
      </FlipWrapper>

      {/* Controls */}
      <Stack direction="row" spacing={2} mt={1}>
        <Button onClick={handlePrev} variant="outlined">
          Previous
        </Button>
        <Button onClick={handleNext} variant="contained">
          Next
        </Button>
      </Stack>
    </Page>
  );
};

export default FlashCardsView;
