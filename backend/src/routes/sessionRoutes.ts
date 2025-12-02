import express from 'express';
import {
  createSession,
  recordManeuver,
  submitDiagnosis,
  getSessionReview,
} from '../controllers/sessionController.js';

const router = express.Router();

// POST /api/sessions - Create new session
router.post('/', createSession);

// POST /api/sessions/:id/maneuver - Record a performed maneuver
router.post('/:id/maneuver', recordManeuver);

// PUT /api/sessions/:id/submit - Submit diagnosis and complete session
router.put('/:id/submit', submitDiagnosis);

// GET /api/sessions/:id/review - Get session review
router.get('/:id/review', getSessionReview);

export default router;
