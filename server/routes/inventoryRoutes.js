import { Router } from 'express';
import { getAllItems, getItemById, addItem, updateItem, deleteItem, deleteItems } from '../controllers/inventoryController.js';

const router = Router();

router.get('/', getAllItems); // Get all items
router.get('/:id', getItemById); // Get a single item by ID
router.post('/', addItem); // Add a new item
router.put('/:id', updateItem); // Update an item by ID
router.delete('/:id', deleteItem); // Delete a single item by ID
router.delete('/', deleteItems); // Bulk delete items by IDs

export default router;
