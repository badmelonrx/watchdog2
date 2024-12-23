import fs from 'fs';
import path from 'path';
import multer from 'multer';

// Directory for file uploads
const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `gamephoto_${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  },
});

// Multer instance with the storage configuration
const upload = multer({ storage });

// Utility functions
const deleteFile = async (filename) => {
  const filePath = path.join(uploadDir, filename);
  try {
    await fs.promises.unlink(filePath);
  } catch (err) {
    throw new Error(`Error deleting file: ${err.message}`);
  }
};

const getFilePath = (filename) => path.join(uploadDir, filename);

export { upload, deleteFile, getFilePath, storage };
