import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

// Define the path to the inventory file
const inventoryFilePath = resolve('data/inventory.json');

// Read the inventory file
export const readInventoryFile = () => {
  try {
    const data = readFileSync(inventoryFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading inventory file:', err);
    return []; // Return an empty array if the file is missing or invalid
  }
};

// Write to the inventory file
export const writeInventoryFile = (inventory) => {
  try {
    writeFileSync(inventoryFilePath, JSON.stringify(inventory, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing to inventory file:', err);
  }
};

// Get all items
export const getAllItems = (req, res) => {
  const inventory = readInventoryFile();
  res.status(200).json(inventory);
};

// Get a single item by ID
export const getItemById = (req, res) => {
  const inventory = readInventoryFile();
  const itemId = parseInt(req.params.id, 10);
  const item = inventory.find((item) => item.id === itemId);

  if (!item) {
    return res.status(404).json({ message: `Item with ID ${itemId} not found.` });
  }
  res.status(200).json(item);
};

// Add a new item
export const addItem = (req, res) => {
  const inventory = readInventoryFile();
  const newItem = { id: inventory.length ? inventory[inventory.length - 1].id + 1 : 1, ...req.body };
  //add required fields
  newItem.dateAdded = newItem.dateAdded || new Date().toISOString().split("T")[0];
  newItem.dateListed = "";
  newItem.activity = [{action:"added item", date: new Date().toISOString().split("T")[0]}]
  inventory.push(newItem);
  writeInventoryFile(inventory);
  res.status(201).json(newItem);
};

// Update an existing item by ID
export const updateItem = (req, res) => {
  const inventory = readInventoryFile();
  const itemId = parseInt(req.params.id, 10);
  const itemIndex = inventory.findIndex((item) => item.id === itemId);

  if (itemIndex === -1) {
    return res.status(404).json({ message: `Item with ID ${itemId} not found.` });
  }

  const updatedItem = { ...inventory[itemIndex], ...req.body };
  inventory[itemIndex] = updatedItem;
  writeInventoryFile(inventory);
  res.status(200).json(updatedItem);
};

// Delete an item by ID
export const deleteItem = (req, res) => {
  const inventory = readInventoryFile();
  const itemId = parseInt(req.params.id, 10);
  const updatedInventory = inventory.filter((item) => item.id !== itemId);

  if (inventory.length === updatedInventory.length) {
    return res.status(404).json({ message: `Item with ID ${itemId} not found.` });
  }

  writeInventoryFile(updatedInventory);
  res.status(200).json({ message: `Item with ID ${itemId} successfully deleted.` });
};

// Delete multiple items by IDs (bulk delete)
export const deleteItems = (req, res) => {
  const inventory = readInventoryFile();
  const itemIdsToDelete = req.body.ids; // Expecting an array of IDs
  const updatedInventory = inventory.filter((item) => !itemIdsToDelete.includes(item.id));

  if (updatedInventory.length === inventory.length) {
    return res.status(404).json({ message: `No items found for the given IDs.` });
  }

  writeInventoryFile(updatedInventory);
  res.status(200).json({ message: `Items successfully deleted.`, deletedIds: itemIdsToDelete });
};

export default {
  getAllItems,
  getItemById,
  addItem,
  updateItem,
  deleteItem,
  deleteItems
};
