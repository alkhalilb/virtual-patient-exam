import { Request, Response } from 'express';
import {
  generateMedicalImage,
  generateCustomImage,
  generateMedicalVideo,
  imageToVideo,
  getAvailableImageTypes,
  getAvailableVideoTypes,
  isReplicateConfigured,
  MEDICAL_IMAGE_PROMPTS,
  MEDICAL_VIDEO_PROMPTS,
} from '../services/imageGenerationService.js';

/**
 * Check if media generation is available
 * GET /api/media/status
 */
export const getMediaGenerationStatus = (_req: Request, res: Response) => {
  const isConfigured = isReplicateConfigured();

  res.json({
    success: true,
    data: {
      available: isConfigured,
      message: isConfigured
        ? 'Media generation is available'
        : 'REPLICATE_API_TOKEN not configured',
      imageTypes: getAvailableImageTypes(),
      videoTypes: getAvailableVideoTypes(),
    },
  });
};

/**
 * Generate a predefined medical image
 * POST /api/media/generate-image
 * Body: { imageType: string }
 */
export const generateImage = async (req: Request, res: Response) => {
  try {
    const { imageType } = req.body;

    if (!imageType) {
      return res.status(400).json({
        success: false,
        error: 'imageType is required',
      });
    }

    if (!MEDICAL_IMAGE_PROMPTS[imageType as keyof typeof MEDICAL_IMAGE_PROMPTS]) {
      return res.status(400).json({
        success: false,
        error: `Invalid imageType. Available types: ${Object.keys(MEDICAL_IMAGE_PROMPTS).join(', ')}`,
      });
    }

    if (!isReplicateConfigured()) {
      return res.status(503).json({
        success: false,
        error: 'REPLICATE_API_TOKEN not configured',
      });
    }

    console.log(`🎨 API: Generating image - ${imageType}`);

    const result = await generateMedicalImage(imageType);

    res.json({
      success: true,
      data: {
        imageType,
        url: result.url,
        localPath: result.localPath,
        message: 'Image generated and saved successfully',
      },
    });
  } catch (error: any) {
    console.error('Error generating image:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate image',
    });
  }
};

/**
 * Generate a custom medical image with custom prompt
 * POST /api/media/generate-custom-image
 * Body: { prompt: string, filename: string }
 */
export const generateCustomImageEndpoint = async (req: Request, res: Response) => {
  try {
    const { prompt, filename } = req.body;

    if (!prompt || !filename) {
      return res.status(400).json({
        success: false,
        error: 'prompt and filename are required',
      });
    }

    if (!isReplicateConfigured()) {
      return res.status(503).json({
        success: false,
        error: 'REPLICATE_API_TOKEN not configured',
      });
    }

    console.log(`🎨 API: Generating custom image - ${filename}`);

    const result = await generateCustomImage(prompt, filename);

    res.json({
      success: true,
      data: {
        url: result.url,
        localPath: result.localPath,
        message: 'Custom image generated and saved successfully',
      },
    });
  } catch (error: any) {
    console.error('Error generating custom image:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate custom image',
    });
  }
};

/**
 * Generate a predefined medical video
 * POST /api/media/generate-video
 * Body: { videoType: string }
 */
export const generateVideo = async (req: Request, res: Response) => {
  try {
    const { videoType } = req.body;

    if (!videoType) {
      return res.status(400).json({
        success: false,
        error: 'videoType is required',
      });
    }

    if (!MEDICAL_VIDEO_PROMPTS[videoType as keyof typeof MEDICAL_VIDEO_PROMPTS]) {
      return res.status(400).json({
        success: false,
        error: `Invalid videoType. Available types: ${Object.keys(MEDICAL_VIDEO_PROMPTS).join(', ')}`,
      });
    }

    if (!isReplicateConfigured()) {
      return res.status(503).json({
        success: false,
        error: 'REPLICATE_API_TOKEN not configured',
      });
    }

    console.log(`🎬 API: Generating video - ${videoType}`);

    const result = await generateMedicalVideo(videoType);

    res.json({
      success: true,
      data: {
        videoType,
        imageUrl: result.imageUrl,
        videoUrl: result.videoUrl,
        localPath: result.localPath,
        message: 'Video generated and saved successfully',
      },
    });
  } catch (error: any) {
    console.error('Error generating video:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate video',
    });
  }
};

/**
 * Convert an existing image to video
 * POST /api/media/image-to-video
 * Body: { imageUrl: string, videoPrompt: string, filename: string, duration?: number }
 */
export const convertImageToVideo = async (req: Request, res: Response) => {
  try {
    const { imageUrl, videoPrompt, filename, duration } = req.body;

    if (!imageUrl || !videoPrompt || !filename) {
      return res.status(400).json({
        success: false,
        error: 'imageUrl, videoPrompt, and filename are required',
      });
    }

    if (!isReplicateConfigured()) {
      return res.status(503).json({
        success: false,
        error: 'REPLICATE_API_TOKEN not configured',
      });
    }

    console.log(`🎬 API: Converting image to video - ${filename}`);

    const result = await imageToVideo(imageUrl, videoPrompt, filename, duration || 3);

    res.json({
      success: true,
      data: {
        videoUrl: result.videoUrl,
        localPath: result.localPath,
        message: 'Image converted to video successfully',
      },
    });
  } catch (error: any) {
    console.error('Error converting image to video:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to convert image to video',
    });
  }
};

/**
 * Get list of available media types
 * GET /api/media/available-types
 */
export const getAvailableTypes = (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      images: getAvailableImageTypes(),
      videos: getAvailableVideoTypes(),
    },
  });
};
