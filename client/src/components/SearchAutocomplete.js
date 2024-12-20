import React from "react";
import { Autocomplete, TextField } from "@mui/material";

const SearchAutocomplete = ({ searchTerm, setSearchTerm, suggestions, onSelect }) => {
  const handleInputChange = (event, value) => {
    setSearchTerm(value); // Update the search term in the parent
  };

  return (
    <Autocomplete
        freeSolo
        options={suggestions}
        getOptionLabel={(option) => (option?.name || "")} // Ensure no undefined values
        inputValue={searchTerm}
        onInputChange={(event, value) => setSearchTerm(event, value)}
        onChange={(event, newValue) => {
            if (newValue) {
            onSelect(newValue);
            }
        }}
        renderInput={(params) => (
            <TextField {...params} label="Search for an item" variant="outlined" fullWidth />
        )}
    />

  );
};

export default SearchAutocomplete;
