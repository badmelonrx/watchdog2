import React from "react";
import { TextField, FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";

const EbayFields = ({ ebayTitle, setEbayTitle, ebayCondition, setEbayCondition, ebayBrand, setEbayBrand, ebayDescription, setEbayDescription }) => (
  <Box sx={{ mt: 3 }}>
    <TextField
      label="eBay Title"
      variant="outlined"
      fullWidth
      value={ebayTitle}
      onChange={(e) => setEbayTitle(e.target.value)}
      sx={{ mt: 3 }}
    />
    <FormControl fullWidth sx={{ mt: 3 }}>
      <InputLabel id="ebay-condition-label">eBay Condition</InputLabel>
      <Select
        labelId="ebay-condition-label"
        value={ebayCondition}
        onChange={(e) => setEbayCondition(e.target.value)}
        label="eBay Condition"
      >
        <MenuItem value="New">New</MenuItem>
        <MenuItem value="Used">Used</MenuItem>
      </Select>
    </FormControl>
    <TextField
      label="Ebay Brand"
      variant="outlined"
      fullWidth
      value={ebayBrand}
      onChange={(e) => setEbayBrand(e.target.value)}
      sx={{ mt: 3 }}
    />
    <TextField
      label="Ebay Description"
      variant="outlined"
      fullWidth
      multiline
      rows={4}
      value={ebayDescription}
      onChange={(e) => setEbayDescription(e.target.value)}
      sx={{ mt: 3 }}
    />
  </Box>
);

export default EbayFields;
