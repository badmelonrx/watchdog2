import React, { useState } from "react";
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Switch,
  Typography,
  Box,
  Autocomplete,
  CircularProgress,
} from "@mui/material";

const ItemField = ({ fieldName, fieldProps, formData, setFormData }) => {
  const {
    value: defaultValue,
    inputType,
    options,
    fetchOptions,
    maxLength,
    min,
    dependsOn,
    readOnly,
    required,
  } = fieldProps;

  const [searchOptions, setSearchOptions] = useState(options || []);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const fieldValue = formData[fieldName] ?? defaultValue ?? "";

  const handleChange = (newValue) => {
    setFormData({ ...formData, [fieldName]: newValue });
  };

  const handleSearch = async (searchTerm) => {
    if (!fetchOptions) return;

    setLoadingOptions(true);
    try {
      const response = await fetch(`${fetchOptions}${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      const results = data.products.map((product) => ({
        label: product.name,
        id: product.objectid, // Store ID for further requests
      }));
      setSearchOptions(results);
    } catch (error) {
      console.error("Searchbox Fetch Error:", error);
    } finally {
      setLoadingOptions(false);
    }
  };

  const renderField = () => {
    switch (inputType) {
      case "searchbox":
        return (
          <Autocomplete
            options={searchOptions}
            getOptionLabel={(option) => (typeof option === "string" ? option : option.label || "")}
            value={fieldValue}
            onInputChange={(event, value) => handleSearch(value)}
            onChange={(event, value) => handleChange(value)} // Save selected object
            loading={loadingOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                label={fieldName}
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingOptions ? <CircularProgress size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        );

      case "dependentDropdown":
        if (dependsOn && formData[dependsOn]?.id) {
          return (
            <FormControl fullWidth disabled={readOnly}>
              <InputLabel>{fieldName}</InputLabel>
              <Select
                value={fieldValue}
                onChange={(e) => handleChange(e.target.value)}
              >
                {options?.map((option) => (
                  <MenuItem key={option.id} value={option.label}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        }
        return (
          <Typography variant="body2" sx={{ color: "gray" }}>
            Please select {dependsOn} first.
          </Typography>
        );

      // Other cases...
      default:
        return (
          <Typography variant="body2" sx={{ color: "red" }}>
            Unsupported field type: {inputType}
          </Typography>
        );
    }
  };

  return <Box mb={2}>{renderField()}</Box>;
};

export default ItemField;
