import React from "react";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const PhotoUploader = ({ photos, setPhotos, markedForDeletion, setMarkedForDeletion }) => {
  const handlePhotoSelection = (event) => {
    const files = Array.from(event.target.files);
  
    if (files.length > 0) {
      const newPhotos = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        isServerPhoto: false,
      }));
  
      setPhotos((prev) => [...prev, ...newPhotos]); // Add new photos to the state
    }
  };
  
  const handleMarkForDeletion = (index) => {
    const photo = photos[index];

    if (photo.isServerPhoto) {
      // Add server photo ID to the markedForDeletion array
      setMarkedForDeletion((prev) => [...prev, photo.photoId]);
    }

    // Remove photo from the photos array
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6">Photos</Typography>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handlePhotoSelection}
        style={{ marginBottom: "1rem" }}
      />
      <Grid container spacing={2}>
        {photos.map((photo, index) => (
          <Grid item key={index} sx={{ position: "relative" }}>
          <img
            src={photo.preview} // Use `preview` for display
            alt={`Photo ${index + 1}`}
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
          />
            <IconButton
              size="small"
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "white",
              }}
              onClick={() => handleMarkForDeletion(index)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PhotoUploader;