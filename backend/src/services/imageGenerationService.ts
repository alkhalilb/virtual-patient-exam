import Replicate from 'replicate';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || '',
});

// Video generation models
const KLING_MODEL = 'minimax/video-01' as any; // Kling AI via Replicate
const FLUX_MODEL = 'black-forest-labs/flux-schnell' as any;

// Medical image generation prompts for different findings
export const MEDICAL_IMAGE_PROMPTS = {
  'pitting-edema-bilateral': {
    prompt: 'Medical photograph of bilateral lower extremity pitting edema, clinical photography style, both legs from knees down showing significant swelling extending to mid-calf, visible indentation marks from finger pressure test, skin appears taut and shiny, symmetric swelling on both legs, neutral medical background, professional medical documentation quality, well-lit clinical setting, anatomically accurate, photorealistic, 4K medical imaging',
    filename: 'pitting-edema-bilateral.jpg',
    description: 'Bilateral pitting edema in lower extremities',
  },
  'jvd-elevated': {
    prompt: 'Medical photograph of jugular venous distention (JVD), patient at 45-degree angle, visible prominent jugular vein in neck, distended internal jugular vein clearly visible, clinical photography style, male patient neck in profile showing elevated jugular venous pressure, medical examination setting, professional documentation quality, photorealistic, well-lit, anatomically accurate, 4K medical imaging',
    filename: 'jvd-elevated.jpg',
    description: 'Jugular venous distention (elevated JVP)',
  },
  'barrel-chest': {
    prompt: 'Medical photograph of barrel chest deformity in COPD patient, lateral view showing increased anteroposterior diameter, chest appears rounded and barrel-shaped, ribs oriented more horizontally than normal, elderly male patient, clinical photography style, neutral medical background, professional documentation quality, photorealistic, well-lit, anatomically accurate, 4K medical imaging',
    filename: 'barrel-chest.jpg',
    description: 'Barrel chest deformity (COPD)',
  },
  'pursed-lip-breathing': {
    prompt: 'Medical photograph of elderly patient demonstrating pursed-lip breathing technique, close-up of face showing lips pursed during exhalation, patient appears to be working to breathe, COPD respiratory pattern, clinical photography style, professional medical documentation, photorealistic, well-lit, anatomically accurate, 4K medical imaging',
    filename: 'pursed-lip-breathing.jpg',
    description: 'Pursed-lip breathing technique',
  },
};

// Medical video generation prompts (image-to-video with Kling AI)
export const MEDICAL_VIDEO_PROMPTS = {
  'jvd-pulsation': {
    imagePrompt: 'Medical photograph of jugular venous distention (JVD), patient at 45-degree angle, visible prominent jugular vein in neck, clinical photography style, male patient neck in profile, medical examination setting, photorealistic',
    videoPrompt: 'Subtle pulsation of the jugular vein with cardiac cycle, gentle rhythmic movement, realistic medical footage, 2-3 seconds',
    filename: 'jvd-pulsation.mp4',
    description: 'JVD with visible pulsations',
    duration: 3,
  },
  'tachypnea': {
    imagePrompt: 'Medical photograph of patient chest during respiration, patient in mild respiratory distress, clinical photography style, neutral medical background, photorealistic',
    videoPrompt: 'Rapid shallow breathing pattern, chest rising and falling at increased rate (24-26 breaths per minute), realistic respiratory movement, 3 seconds',
    filename: 'tachypnea.mp4',
    description: 'Tachypnea (rapid breathing)',
    duration: 3,
  },
  'labored-breathing': {
    imagePrompt: 'Medical photograph of patient demonstrating use of accessory muscles for breathing, shoulder and neck muscles visible, clinical photography style, photorealistic',
    videoPrompt: 'Labored breathing with visible use of accessory muscles, shoulder elevation with each breath, realistic respiratory distress, 3 seconds',
    filename: 'labored-breathing.mp4',
    description: 'Labored breathing with accessory muscle use',
    duration: 3,
  },
  'pursed-lip-breathing-video': {
    imagePrompt: 'Medical photograph of elderly COPD patient face, lips pursed, clinical photography style, photorealistic',
    videoPrompt: 'Patient performing pursed-lip breathing technique, slow exhalation through pursed lips, realistic breathing pattern, 3 seconds',
    filename: 'pursed-lip-breathing-video.mp4',
    description: 'Pursed-lip breathing technique (video)',
    duration: 3,
  },
};

export interface GenerateImageOptions {
  prompt: string;
  filename: string;
  model?: string;
}

/**
 * Generate a medical image using Replicate API (Flux model)
 */
export async function generateMedicalImage(
  imageType: keyof typeof MEDICAL_IMAGE_PROMPTS,
  customPrompt?: string
): Promise<{ url: string; localPath: string }> {
  const config = MEDICAL_IMAGE_PROMPTS[imageType];
  const promptToUse = customPrompt || config.prompt;

  console.log(`🎨 Generating image: ${imageType}`);
  console.log(`📝 Prompt: ${promptToUse.substring(0, 100)}...`);

  try {
    // Use Flux Schnell (fastest Flux model) via Replicate
    const output = await replicate.run(
      'black-forest-labs/flux-schnell' as any,
      {
        input: {
          prompt: promptToUse,
          num_outputs: 1,
          aspect_ratio: '4:3',
          output_format: 'jpg',
          output_quality: 90,
        },
      }
    );

    // Output is an array of URLs
    const imageUrl = Array.isArray(output) ? output[0] : output;

    if (typeof imageUrl !== 'string') {
      throw new Error('Invalid image URL returned from Replicate');
    }

    console.log(`✅ Image generated: ${imageUrl}`);

    // Download and save the image locally
    const localPath = await downloadAndSaveImage(imageUrl, config.filename);

    return {
      url: imageUrl,
      localPath,
    };
  } catch (error: any) {
    console.error('❌ Error generating image:', error);
    throw new Error(`Failed to generate image: ${error.message}`);
  }
}

/**
 * Download image from URL and save to media directory
 */
async function downloadAndSaveImage(
  url: string,
  filename: string
): Promise<string> {
  try {
    // Fetch the image
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }

    // Get image buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save to media/images directory
    const mediaDir = path.join(__dirname, '../../../media/images');
    await fs.mkdir(mediaDir, { recursive: true });

    const filePath = path.join(mediaDir, filename);
    await fs.writeFile(filePath, buffer);

    console.log(`💾 Image saved to: ${filePath}`);

    return `/media/images/${filename}`;
  } catch (error: any) {
    console.error('❌ Error saving image:', error);
    throw new Error(`Failed to save image: ${error.message}`);
  }
}

/**
 * Generate a custom medical image with a custom prompt
 */
export async function generateCustomImage(
  prompt: string,
  filename: string
): Promise<{ url: string; localPath: string }> {
  console.log(`🎨 Generating custom image: ${filename}`);
  console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`);

  try {
    const output = await replicate.run(
      'black-forest-labs/flux-schnell' as any,
      {
        input: {
          prompt: prompt,
          num_outputs: 1,
          aspect_ratio: '4:3',
          output_format: 'jpg',
          output_quality: 90,
        },
      }
    );

    const imageUrl = Array.isArray(output) ? output[0] : output;

    if (typeof imageUrl !== 'string') {
      throw new Error('Invalid image URL returned from Replicate');
    }

    console.log(`✅ Image generated: ${imageUrl}`);

    // Download and save
    const localPath = await downloadAndSaveImage(imageUrl, filename);

    return {
      url: imageUrl,
      localPath,
    };
  } catch (error: any) {
    console.error('❌ Error generating custom image:', error);
    throw new Error(`Failed to generate image: ${error.message}`);
  }
}

/**
 * Get list of available predefined medical image types
 */
export function getAvailableImageTypes(): Array<{
  id: string;
  description: string;
  filename: string;
}> {
  return Object.entries(MEDICAL_IMAGE_PROMPTS).map(([id, config]) => ({
    id,
    description: config.description,
    filename: config.filename,
  }));
}

/**
 * Generate a medical video (image first with Flux, then animate with Kling)
 */
export async function generateMedicalVideo(
  videoType: keyof typeof MEDICAL_VIDEO_PROMPTS
): Promise<{ imageUrl: string; videoUrl: string; localPath: string }> {
  const config = MEDICAL_VIDEO_PROMPTS[videoType];

  console.log(`🎬 Generating video: ${videoType}`);

  try {
    // Step 1: Generate base image with Flux
    console.log(`📸 Step 1/2: Generating base image...`);
    const imageOutput = await replicate.run(FLUX_MODEL, {
      input: {
        prompt: config.imagePrompt,
        num_outputs: 1,
        aspect_ratio: '16:9',
        output_format: 'jpg',
        output_quality: 90,
      },
    });

    const imageUrl = Array.isArray(imageOutput) ? imageOutput[0] : imageOutput;
    if (typeof imageUrl !== 'string') {
      throw new Error('Invalid image URL returned');
    }

    console.log(`✅ Base image generated: ${imageUrl}`);

    // Step 2: Convert image to video with Kling AI
    console.log(`🎬 Step 2/2: Animating image with Kling AI...`);
    const videoOutput = await replicate.run(KLING_MODEL, {
      input: {
        image: imageUrl,
        prompt: config.videoPrompt,
        duration: config.duration.toString(),
      },
    });

    const videoUrl = Array.isArray(videoOutput) ? videoOutput[0] : videoOutput;
    if (typeof videoUrl !== 'string') {
      throw new Error('Invalid video URL returned');
    }

    console.log(`✅ Video generated: ${videoUrl}`);

    // Download and save video
    const localPath = await downloadAndSaveVideo(videoUrl, config.filename);

    return {
      imageUrl,
      videoUrl,
      localPath,
    };
  } catch (error: any) {
    console.error('❌ Error generating video:', error);
    throw new Error(`Failed to generate video: ${error.message}`);
  }
}

/**
 * Convert an existing image to video using Kling AI
 */
export async function imageToVideo(
  imageUrl: string,
  videoPrompt: string,
  filename: string,
  duration: number = 3
): Promise<{ videoUrl: string; localPath: string }> {
  console.log(`🎬 Converting image to video: ${filename}`);

  try {
    const output = await replicate.run(KLING_MODEL, {
      input: {
        image: imageUrl,
        prompt: videoPrompt,
        duration: duration.toString(),
      },
    });

    const videoUrl = Array.isArray(output) ? output[0] : output;
    if (typeof videoUrl !== 'string') {
      throw new Error('Invalid video URL returned');
    }

    console.log(`✅ Video generated: ${videoUrl}`);

    const localPath = await downloadAndSaveVideo(videoUrl, filename);

    return {
      videoUrl,
      localPath,
    };
  } catch (error: any) {
    console.error('❌ Error converting image to video:', error);
    throw new Error(`Failed to convert image to video: ${error.message}`);
  }
}

/**
 * Download video from URL and save to media directory
 */
async function downloadAndSaveVideo(
  url: string,
  filename: string
): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download video: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save to media/videos directory
    const mediaDir = path.join(__dirname, '../../../media/videos');
    await fs.mkdir(mediaDir, { recursive: true });

    const filePath = path.join(mediaDir, filename);
    await fs.writeFile(filePath, buffer);

    console.log(`💾 Video saved to: ${filePath}`);

    return `/media/videos/${filename}`;
  } catch (error: any) {
    console.error('❌ Error saving video:', error);
    throw new Error(`Failed to save video: ${error.message}`);
  }
}

/**
 * Get list of available predefined medical video types
 */
export function getAvailableVideoTypes(): Array<{
  id: string;
  description: string;
  filename: string;
  duration: number;
}> {
  return Object.entries(MEDICAL_VIDEO_PROMPTS).map(([id, config]) => ({
    id,
    description: config.description,
    filename: config.filename,
    duration: config.duration,
  }));
}

/**
 * Check if Replicate API is configured
 */
export function isReplicateConfigured(): boolean {
  return !!process.env.REPLICATE_API_TOKEN;
}
