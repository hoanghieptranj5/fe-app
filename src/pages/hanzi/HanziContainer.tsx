import { useState, useCallback, useMemo } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getRandomHanzi } from "../../services/HanziService";
import { Flashcard, HanziCharacter } from "../../types/hanzi";
import SchoolIcon from "@mui/icons-material/School";
import RefreshIcon from "@mui/icons-material/Refresh";

import { useNavigate } from "react-router-dom";

// --- Helpers --------------------------------------------------

const truncateDescription = (text: string | null | undefined, limit: number) => {
  if (!text) return "";
  if (text.length > limit) return text.substring(0, limit) + "...";
  return text;
};

const formatDescription = (description: string | null | undefined) => {
  if (!description || !description.trim()) {
    return <Typography variant="body2">No description available.</Typography>;
  }

  const parts = description.split(/\d+\./).filter((p) => p.trim().length > 0);

  if (parts.length <= 1) {
    return (
      <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
        {description.trim()}
      </Typography>
    );
  }

  return (
    <ul style={{ paddingLeft: "1.25rem", margin: 0 }}>
      {parts.map((part, index) => (
        <li key={index}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            {`${index + 1}. ${part.trim()}`}
          </Typography>
        </li>
      ))}
    </ul>
  );
};

// --- Data Fetcher ---------------------------------------------

const fetchChineseCharacters = async (): Promise<HanziCharacter[]> => {
  const token = localStorage.getItem("token") || "";
  const length = 20;

  const data = await getRandomHanzi(length, token);

  return data.value.map(
    (character: any): HanziCharacter => ({
      character: character.id,
      hanViet: character.hanViet,
      pinyin: character.pinyin,
      cantonese: character.cantonese,
      description: character.meaningInVietnamese ?? null,
    }),
  );
};

// --- Main Component -------------------------------------------

const HanziContainer = () => {
  const { data, error, isLoading, isFetching, refetch } = useQuery<HanziCharacter[], Error>({
    queryKey: ["chineseCharacters"],
    queryFn: fetchChineseCharacters,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const [selectedCharacter, setSelectedCharacter] = useState<HanziCharacter | null>(null);

  const handleOpenDialog = useCallback((character: HanziCharacter) => {
    setSelectedCharacter(character);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setSelectedCharacter(null);
  }, []);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // -- Flashcard navigation -----------------------------------
  const navigate = useNavigate();

  // 👉 map currently displayed hanzi to flashcard payload
  const flashcards: Flashcard[] = useMemo(
    () =>
      (data ?? []).map((h: HanziCharacter) => {
        const pron: string[] = [];

        if (h.pinyin) {
          const pArr = Array.isArray(h.pinyin) ? h.pinyin : [h.pinyin];
          pron.push(`Pinyin: ${pArr.join(", ")}`);
        }

        if (h.hanViet) {
          const hvArr = Array.isArray(h.hanViet) ? h.hanViet : [h.hanViet];
          pron.push(`Hán Việt: ${hvArr.join(", ")}`);
        }

        if (h.cantonese) {
          const cArr = Array.isArray(h.cantonese) ? h.cantonese : [h.cantonese];
          pron.push(`Cantonese: ${cArr.join(", ")}`);
        }

        return {
          id: h.character,
          hanzi: h.character, // or h.character / h.word etc.
          pronunciations: pron,
        };
      }),
    [data],
  );

  const handleGoToFlashcards = () => {
    if (!flashcards.length) return;
    navigate("/flashcards", { state: { flashcards } });
  };

  // --- Loading State -----------------------------------------

  if (isLoading) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Chinese Characters of the Day
        </Typography>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress />
          <Typography variant="body1" color="text.secondary">
            Fetching fresh characters...
          </Typography>
        </Stack>
      </Box>
    );
  }

  // --- Error State -------------------------------------------

  if (error) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5" color="error" sx={{ mb: 2 }}>
          Error loading data
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          {error.message}
        </Typography>
        <Button variant="contained" onClick={handleRefresh}>
          Try Again
        </Button>
      </Box>
    );
  }

  // --- Main UI -----------------------------------------------

  return (
    <Container
      maxWidth="md"
      sx={{
        py: { xs: 4, md: 6 },
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Stack spacing={4}>
        {/* Header + Refresh */}
        <Stack direction="row" spacing={2} mb={2} justifyContent="flex-end">
          <Typography
            variant="h3"
            align="center"
            sx={{
              fontSize: {
                xs: "1.8rem",
                sm: "2.3rem",
                md: "3rem",
              },
              lineHeight: 1.2,
            }}
          >
            Chinese Characters of the Day
          </Typography>
        </Stack>
        <Stack spacing={2} alignItems="center" direction="row" justifyContent="center">
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={6} sm={4} md={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                disabled={isFetching}
              >
                {isFetching ? (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CircularProgress size={18} />
                    <span>Refreshing...</span>
                  </Stack>
                ) : (
                  "Refresh"
                )}
              </Button>
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<SchoolIcon />}
                onClick={handleGoToFlashcards}
                disabled={!flashcards.length}
              >
                Flashcards
              </Button>
            </Grid>
          </Grid>
        </Stack>

        {/* Cards Grid */}
        <Grid container spacing={{ xs: 2, sm: 3 }} justifyContent="center">
          {data?.map((character) => {
            const shortDescription = truncateDescription(character.description, 150);
            const hasLongDescription = (character.description?.length ?? 0) > 150;

            return (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={character.character}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Card
                  sx={{
                    width: "100%",
                    maxWidth: 420,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    boxShadow: 3,
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                    "&:hover": {
                      transform: { md: "translateY(-4px)" },
                      boxShadow: { md: 6 },
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h2"
                      align="center"
                      color="primary"
                      sx={{
                        mb: 1,
                        fontFamily: '"Ma Shan Zheng", "kaiti", "songti", "heiti", serif',
                        fontSize: {
                          xs: "2.5rem",
                          sm: "3rem",
                          md: "3.5rem",
                        },
                        lineHeight: 1.1,
                      }}
                    >
                      {character.character}
                    </Typography>

                    <Stack spacing={0.5} sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" align="center" color="text.secondary">
                        <strong>Pinyin:</strong> {character.pinyin}
                      </Typography>
                      <Typography variant="subtitle1" align="center" color="text.secondary">
                        <strong>Cantonese:</strong> {character.cantonese}
                      </Typography>
                      <Typography variant="subtitle1" align="center" color="text.secondary">
                        <strong>Hán Việt:</strong> {character.hanViet}
                      </Typography>
                    </Stack>

                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>Description:</strong>{" "}
                      {shortDescription || "No description available."}
                    </Typography>
                  </CardContent>

                  {hasLongDescription && (
                    <Box sx={{ textAlign: "center", pb: 2 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleOpenDialog(character)}
                      >
                        Show More
                      </Button>
                    </Box>
                  )}
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Stack>

      {/* Dialog for full description */}
      <Dialog
        open={!!selectedCharacter}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
          },
        }}
      >
        {selectedCharacter && (
          <>
            <DialogTitle
              sx={{
                px: 4,
                pt: 3,
                pb: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
              >
                <Typography
                  variant="h2"
                  color="primary"
                  sx={{
                    fontFamily: '"Ma Shan Zheng", "kaiti", "songti", "heiti", serif',
                    lineHeight: 1,
                  }}
                >
                  {selectedCharacter.character}
                </Typography>
              </Stack>
            </DialogTitle>

            <DialogContent
              dividers
              sx={{
                px: 4,
                py: 3,
                maxHeight: "65vh",
              }}
            >
              <Stack spacing={3}>
                {/* Pronunciations */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
                    Pronunciations
                  </Typography>

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "background.default",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Stack spacing={1.5}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 2,
                          flexWrap: "wrap",
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ minWidth: 90, fontWeight: 600 }}>
                          Pinyin
                        </Typography>
                        <Typography variant="body2" sx={{ flex: 1, textAlign: "right" }}>
                          {selectedCharacter.pinyin || "—"}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 2,
                          flexWrap: "wrap",
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ minWidth: 90, fontWeight: 600 }}>
                          Cantonese
                        </Typography>
                        <Typography variant="body2" sx={{ flex: 1, textAlign: "right" }}>
                          {selectedCharacter.cantonese || "—"}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 2,
                          flexWrap: "wrap",
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ minWidth: 90, fontWeight: 600 }}>
                          Hán Việt
                        </Typography>
                        <Typography variant="body2" sx={{ flex: 1, textAlign: "right" }}>
                          {selectedCharacter.hanViet || "—"}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Box>

                {/* Meaning */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
                    Meaning & Notes
                  </Typography>

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "background.paper",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    {formatDescription(selectedCharacter.description)}
                  </Box>
                </Box>
              </Stack>
            </DialogContent>

            <DialogActions
              sx={{
                px: 4,
                py: 2,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default HanziContainer;
