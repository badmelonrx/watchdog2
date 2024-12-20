import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const VersionDropdown = ({ versions, selectedVersion, onChange }) => (
  <FormControl fullWidth sx={{ mt: 3 }}>
    <InputLabel id="version-label">Version</InputLabel>
    <Select
      labelId="version-label"
      value={selectedVersion || ""}
      onChange={(event) => {
        onChange(event.target.value); // Call the handler with the value
      }}
      
      label="Version"
    >
      <MenuItem value="">
        <em>Select a version</em>
      </MenuItem>
      {versions.map((version) => (
        <MenuItem key={version.versionId} value={version.versionId}>
          {version.name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default VersionDropdown;
