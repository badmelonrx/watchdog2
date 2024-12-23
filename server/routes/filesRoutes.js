import express from 'express';
import { upload } from '../services/fileService.js';
import {
  uploadFileHandler,
  getFileHandler,
  deleteFileHandler,
} from '../controllers/fileController.js';

const router = express.Router();

router.post('/upload', upload.array('files'), uploadFileHandler);
router.get('/:filename', getFileHandler);
router.delete('/:filename', deleteFileHandler);

export default router;
