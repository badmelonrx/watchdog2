import { useState, useEffect } from "react";
import { getVersions, getGameInfo, searchGames } from "../services/bggService";

const useItemForm = (initialData, saveCallback) => {
  // Form state
  const [itemData, setItemData] = useState(initialData);
  const [versions, setVersions] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [markedForDeletion, setMarkedForDeletion] = useState([]);
  const [isEdited, setIsEdited] = useState(false);

  // Update a field and set form as edited
  const updateField = (field, value) => {
    setItemData((prev) => {
      if (prev[field] !== value) {
        setIsEdited(true);
      }
      return { ...prev, [field]: value };
    });
  };

  // Search games
  const handleSearchChange = async (value) => {
    try {
      const results = await searchGames(value);
      setSuggestions(results);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  // Select an item
  const handleItemSelect = async (item) => {
    try {
      const versionsData = await getVersions(item.bggId);
      const gameInfo = await getGameInfo(item.href);

      setVersions(versionsData);
      setItemData((prev) => ({
        ...prev,
        bggId: item.bggId,
        name: item.name,
        description: gameInfo.description,
        publisher: gameInfo.publishers?.[0] || "Unknown",
      }));
    } catch (error) {
      console.error("Error selecting item:", error);
    }
  };

  // Save item data
  const handleSave = async () => {
    await saveCallback(itemData, markedForDeletion);
    setIsEdited(false);
  };

  return {
    itemData,
    versions,
    suggestions,
    markedForDeletion,
    isEdited,
    updateField,
    handleSearchChange,
    handleItemSelect,
    handleSave,
    setMarkedForDeletion,
  };
};

export default useItemForm;
