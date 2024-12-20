import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Typography, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAllItems } from "../services/inventoryService";

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    getAllItems()
      .then((response) => {
        setInventory(response.data);
        setLoading(false); // Stop loading once data is fetched
      })
      .catch((err) => {
        console.error(err);
        setLoading(false); // Stop loading even on error
      });
  }, []);

  // Define columns for the DataGrid
  const columns = [
    { field: "name", headerName: "Item Name", flex: 1 },
    { field: "condition", headerName: "Condition", flex: 1 },
    { field: "purchaseCost", headerName: "Purchase Cost", flex: 1 },
    { field: "sellingPrice", headerName: "Selling Price", flex: 1 },
    { 
      field: "dateAdded", 
      headerName: "Date Added", 
      flex: 1,
      valueGetter: (params) => {
        const date = params.row?.dateAdded; // Safeguard against undefined row
        return date ? new Date(date).toLocaleDateString() : "N/A"; // Format date or fallback
      },
    },
  ];

  // Add an ID field to rows (DataGrid requires unique row IDs)
  const rows = inventory.map((item) => ({ ...item, id: item.id })); // Use backend-provided IDs

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress size={60} />
      </div>
    );
  }

  const formatInventoryForExport = (inventory) => {
    return inventory
      .map((item, index) => {
        const { name, version, bggCondition, sellingPrice } = item;

        return `${index + 1}. ${name} (${version || "Standard Edition"}, ${bggCondition || "Unknown"}) - $${sellingPrice}`;
      })
      .join("\n");
  };

  const handleCopyToClipboard = () => {
    const formattedText = formatInventoryForExport(inventory);
    navigator.clipboard.writeText(formattedText).then(
      () => {
        alert("Inventory copied to clipboard!");
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  return (
    <div style={{ height: 600, width: "100%" }}>
      {/* Header */}
      <Typography variant="h3" gutterBottom style={{ textAlign: "center", margin: "20px 0" }}>
        Watchdog2
      </Typography>

      {/* Add New Listing Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/inventory/new")}
        
      >
        Add New Listing
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCopyToClipboard}
        style={{ marginLeft: "20px" }}
        disabled={inventory.length === 0}
      >
        Copy to Clipboard
      </Button>
      {/* DataGrid */}
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        onRowClick={(params) => navigate(`/inventory/${params.id}`)} // Navigate on row click
        disableSelectionOnClick
        sx={{ border: 0 }}
      />
    </div>
    
  );
};

export default InventoryPage;
