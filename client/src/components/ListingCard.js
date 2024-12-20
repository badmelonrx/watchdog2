import React from "react";
import { Card, CardHeader, CardContent, Button, Grid, Typography } from "@mui/material";
import { createListing, updateListing, deleteListing } from "../services/bggPlaywrightService";
import { putItem } from "../services/inventoryService";

// Action Labels for Each Platform
const platformActions = {
  BGG: [
    { key: "List", label: "List" },
    { key: "Update", label: "Update" },
    { key: "Delete", label: "Delete" },
  ],
  eBay: [
    { key: "CreateAuction", label: "Create Auction" },
    { key: "UpdateListing", label: "Update Listing" },
    { key: "RemoveListing", label: "Remove Listing" },
  ],
};

// Centralized Handlers
const actionHandlers = {
  BGG: {
    List: async (itemData, onUpdate) => {
      await putItem(itemData.id, itemData); 
      const response = await createListing(itemData);
      const updatedItem = { ...itemData, listingURL: { ...itemData.listingURL, bgg: response.listingUrl } };
      onUpdate(updatedItem);
      await putItem(updatedItem.id, itemData); 
      alert("BGG listing created successfully!");
    },
    Relist: async (itemData, onUpdate) => {
      await putItem(itemData.id, itemData); 
      await deleteListing({ listingUrl: itemData.listingURL.bgg });
      const response = await createListing(itemData);
      const updatedItem = { ...itemData, listingURL: { ...itemData.listingURL, bgg: response.listingUrl } };
      onUpdate(updatedItem);
      await putItem(updatedItem.id, itemData); 
      alert("BGG listing relisted successfully!");
    },
    Update: async (itemData, onUpdate) => {
      await putItem(itemData.id, itemData); 
      const response = await updateListing(itemData);
      const updatedItem = { ...itemData, listingURL: { ...itemData.listingURL, bgg: response.listingUrl } };
      onUpdate(updatedItem);
      await putItem(updatedItem.id, itemData); 
      alert("BGG listing updated successfully!");
    },
    Delete: async (itemData, onUpdate) => {
      await putItem(itemData); // Pre-validate
      await deleteListing({ listingUrl: itemData.listingURL.bgg });
      const updatedItem = { ...itemData, listingURL: { ...itemData.listingURL, bgg: "" } };
      onUpdate(updatedItem);
      await putItem(updatedItem.id, itemData); 
      alert("BGG listing deleted successfully!");
    },
  },
  eBay: {
    "CreateAuction": () => alert("Creating an auction on eBay is not yet implemented."),
    "UpdateListing": () => alert("Updating an eBay listing is not yet implemented."),
    "RemoveListing": () => alert("Removing an eBay listing is not yet implemented."),
  },
};

const ListingCard = ({ platform, itemData, onUpdate, disabled }) => {
  const handleAction = async (action) => {
    try {
      const handler = actionHandlers[platform]?.[action];
      if (handler) {
        await handler(itemData, onUpdate);
      } else {
        console.error(`No handler defined for action: ${action}`);
      }
    } catch (error) {
      console.error(`Error performing ${action} on ${platform}:`, error.message);
      alert(`Failed to ${action.toLowerCase()} the listing on ${platform}.`);
    }
  };

  // Determine the URL for the current platform
  const listingURL = itemData.listingURL?.[platform.toLowerCase()];

  // Modify List Button Behavior
  const modifiedPlatformActions = platformActions[platform].map((action) => {
    if (platform === "BGG" && action.key === "List") {
      return listingURL ? { ...action, key: "Relist", label: "Relist" } : action;
    }
    return action;
  });

  // Determine button states based on platform-specific conditions
  const isDisabled = (key) => {
    if (platform === "BGG" && ["Update", "Delete"].includes(key)) {
      return !listingURL; // Disable Update/Delete if no listing URL
    }
    return disabled; // Default disabled state
  };

  return (
    <Card sx={{ mt: 3 }}>
      <CardHeader title={`${platform} Actions`} />
      <CardContent>
        {listingURL && (
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            <strong>Listing URL:</strong>{" "}
            <a href={listingURL} target="_blank" rel="noopener noreferrer">
              {listingURL}
            </a>
          </Typography>
        )}
        <Grid container spacing={2}>
          {modifiedPlatformActions.map(({ key, label }) => (
            <Grid item xs={4} key={key}>
              <Button
                variant="outlined"
                color={platform === "BGG" ? "primary" : "secondary"}
                fullWidth
                onClick={() => handleAction(key)}
                disabled={isDisabled(key)}
                sx={{
                  backgroundColor: key === "List" && label === "List" ? "green" : "inherit",
                  color: key === "List" && label === "List" ? "white" : "inherit",
                }}
              >
                {label}
              </Button>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ListingCard;
