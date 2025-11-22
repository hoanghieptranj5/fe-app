import { useState, useCallback, Fragment } from "react";
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
  Chip,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getRandomHanzi } from "../../services/HanziService";

// --- Types ----------------------------------------------------

interface HanziCharacter {
  character: string;
  hanViet: string;
  pinyin: string;
  cantonese: string;
  description: string | null;
}

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

  // Split at "1.", "2.", ... and remove empties
  const parts = description.split(/\d+\./).filter((p) => p.trim().length > 0);

  if (parts.length <= 1) {
    // No real numbered structure, just render as paragraph
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

  return data.value.map((character: any): HanziCharacter => ({
    character: character.id,
    hanViet: character.hanViet,
    pinyin: character.pinyin,
    cantonese: character.cantonese,
    description: character.meaningInVietnamese ?? null,
  }));
};

// --- Main Component -------------------------------------------

const HanziContainer = () => {
  const {
    data,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useQuery<HanziCharacter[], Error>({
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
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack spacing={4}>
        {/* Header + Refresh */}
        <Stack spacing={2} alignItems="center">
          <Typography variant="h3" align="center">
            Chinese Characters of the Day
          </Typography>
          <Button
            variant="contained"
            onClick={handleRefresh}
            disabled={isFetching}
            sx={{
              borderRadius: 999,
              px: 3,
              py: 1,
              fontWeight: 600,
            }}
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
        </Stack>

        {/* Cards Grid */}
        <Grid container spacing={3} justifyContent="center">
          {data?.map((character) => {
            const shortDescription = truncateDescription(character.description, 150);
            const hasLongDescription =
              (character.description?.length ?? 0) > 150;

            return (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={character.character}
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    boxShadow: 3,
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
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
                {/* Big character */}
                <Typography
                  variant="h2"
                  color="primary"
                  sx={{
                    fontFamily:
                      '"Ma Shan Zheng", "kaiti", "songti", "heiti", serif',
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
                {/* Study-focused summary row */}
                <Typography
                  variant="h6"
                  sx={{ mb: 1.5, fontWeight: 600 }}
                >
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
                  {/* Quick key info */}
                  {/* Pronunciation Chips */}
                  <Stack direction="row" spacing={1.5} flexWrap="wrap">
                    <Chip
                      label={`Pinyin: ${selectedCharacter.pinyin}`}
                      variant="outlined"
                      color="primary"
                      sx={{ fontSize: "0.9rem", borderRadius: 2 }}
                    />
                    <Chip
                      label={`Cantonese: ${selectedCharacter.cantonese}`}
                      variant="outlined"
                      color="secondary"
                      sx={{ fontSize: "0.9rem", borderRadius: 2 }}
                    />
                    <Chip
                      label={`Hán Việt: ${selectedCharacter.hanViet}`}
                      variant="outlined"
                      sx={{
                        fontSize: "0.9rem",
                        borderRadius: 2,
                        borderColor: "text.secondary",
                        color: "text.secondary",
                      }}
                    />
                  </Stack>
                </Box>

                {/* Meaning / description section */}
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ mb: 1.5, fontWeight: 600 }}
                  >
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
