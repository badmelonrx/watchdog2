import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InventoryPage from "./pages/InventoryPage";
import AddItemPage from "./pages/AddItemPage";
import EditItemPage from "./pages/EditItemPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InventoryPage />} />
        <Route path="/inventory/new" element={<AddItemPage />} />
        <Route path="/inventory/:id" element={<EditItemPage />} />
      </Routes>
    </Router>
  );
};

export default App;
