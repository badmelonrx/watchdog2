import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();
const storageLocation = "data/images";

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), storageLocation); // Use `process.cwd()` for ES modules
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `gamephoto_${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// POST /api/files - Upload multiple files
router.post("/", upload.array("files"), (req, res) => {
  try {
    // Collect filenames of all uploaded files
    const savedFileNames = req.files.map((file) => file.filename);
    res.json({ photoIds: savedFileNames }); // Return an array of photo IDs (filenames)
  } catch (error) {
    console.error("Error uploading files:", error);
    res.status(500).send("Error uploading files.");
  }
});

// GET /api/files/:photoId - Retrieve a file
router.get("/:photoId", (req, res) => {
  const photoId = req.params.photoId;
  const filePath = path.join(process.cwd(), storageLocation, photoId); // Corrected to use `storageLocation`

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send("File not found.");
  }
});

router.delete("/:photoId", (req, res) => {
  const photoId = req.params.photoId;
  const filePath = path.join(process.cwd(), "data/images", photoId);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath); // Remove the file
    res.status(200).json({ message: "File deleted successfully." });
  } else {
    res.status(404).json({ error: "File not found." });
  }
});


export default router;
