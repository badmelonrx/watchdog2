import React from "react";
import { Card, CardMedia, CardContent, Typography } from "@mui/material";

const SelectedItemCard = ({ itemData }) => {
  // Check if itemData contains enough information to render
  if (!itemData || !itemData.name) {
    return null; // Don't render the card if no item is selected
  }

  return (
    <Card sx={{ display: "flex", alignItems: "center", p: 2, mb: 2 }}>
      <CardMedia
        component="img"
        sx={{ width: 100, height: 100, borderRadius: 1 }}
        image={itemData.imageurl || "https://via.placeholder.com/100"} // Fallback image
        alt={itemData.name}
      />
      <CardContent>
        <Typography variant="h6">{itemData.name || "Unnamed Item"}</Typography>
        <Typography variant="body2" color="textSecondary">
          Version: {itemData.versionName || ""}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Year Published: {itemData.yearPublished || "Unknown Year"}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SelectedItemCard;
