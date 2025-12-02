import express from 'express';
import {
  getMediaGenerationStatus,
  generateImage,
  generateCustomImageEndpoint,
  generateVideo,
  convertImageToVideo,
  getAvailableTypes,
} from '../controllers/mediaGenerationController.js';

const router = express.Router();

// GET /api/media/status - Check if media generation is available
router.get('/status', getMediaGenerationStatus);

// GET /api/media/available-types - Get list of available media types
router.get('/available-types', getAvailableTypes);

// POST /api/media/generate-image - Generate predefined medical image
router.post('/generate-image', generateImage);

// POST /api/media/generate-custom-image - Generate custom image
router.post('/generate-custom-image', generateCustomImageEndpoint);

// POST /api/media/generate-video - Generate predefined medical video
router.post('/generate-video', generateVideo);

// POST /api/media/image-to-video - Convert image to video
router.post('/image-to-video', convertImageToVideo);

export default router;
