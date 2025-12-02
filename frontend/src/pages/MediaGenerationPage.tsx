import { useState, useEffect } from 'react';
import './MediaGenerationPage.css';

interface MediaType {
  id: string;
  description: string;
  filename: string;
  duration?: number;
}

interface GenerationStatus {
  available: boolean;
  message: string;
  imageTypes: MediaType[];
  videoTypes: MediaType[];
}

export default function MediaGenerationPage() {
  const [status, setStatus] = useState<GenerationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);
  const [results, setResults] = useState<Array<{
    type: string;
    url: string;
    localPath: string;
  }>>([]);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/api/media/status`);
      const data = await response.json();
      setStatus(data.data);
    } catch (err: any) {
      setError('Failed to connect to media generation service');
    }
  };

  const generateImage = async (imageType: string) => {
    setIsLoading(true);
    setGenerating(imageType);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/media/generate-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setResults(prev => [...prev, {
        type: `Image: ${imageType}`,
        url: data.data.url,
        localPath: data.data.localPath,
      }]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setGenerating(null);
    }
  };

  const generateVideo = async (videoType: string) => {
    setIsLoading(true);
    setGenerating(videoType);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/media/generate-video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate video');
      }

      setResults(prev => [...prev, {
        type: `Video: ${videoType}`,
        url: data.data.videoUrl,
        localPath: data.data.localPath,
      }]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setGenerating(null);
    }
  };

  if (!status) {
    return (
      <div className="media-generation-page">
        <div className="loading">Loading media generation service...</div>
      </div>
    );
  }

  if (!status.available) {
    return (
      <div className="media-generation-page">
        <div className="error-container">
          <h2>⚠️ Media Generation Not Available</h2>
          <p>{status.message}</p>
          <div className="setup-instructions">
            <h3>To enable media generation:</h3>
            <ol>
              <li>Sign up for a Replicate API account at <a href="https://replicate.com" target="_blank" rel="noopener noreferrer">replicate.com</a></li>
              <li>Get your API token from your account dashboard</li>
              <li>Add to <code>backend/.env</code>: <code>REPLICATE_API_TOKEN=your_token_here</code></li>
              <li>Restart the backend server</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="media-generation-page">
      <header className="media-header">
        <h1>🎨 AI Media Generation</h1>
        <p>Generate medical images and videos using Flux AI and Kling AI</p>
      </header>

      {error && (
        <div className="error-banner">
          <strong>Error:</strong> {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      <div className="media-sections">
        {/* Images Section */}
        <section className="media-section">
          <h2>📸 Generate Medical Images</h2>
          <p className="section-description">
            Using Flux AI to generate clinical photography-style images
          </p>

          <div className="media-grid">
            {status.imageTypes.map((imageType) => (
              <div key={imageType.id} className="media-card">
                <h3>{imageType.description}</h3>
                <p className="filename">{imageType.filename}</p>
                <button
                  onClick={() => generateImage(imageType.id)}
                  disabled={isLoading && generating === imageType.id}
                  className="generate-button"
                >
                  {isLoading && generating === imageType.id
                    ? '⏳ Generating...'
                    : '🎨 Generate Image'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Videos Section */}
        <section className="media-section">
          <h2>🎬 Generate Medical Videos</h2>
          <p className="section-description">
            Using Flux AI + Kling AI to generate animated clinical videos (2-3 seconds)
          </p>

          <div className="media-grid">
            {status.videoTypes.map((videoType) => (
              <div key={videoType.id} className="media-card">
                <h3>{videoType.description}</h3>
                <p className="filename">{videoType.filename}</p>
                <p className="duration">Duration: {videoType.duration}s</p>
                <button
                  onClick={() => generateVideo(videoType.id)}
                  disabled={isLoading && generating === videoType.id}
                  className="generate-button video"
                >
                  {isLoading && generating === videoType.id
                    ? '⏳ Generating (may take 1-2 min)...'
                    : '🎬 Generate Video'}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Results Section */}
      {results.length > 0 && (
        <section className="results-section">
          <h2>✅ Generated Media</h2>
          <div className="results-list">
            {results.map((result, index) => (
              <div key={index} className="result-item">
                <strong>{result.type}</strong>
                <div className="result-details">
                  <span>Saved to: {result.localPath}</span>
                  <a href={result.url} target="_blank" rel="noopener noreferrer">
                    View Original →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Info Section */}
      <section className="info-section">
        <h3>ℹ️ How It Works</h3>
        <div className="info-grid">
          <div className="info-card">
            <h4>🎨 Images</h4>
            <p>Generated using Flux Schnell (fast, high-quality AI image model)</p>
            <p>• Medical photography style<br/>• Anatomically accurate<br/>• Saved to /media/images/</p>
          </div>
          <div className="info-card">
            <h4>🎬 Videos</h4>
            <p>Two-step process:</p>
            <p>1. Generate base image with Flux<br/>2. Animate with Kling AI (realistic motion)<br/>• 2-3 second clips<br/>• Saved to /media/videos/</p>
          </div>
          <div className="info-card">
            <h4>💰 Cost</h4>
            <p>Replicate charges per generation:</p>
            <p>• Images: ~$0.003 each<br/>• Videos: ~$0.05-0.15 each<br/>• Very affordable for educational use!</p>
          </div>
        </div>
      </section>
    </div>
  );
}
