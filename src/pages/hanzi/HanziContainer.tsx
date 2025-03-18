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
  DialogContent, DialogActions,
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
  // Check if description is null or undefined
  if (!description) {
    return <Typography variant="body2">No description available.</Typography>;
  }

  // Split the description based on the numbered items
  const parts = description.split(/\d+\./).filter(Boolean);  // Split at "1.", "2.", "3." etc., and remove empty parts

  // Map the parts to a formatted list
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
  const length = 20;  // You want 20 characters, as mentioned in the task

  // Call your service function to get 20 random Hanzi
  const data = await getRandomHanzi(length, token);

  // Map over the data to format it appropriately for the page
  return data.value.map((character: any) => ({
    character: character.id,               // Chinese character (id)
    hanViet: character.hanViet,            // Vietnamese meaning
    pinyin: character.pinyin,              // Pinyin pronunciation
    cantonese: character.cantonese,        // Cantonese pronunciation
    description: character.meaningInVietnamese,  // Vietnamese meaning (use as description)
  }));
};

const HanziContainer: React.FC = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["chineseCharacters"],
    queryFn: fetchChineseCharacters,
  });

  const [open, setOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);

  const handleOpenDialog = (character: any) => {
    setSelectedCharacter(character);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">Error loading data: {error.message}</Typography>;

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h3" align="center" sx={{ marginBottom: 4 }}>
        Chinese Characters of the Day
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {data && data.map((character: any) => (
          <Grid item xs={12} sm={9} md={6} lg={3} key={character.character}>
            <Card sx={{ maxWidth: 345 }}>
              <CardContent>
                <Typography variant="h2" align="center" color="primary">
                  {character.character}
                </Typography>
                <Typography variant="h6" color="text.secondary" align="center">
                  Pinyin: {character.pinyin}
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
