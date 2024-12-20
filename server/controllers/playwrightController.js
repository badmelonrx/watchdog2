import multer from "multer";
import path from "path";
import fs from "fs";
import { bggDeleteListing } from '../playwright/bggDeleteListing.js';
import { bggCreateListing } from '../playwright/bggCreateListing.js';
import { bggUpdateListing } from '../playwright/bggUpdateListing.js';

// Configure multer to handle file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file names
  },
});

const upload = multer({ storage });

export const createListing = [
  upload.array("photos"), // Middleware to handle photos
  async (req, res) => {
    
    try {
      console.log("Received files:", req.files);
      console.log("Body payload:", req.body);
      const item = JSON.parse(req.body.itemData || "{}"); // Parse non-file data
      item.photos = req.files.map((file) => ({
        path: file.path, // Path to the uploaded file
        originalName: file.originalname,
      }));

      console.log("Creating new listing for item:", item);

      await bggCreateListing(item);
      res.status(201).json({ message: "Listing created successfully." });
    } catch (error) {
      console.error("Error creating listing:", error);
      res.status(500).json({ message: "Failed to create listing.", error: error.message });
    }
  },
];


  export const updateListing = async (req, res) => {
    try {
      const item = req.body;
  
      // Validate required fields
      if (!item.listingUrl.bgg || !item.name || !item.sellingPrice || !item.bggCondition) {
        return res.status(400).json({ message: 'Missing required fields: listingUrl, name, sellingPrice, or condition.' });
      }
  
      console.log('Updating listing for item:', item);
  
      await bggUpdateListing(item); // Call the Playwright script
      res.status(200).json({ message: 'Listing updated successfully.' });
    } catch (error) {
      console.error('Error updating listing:', error);
      res.status(500).json({ message: 'Failed to update listing.', error: error.message });
    }
  };

  export const deleteListing = async (req, res) => {
    const listingUrl = req.body.listingUrl;
    console.log(req.body.listingUrl);
    try {
        if (!listingUrl) {
            return res.status(400).json({ message: 'Missing listingUrl in request.' });
        }

        await bggDeleteListing(listingUrl);
        res.status(200).json({ message: 'Listing deleted successfully.' });
    } catch (error) {
        console.error('Error in deleteListing:', error);
        res.status(500).json({ message: 'Failed to delete listing.', error: error.message });
    }
};

export default {
    createListing,
    updateListing,
    deleteListing,
};
