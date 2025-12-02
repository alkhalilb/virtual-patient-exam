import express from 'express';
import {
  getAllCases,
  getCaseById,
  examineCase,
  parseNaturalLanguageInput,
} from '../controllers/caseController.js';

const router = express.Router();

// GET /api/cases - Get all cases
router.get('/', getAllCases);

// GET /api/cases/:id - Get single case
router.get('/:id', getCaseById);

// POST /api/cases/:id/examine - Perform examination maneuver
router.post('/:id/examine', examineCase);

// POST /api/cases/:id/parse-input - Parse natural language input
router.post('/:id/parse-input', parseNaturalLanguageInput);

export default router;
