import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Grid,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";

import SearchAutocomplete from "../components/SearchAutocomplete";
import VersionDropdown from "../components/VersionDropdown";
import DimensionsInput from "../components/DimensionsInput";
import PhotoUploader from "../components/PhotoUploader";
import SelectedItemCard from "../components/SelectedItemCard";
import EbayFields from "../components/EbayFields";
import ListingCard from "../components/ListingCard";

// Services
import { getItemById, putItem } from "../services/inventoryService";
import { searchGames, getVersions, getGameInfo } from "../services/bggService";
import { uploadFile, deleteFile, getFileUrl } from "../services/fileService";

const EditItemPage = () => {
  const { id } = useParams(); // Get the item ID from the URL
  const navigate = useNavigate();

  // State Variables
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [versions, setVersions] = useState([]);
  const [markedForDeletion, setMarkedForDeletion] = useState([]);
  const [isEdited, setIsEdited] = useState(false);
  const [photos, setPhotos] = useState([]);

  // Item Data in the Target Format
  const [itemData, setItemData] = useState({
    bggId: "",
    versionId: "",
    versionName: "",
    versionYear: "",
    imageurl: "",
    name: "",
    description: "",
    dimensions: { length: "", width: "", depth: "" },
    yearPublished: "",
    bggCondition: "",
    bggNotes: "",
    ebayTitle: "",
    ebayCondition: "Used",
    ebayBrand: "",
    ebayDescription: "",
    photoIds: [],
    publisher: "",
    bggListingURL:"",
    purchaseCost: "", 
    sellingPrice: "", 
    listingURL: {
      bgg: "", 
      ebay: "", 
    },
  });

  // Fetch Item Details on Load
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await getItemById(id); // Fetch item data from the backend
        const data = response.data;
  
        const existingPhotos = (data.photoIds || []).map((photoId) => ({
          photoId,
          isServerPhoto: true,
          preview: getFileUrl(photoId), // Generate server photo URL
        }));
  
        setPhotos(existingPhotos); // Initialize photos with server photos
  
        setItemData({
          id: data.id,
          bggId: data.bggId,
          versionId: data.versionId,
          versionName: data.versionName,
          versionYear: data.versionYear,
          imageurl: data.imageurl,
          publisher: data.publisher,
          name: data.name,
          description: data.description,
          dimensions: data.dimensions || { length: "", width: "", depth: "" },
          yearPublished: data.yearPublished,
          bggCondition: data.bggCondition,
          bggNotes: data.bggNotes,
          ebayTitle: data.ebayTitle,
          ebayCondition: data.ebayCondition || "Used",
          ebayBrand: data.ebayBrand,
          ebayDescription: data.ebayDescription,
          photoIds: data.photoIds || [],
          purchaseCost: data.purchaseCost || "",
          sellingPrice: data.sellingPrice || "",
          listingURL: {
            bgg: data.listingURL.bgg,
            ebay: data.listingURL.ebay,
          },
        });
  
        if (data.bggId) {
          const versionsData = await getVersions(data.bggId);
          const normalizedVersions = versionsData.map((version) => ({
            versionId: version.versionId,
            name: version.name,
          }));
          setVersions(normalizedVersions);
        }
      } catch (error) {
        console.error("Error fetching item details:", error.message);
      }
    };
  
    fetchItem();
  }, []);  
  

   // Fetch Images on Load
  useEffect(() => {
    if (itemData.photoIds?.length > 0) {
      // Create previews for existing photos
      const existingPreviews = itemData.photoIds.map((photoId) => ({
        photoId, // Retain the ID for deletion or other actions
        preview: getFileUrl(photoId), // Generate the URL
        isServerPhoto: true, // Flag as an existing server photo
      }));
      setPhotos(existingPreviews); // Merge with local photos if needed
    }
  }, [itemData.photoIds]);
  
  // Form Field Update Handler
  const updateField = (field, value) => {
    setItemData((prev) => {
      if (prev[field] !== value) {
        setIsEdited(true);
      }
      return { ...prev, [field]: value };
    });
  };

  useEffect(() => {
    const hasUnsavedPhotos = photos.some((photo) => !photo.isServerPhoto);
    const hasMarkedForDeletion = markedForDeletion.length > 0;
    setIsEdited(hasUnsavedPhotos || hasMarkedForDeletion);
  }, [photos, markedForDeletion]);

  // Handle Search and Selection
  const handleSearchChange = async (event, value) => {
    setSearchTerm(value);

    if (value.trim().length > 0) {
      try {
        const results = await searchGames(value);
        setSuggestions(results);
      } catch (error) {
        console.error("Error fetching suggestions:", error.message);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleItemSelect = async (item) => {
    try {
      const versionsData = await getVersions(item.bggId);
      const gameInfo = await getGameInfo(item.href);

      setVersions(versionsData);

      setItemData((prev) => ({
        ...prev,
        bggId: item.bggId,
        name: item.name,
        yearPublished: item.yearPublished,
        imageurl: item.imageurl,
        description: gameInfo.description,
      }));
    } catch (error) {
      console.error("Error fetching item details:", error.message);
    }
  };

  const handleVersionChange = (versionId) => {
    const selected = versions.find((version) => version.versionId === versionId);

    if (selected) {
      setItemData((prev) => ({
        ...prev,
        versionId: selected.versionId,
        versionName: selected.name,
        versionYear: selected.year,
        dimensions: selected.dimensions || { length: "", width: "", depth: "" },
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      // Upload new photos and update `isServerPhoto` immediately
      const updatedPhotos = await Promise.all(
        photos.map(async (photo) => {
          if (!photo.isServerPhoto) {
            const formData = new FormData();
            formData.append("files", photo.file);
            const response = await uploadFile(formData);
  
            return {
              ...photo,
              photoId: response.photoIds[0], // Use returned ID
              isServerPhoto: true, // Mark as server photo immediately
            };
          }
          return photo; // No changes for already server photos
        })
      );
  
      // Update the `photoIds` in `itemData`
      const finalPhotoIds = updatedPhotos.map((photo) => photo.photoId);
  
      // Prepare item data with updated photo IDs
      const finalItemData = { ...itemData, photoIds: finalPhotoIds };
  
      // Save updated data via PUT
      await putItem(itemData.id, finalItemData);
  
      // Delete marked photos
      await Promise.all(
        markedForDeletion.map((photoId) => deleteFile(photoId))
      );
  
      // Reset state
      setPhotos(updatedPhotos); // Replace the entire photos array
      setMarkedForDeletion([]);
      setIsEdited(false);
    } catch (error) {
      console.error("Error saving item:", error.message);
    }
  };
  
  
  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" marginBottom={1}>Edit Item</Typography>
          <form onSubmit={handleSubmit}>
            <SearchAutocomplete
              searchTerm={itemData.name}
              setSearchTerm={handleSearchChange}
              suggestions={suggestions}
              onSelect={handleItemSelect}
            />
            <VersionDropdown
              versions={versions}
              selectedVersion={itemData.versionId}
              onChange={handleVersionChange}
            />
            <FormControl fullWidth sx={{ mt: 3 }}>
              <InputLabel>BGG Condition</InputLabel>
              <Select
                value={itemData.bggCondition}
                onChange={(e) => updateField("bggCondition", e.target.value)}
                label="BGG Condition"
              >
                {["New", "Like New", "Very Good", "Good", "Acceptable"].map((condition) => (
                  <MenuItem key={condition} value={condition}>
                    {condition}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
            label="Purchase Cost"
            variant="outlined"
            fullWidth
            type="number"
            value={itemData.purchaseCost}
            onChange={(e) => updateField("purchaseCost", Number(e.target.value))}
            sx={{ mt: 3 }}
          />
          <TextField
            label="Selling Price"
            variant="outlined"
            fullWidth
            type="number"
            value={itemData.sellingPrice}
            onChange={(e) => updateField("sellingPrice", Number(e.target.value))}
            sx={{ mt: 3 }}
          />
            <TextField
              label="BGG Notes"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={itemData.bggNotes}
              onChange={(e) => updateField("bggNotes", e.target.value)}
              sx={{ mt: 3 }}
            />
            <PhotoUploader
              photos={photos}
              setPhotos={setPhotos}
              markedForDeletion={markedForDeletion}
              setMarkedForDeletion={setMarkedForDeletion}
            />

            <EbayFields
              ebayTitle={itemData.ebayTitle}
              setEbayTitle={(value) => updateField("ebayTitle", value)}
              ebayCondition={itemData.ebayCondition}
              setEbayCondition={(value) => updateField("ebayCondition", value)}
              ebayBrand={itemData.publisher}
              setEbayBrand={(value) => updateField("ebayBrand", value)}
              ebayDescription={itemData.ebayDescription}
              setEbayDescription={(value) => updateField("ebayDescription", value)}
            />
            <DimensionsInput
              dimensions={itemData.dimensions}
              setDimensions={(value) => updateField("dimensions", value)}
            />
            <Button disabled={!isEdited} type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 } }>
              Save
            </Button>
          </form>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={6}>
          <SelectedItemCard itemData={itemData} />
          <ListingCard disabled={isEdited} platform="BGG" itemData={itemData} onUpdate={setItemData} />
          <ListingCard disabled={isEdited} platform="eBay" itemData={itemData} onUpdate={setItemData} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditItemPage;