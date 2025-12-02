# Virtual Patient Backend API

Backend API server for the Virtual Patient Physical Examination Simulator.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express
- **Language**: TypeScript
- **ORM**: Prisma (to be added)
- **Database**: PostgreSQL (to be added)
- **AI Integration**: Anthropic Claude API (Phase 2)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env

# Edit .env with your configuration
# (PostgreSQL and Claude API key will be needed later)
```

### Development

```bash
# Run in development mode with hot reload
npm run dev

# The server will start on http://localhost:3001
```

### Build & Production

```bash
# Build TypeScript to JavaScript
npm run build

# Run production server
npm start
```

### Available Scripts

- `npm run dev` - Start development server with hot reload (using tsx)
- `npm run build` - Build TypeScript to JavaScript in dist/
- `npm start` - Run production server from dist/
- `npm run lint` - Lint TypeScript files
- `npm run format` - Format code with Prettier

## Project Structure

```
backend/
├── src/
│   ├── server.ts           # Main Express server
│   ├── types/
│   │   └── index.ts        # Shared TypeScript types
│   ├── routes/             # API route handlers
│   ├── controllers/        # Business logic
│   ├── middleware/         # Express middleware
│   ├── services/           # External services (Claude API, etc.)
│   └── utils/              # Helper functions
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

## API Endpoints

### Current

- `GET /health` - Health check endpoint
- `GET /api` - API information and available endpoints

### Planned (from spec)

- `GET /api/cases` - List available cases
- `GET /api/cases/:id` - Get case details
- `POST /api/cases/:id/examine` - Perform exam maneuver, returns finding
- `POST /api/cases/:id/parse-input` - Parse natural language to maneuver
- `POST /api/sessions` - Start new session
- `PUT /api/sessions/:id/submit` - Submit diagnosis, get feedback
- `GET /api/sessions/:id/review` - Get full session review

## Environment Variables

See `.env.example` for all available configuration options.

Key variables:
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `DATABASE_URL` - PostgreSQL connection string (Phase 1)
- `ANTHROPIC_API_KEY` - Claude API key (Phase 2)

## Development Roadmap

### Phase 1 (MVP) - In Progress
- ✅ Basic Express server setup
- ✅ TypeScript configuration
- ✅ Shared type definitions
- ⏸️ Prisma ORM setup
- ⏸️ Database schema implementation
- ⏸️ Case CRUD endpoints
- ⏸️ Session management endpoints
- ⏸️ In-memory case storage

### Phase 2 (Core Features)
- Natural language parsing with Claude API
- Audio/media file serving
- Session scoring logic
- Advanced case management

### Phase 3 (Polish)
- User authentication & authorization
- Analytics and reporting
- Case authoring API
- Performance optimization
