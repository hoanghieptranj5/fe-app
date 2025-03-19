import React, { useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getRandomHanzi } from "../../services/HanziService"; // Import the service

// Function to truncate long descriptions
const truncateDescription = (text: string, limit: number) => {
  if (text.length > limit) {
    return text.substring(0, limit) + "...";
  }
  return text;
};

// Function to format the description for readability
const formatDescription = (description: string | null | undefined) => {
  if (!description) {
    return <Typography variant="body2">No description available.</Typography>;
  }

  const parts = description.split(/\d+\./).filter(Boolean);  // Split at "1.", "2.", "3." etc., and remove empty parts

  return (
    <ul>
      {parts.map((part, index) => (
        <li key={index}>
          <Typography variant="body2">{` ${index + 1}. ${part.trim()}`}</Typography>
        </li>
      ))}
    </ul>
  );
};

// Fetch Chinese characters from the backend using the service function
const fetchChineseCharacters = async () => {
  const token = localStorage.getItem("token") || "";  // Assume token is stored in localStorage
  const length = 20;

  const data = await getRandomHanzi(length, token);

  return data.value.map((character: any) => ({
    character: character.id,
    hanViet: character.hanViet,
    pinyin: character.pinyin,
    cantonese: character.cantonese,
    description: character.meaningInVietnamese,
  }));
};

const HanziContainer: React.FC = () => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["chineseCharacters"],
    queryFn: fetchChineseCharacters,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const [open, setOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleOpenDialog = (character: any) => {
    setSelectedCharacter(character);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true); // Indicate refresh is in progress
    await refetch(); // Trigger the refetching of data manually
    setRefreshing(false); // Reset the refreshing state after the refetch
  };

  if (isLoading) {
    return (
      <Box sx={{ padding: 4, textAlign: "center" }}>
        <Typography variant="h3" sx={{ marginBottom: 4 }}>
          Chinese Characters of the Day
        </Typography>
        <Box sx={{ textAlign: "center", marginBottom: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRefresh}
            sx={{
              borderRadius: "50px", // Rounded button
              padding: "10px 20px",
              fontWeight: "bold",
              position: "relative",
              transition: "transform 0.2s ease, background-color 0.3s ease", // Add transition
              "&:hover": {
                transform: "scale(1.1)", // Slight grow on hover
                backgroundColor: "#1976d2", // Darker color on hover
              },
              "&:active": {
                transform: "scale(1)", // Reset size on click
              },
            }}
          >
            <CircularProgress size={24} sx={{ color: "white" }} /> {/* Loading spinner */}
            {"Now Loading..."}
          </Button>
        </Box>
      </Box>
    );
  }

  if (error) return <Typography color="error">Error loading data: {error.message}</Typography>;

  return (
    <Box sx={{ padding: 4, marginBottom: 8 }}>
      <Typography variant="h3" align="center" sx={{ marginBottom: 4 }}>
        Chinese Characters of the Day
      </Typography>

      {/* Refresh Button */}
      <Box sx={{ textAlign: "center", marginBottom: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleRefresh}
          sx={{
            borderRadius: "50px", // Rounded button
            padding: "10px 20px",
            fontWeight: "bold",
            position: "relative",
            transition: "transform 0.2s ease, background-color 0.3s ease", // Add transition
            "&:hover": {
              transform: "scale(1.1)", // Slight grow on hover
              backgroundColor: "#1976d2", // Darker color on hover
            },
            "&:active": {
              transform: "scale(1)", // Reset size on click
            },
          }}
        >
          {refreshing ? (
            <CircularProgress size={24} sx={{ color: "white" }} /> // Show a loading spinner while refreshing
          ) : (
            "Refresh"
          )}
        </Button>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {data && data.map((character: any) => (
          <Grid item xs={12} sm={9} md={6} lg={3} key={character.character}>
            <Card sx={{ maxWidth: 380, minHeight: 380, marginTop: 4 }}>
              <CardContent>
                <Typography variant="h2" align="center" color="primary">
                  {character.character}
                </Typography>
                <Typography variant="h6" color="text.secondary" align="center">
                  <strong>Pinyin</strong>: {character.pinyin}
                </Typography>
                <Typography variant="h6" color="text.secondary" align="center">
                  <strong>Cantonese:</strong> {character.cantonese}
                </Typography>
                <Typography variant="h6" color="text.secondary" align="center">
                  <strong>Hán Việt:</strong> {character.hanViet}
                </Typography>
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                  <strong>Description:</strong> {truncateDescription(character.description, 150)}
                </Typography>
              </CardContent>
              <Box sx={{ textAlign: "center", marginBottom: 2 }}>
                {character.description.length > 150 && (
                  <Button variant="outlined" size="small" onClick={() => handleOpenDialog(character)}>
                    Show More
                  </Button>
                )}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog for full description */}
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h3" color="primary" fontFamily="kaiti, songti, heiti">
            {selectedCharacter?.character}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" color="secondary">
            Pinyin: {selectedCharacter?.pinyin}
          </Typography>
          <Typography variant="body1" color="secondary">
            Cantonese: {selectedCharacter?.cantonese}
          </Typography>
          <Typography variant="body1" color="secondary">
            Hán Việt: {selectedCharacter?.hanViet}
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            <strong>Description:</strong> {formatDescription(selectedCharacter?.description)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HanziContainer;
