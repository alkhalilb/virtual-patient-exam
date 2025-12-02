import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import caseRoutes from './routes/caseRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';

// Load environment variables
dotenv.config();

// ES Module dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Request logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve static media files (audio, images, videos)
// Files should be placed in the /media directory at project root
const mediaPath = path.join(__dirname, '../../media');
app.use('/media', express.static(mediaPath));

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Virtual Patient API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/cases', caseRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/media', mediaRoutes);

// API info endpoint
app.get('/api', (_req: Request, res: Response) => {
  res.json({
    message: 'Virtual Patient Physical Examination Simulator API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      cases: {
        list: 'GET /api/cases',
        get: 'GET /api/cases/:id',
        examine: 'POST /api/cases/:id/examine',
        parseInput: 'POST /api/cases/:id/parse-input',
      },
      sessions: {
        create: 'POST /api/sessions',
        recordManeuver: 'POST /api/sessions/:id/maneuver',
        submit: 'PUT /api/sessions/:id/submit',
        review: 'GET /api/sessions/:id/review',
      },
      media: {
        status: 'GET /api/media/status',
        availableTypes: 'GET /api/media/available-types',
        generateImage: 'POST /api/media/generate-image',
        generateCustomImage: 'POST /api/media/generate-custom-image',
        generateVideo: 'POST /api/media/generate-video',
        imageToVideo: 'POST /api/media/image-to-video',
      },
    },
  });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist',
  });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🏥 API endpoint: http://localhost:${PORT}/api`);
});

export default app;
