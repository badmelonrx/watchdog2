import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from "@mui/material";

import SearchAutocomplete from "../components/SearchAutocomplete";
import VersionDropdown from "../components/VersionDropdown";
import DimensionsInput from "../components/DimensionsInput";
import PhotoUploader from "../components/PhotoUploader";
import EbayFields from "../components/EbayFields";
import SelectedItemCard from "../components/SelectedItemCard";

// Services
import { searchGames, getVersions, getGameInfo } from "../services/bggService";
import { postItem } from "../services/inventoryService";
import { uploadFile, deleteFile } from "../services/fileService";

const AddItemPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(""); 
  const [photos, setPhotos] = useState([]);
  const [markedForDeletion, setMarkedForDeletion] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [versions, setVersions] = useState([]);
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
    purchaseCost: "", 
    sellingPrice: "", 
    listingURL: {
      bgg: "", 
      ebay: "", 
    },
  });  

  // Handle Changes to Form Fields
  const updateField = (field, value) => {
    setItemData((prev) => ({ ...prev, [field]: value }));
  };

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
        bggId: item.bggId, // Use bggId for the BGG ID
        name: item.name,
        yearPublished: item.yearPublished,
        imageurl: item.imageurl,
        description: gameInfo.description,
        publisher: gameInfo.publishers?.[0] || "Unknown",
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
      const uploadedPhotoIds = await Promise.all(
        photos.map(async (photo) => {
          const formData = new FormData();
          formData.append("files", photo.file)
          const response = await uploadFile(formData);
          console.log(response);
          return response.photoIds;
        })
      );

      const finalItemData = { ...itemData, photoIds: uploadedPhotoIds.flat() };
      const response = await postItem(finalItemData);
      navigate(`/inventory/${response.data.id}`);
    } catch (error) {
      console.error("Error saving item:", error.message);
    }
  };
  

  useEffect(() => {
    setItemData((prev) => ({
      ...prev,
      ebayCondition: prev.bggCondition === "New" ? "New" : "Used",
    }));
  }, [itemData.bggCondition]);
  
  useEffect(() => {
    const updateEbayFields = () => {
      const { name, versionName, ebayCondition, description, publishers } = itemData;
  
      const titleCondition = ebayCondition || "Used";
      const titlePublisher = publishers?.[0] || "Unknown Publisher";
      const ebayTitle = `${name} Board Game from ${itemData.publisher} ${titleCondition}`;
  
      const ebayDescription = [
        name,
        versionName,
        ebayCondition,
        description,
      ]
        .filter(Boolean)
        .join("\n");
  
      setItemData((prev) => ({
        ...prev,
        ebayTitle,
        ebayDescription,
      }));
    };
  
    updateEbayFields();
  }, [
    itemData.name,
    itemData.versionName,
    itemData.ebayCondition,
    itemData.description,
    itemData.publishers,
  ]);
  
  
  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" marginBottom={1}>Add Item</Typography>
          <form onSubmit={handleSubmit}>
          <SearchAutocomplete
            searchTerm={searchTerm}
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
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
            Save
          </Button>
          </form>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={6}>
          <SelectedItemCard itemData={itemData} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddItemPage;
