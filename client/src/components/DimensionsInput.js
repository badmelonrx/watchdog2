import React from "react";
import { Grid, TextField, Typography, Box } from "@mui/material";

const DimensionsInput = ({ dimensions, setDimensions }) => (
  <Box sx={{ mt: 3 }}>
    <Typography variant="h6" marginBottom={1}>Dimensions (inches)</Typography>
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <TextField
          label="Length"
          variant="outlined"
          fullWidth
          type="number"
          value={dimensions.length}
          onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          label="Width"
          variant="outlined"
          fullWidth
          type="number"
          value={dimensions.width}
          onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          label="Depth"
          variant="outlined"
          fullWidth
          type="number"
          value={dimensions.depth}
          onChange={(e) => setDimensions({ ...dimensions, depth: e.target.value })}
        />
      </Grid>
    </Grid>
  </Box>
);

export default DimensionsInput;
