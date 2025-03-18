import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, increment, decrement, setValue } from "../../store";
import { Button, Box, Typography, TextField } from "@mui/material";

const Counter: React.FC = () => {
  const dispatch = useDispatch();
  const count = useSelector((state: RootState) => state.counter.value);

  return (
    <Box textAlign="center" sx={{ mt: 4 }}>
      <Typography variant="h4">Counter: {count}</Typography>
      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => dispatch(increment())}
          sx={{ mx: 1 }}
        >
          Increment
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => dispatch(decrement())}
          sx={{ mx: 1 }}
        >
          Decrement
        </Button>
      </Box>
      <Box sx={{ mt: 2 }}>
        <TextField
          type="number"
          label="Set Counter"
          variant="outlined"
          onChange={(e) => dispatch(setValue(Number(e.target.value)))}
        />
      </Box>
    </Box>
  );
};

export default Counter;
