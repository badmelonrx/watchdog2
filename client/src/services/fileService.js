import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

/**
 * Upload a file to the server.
 * @param {File} file - The file to upload.
 * @returns {Promise<Object>} - The response data containing photo IDs.
 */
export const uploadFile = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE}/files`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error uploading file:", error.message);
    throw new Error("File upload failed.");
  }
};

/**
 * Get the URL of a file stored on the server.
 * @param {string} photoId - The unique ID of the photo.
 * @returns {string} - The URL to access the photo.
 */
export const getFileUrl = (photoId) => {
  return `${API_BASE}/files/${photoId}`;
};

/**
 * Delete a file from the server.
 * @param {string} photoId - The unique ID of the photo to delete.
 * @returns {Promise<void>} - Resolves when the deletion is successful.
 */
export const deleteFile = async (photoId) => {
  try {
    await axios.delete(`${API_BASE}/files/${photoId}`);
  } catch (error) {
    console.error("Error deleting file:", error.message);
    throw new Error("File deletion failed.");
  }
};
