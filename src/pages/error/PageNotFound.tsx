import React from "react";
import { Button, Typography, Box } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useNavigate } from "react-router-dom";
import './PageNotFound.scss'; // Import SCSS styles

const PageNotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Box className="page-not-found">
      <Box className="content">
        <ErrorOutlineIcon className="error-icon" />
        <Typography variant="h1" className="title">
          404
        </Typography>
        <Typography variant="h4" className="description">
          Whoops! We couldn't find the page you're looking for.
        </Typography>
        <Button variant="contained" className="home-button" onClick={handleGoHome}>
          Take Me Home
        </Button>
      </Box>
    </Box>
  );
};

export default PageNotFound;
