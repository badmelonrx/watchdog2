import { Router } from 'express';
import { createListing, updateListing, deleteListing } from '../controllers/playwrightController.js';

const router = Router();

router.post('/create', createListing); // Create a listing
router.put('/update', updateListing); // Update a listing
router.delete('/delete', deleteListing); // Delete a listing

export default router;
