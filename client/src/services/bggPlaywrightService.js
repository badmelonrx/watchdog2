import apiClient from "./axiosInstance";


/**
 * Create a BGG listing.
 * @param {Object} data - Listing data (e.g., itemId, price, condition, notes).
 * @returns {Promise<Object>} - The listing URL or error message.
 */

export const createListing = async (itemData) => {
  try {
    const response = await apiClient.post("/playwright/create", itemData);
    return response.data;
  } catch (error) {
    console.error("Error creating listing:", error.message);
    throw error;
  }
};

/**
 * Update (Relist) a BGG listing.
 * @param {Object} data - Updated listing data.
 * @returns {Promise<Object>} - Confirmation or error message.
 */
export const updateListing = async (data) => {
  try {
    const response = await apiClient.put(`/playwright/update`);
    return response.data;
  } catch (error) {
    console.error("Error updating BGG listing:", error.message);
    throw error;
  }
};

/**
 * Delete a BGG listing.
 * @param {Object} data - Data specifying the listing to delete.
 * @returns {Promise<Object>} - Confirmation or error message.
 */
export const deleteListing = async (data) => {
  try {
    const response = await apiClient.delete(`/playwright/delete`, { data });
    return response.data;
  } catch (error) {
    console.error("Error deleting BGG listing:", error.message);
    throw error;
  }
};
