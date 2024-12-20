import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

/**
 * @param {string} searchTerm - The search term for the board game.
 * @returns {Promise<Array>} - A list of games with `name` and `id` fields.
 */
export const searchGames = async (searchTerm) => {
  try {
    const response = await axios.get(`${API_BASE}/bgg/search`, {
      params: { q: searchTerm },
    });

    // Flatten the response to extract the `items` array
    const items = response.data.items || [];
    return items.map((item) => ({
      bggId: item.objectid, 
      name: item.name,   
      yearPublished: item.yearpublished || "Year Unknown", 
      imageurl: item.imageurl || "", 
      href: item.href
    }));
  } catch (error) {
    console.error("Error getting items:", error.message);
    return [];
  }
};

/**
 * @param {string} objectId - The object ID of the board game.
 * @returns {Promise<Array>} - A list of versions with `name` and `id` fields.
 */
export const getVersions = async (objectId) => {
  try {
    const response = await axios.get(`${API_BASE}/bgg/versions`, {
      params: { objectId: encodeURIComponent(objectId) },
    });
    const versions = response.data?.versions || [];
    return versions.map((version) => ({
      versionId: version.objectid,
      name: version.name,
      dimensions: version.dimensions,
      year: version.yearpublished
    }));
  } catch (error) {
    console.error("Error getting versions:", error.message);
    throw new Error("Failed to get versions.");
  }
};

/**
 * Get detailed game info by ID.
 * @param {string} gameId - The ID of the game.
 * @returns {Promise<Object>} - The game info (e.g., description).
 */
export const getGameInfo = async (href) => {
  try {
    const response = await axios.get(`${API_BASE}/bgg/game-info`, {
      params: { href: encodeURIComponent(href) },
    });
    return response.data; // Passes back the parsed game info from the backend
  } catch (error) {
    console.error("Error getting game info:", error.message);
    throw new Error("Failed to get game info.");
  }
};
