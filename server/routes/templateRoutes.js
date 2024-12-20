import { Router } from 'express';
import { getInputTemplates, validateData } from '../controllers/templateController.js';

const router = Router();

router.get('/input-templates', getInputTemplates); // Fetch templates
router.post('/validate', validateData); // Validate data against a template

export default router;
