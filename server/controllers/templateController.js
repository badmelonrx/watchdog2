import { resolve } from 'path';
import { readFileSync } from 'fs';

// Path to the input templates file
const inputTemplatesFilePath = resolve('models/inputTemplates.json');

// Fetch input templates
export const getInputTemplates = (req, res) => {
  try {
    const data = readFileSync(inputTemplatesFilePath, 'utf-8');
    const templates = JSON.parse(data);
    res.status(200).json(templates);
  } catch (err) {
    console.error('Error reading input templates:', err);
    res.status(500).json({ message: 'Failed to fetch input templates.' });
  }
};

// Validate data against the template (placeholder for future functionality)
export const validateData = (req, res) => {
  const { platform, data } = req.body; // Expecting platform and data to be sent in the request
  try {
    const templates = JSON.parse(readFileSync(inputTemplatesFilePath, 'utf-8'));
    const platformTemplate = templates.find((template) => template.platform === platform);

    if (!platformTemplate) {
      return res.status(404).json({ message: `Template for platform ${platform} not found.` });
    }

    // Validation logic (simplified for now)
    const fields = platformTemplate.fields;
    const errors = Object.entries(fields).reduce((acc, [key, field]) => {
      if (field.required && (data[key] === undefined || data[key] === '')) {
        acc.push(`${key} is required.`);
      }
      return acc;
    }, []);

    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation errors.', errors });
    }

    res.status(200).json({ message: 'Validation successful.' });
  } catch (err) {
    console.error('Error validating data:', err);
    res.status(500).json({ message: 'Validation failed.' });
  }
};

export default {
  getInputTemplates,
  validateData,
};
