import { deleteFile, getFilePath } from '../services/fileService.js';
import path from 'path';

export const uploadFileHandler = (req, res) => {
  try {
    const savedFileNames = req.files.map((file) => file.filename);
    res.status(200).json({ photoIds: savedFileNames });
  } catch (error) {
    res.status(500).json({ error: 'Error uploading files.' });
  }
};

export const getFileHandler = (req, res) => {
  const { filename } = req.params;
  const filePath = getFilePath(filename);

  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).json({ error: 'File not found.' });
    }
  });
};

export const deleteFileHandler = async (req, res) => {
  const { filename } = req.params;
  try {
    await deleteFile(filename);
    res.status(200).json({ message: 'File deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting file.' });
  }
};
