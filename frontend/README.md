# Virtual Patient Frontend

Frontend application for the Virtual Patient Physical Examination Simulator built with React, TypeScript, and Vite.

## Tech Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v7
- **State Management**: Zustand
- **Styling**: CSS (will add Tailwind or CSS-in-JS later)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Run development server
npm run dev

# The app will start on http://localhost:5173
```

### Build & Production

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run lint` - Lint TypeScript/React files
- `npm run format` - Format code with Prettier
- `npm run preview` - Preview production build

## Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   ├── pages/              # Page components
│   ├── types/              # Shared TypeScript types (synced with backend)
│   ├── hooks/              # Custom React hooks
│   ├── store/              # Zustand state management
│   ├── utils/              # Helper functions
│   ├── services/           # API service layer
│   ├── assets/             # Images, fonts, etc.
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── index.html              # HTML template
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## Key Features to Implement

### Phase 1 (MVP)
- Interactive body diagram (SVG-based)
- Clickable regions with visual feedback
- Basic finding display component
- Case information display
- Simple routing (case list → exam screen)

### Phase 2 (Core Features)
- Natural language input field
- Audio playback for heart/lung sounds
- Session tracking UI
- Feedback display after diagnosis submission
- Multiple case support

### Phase 3 (Polish)
- User authentication UI
- Progress tracking dashboard
- Analytics visualization
- Mobile-responsive design
- Case authoring interface (for faculty)

## Component Architecture (Planned)

```
App
├── CaseListPage
│   └── CaseCard[]
├── ExamPage
│   ├── PatientInfo
│   ├── BodyDiagram (interactive SVG)
│   ├── FindingDisplay
│   │   ├── AudioPlayer
│   │   ├── ImageViewer
│   │   ├── VideoPlayer
│   │   └── TextDescription
│   ├── InputSection
│   │   ├── NaturalLanguageInput
│   │   └── RecentManeuvers
│   └── ActionButtons
└── FeedbackPage
    ├── ScoreSummary
    ├── MissedFindings
    └── SessionReview
```

## API Integration

The frontend communicates with the backend API running on `http://localhost:3001`.

API service layer will handle:
- Fetching available cases
- Starting exam sessions
- Submitting exam maneuvers
- Parsing natural language input
- Submitting diagnoses
- Retrieving feedback

## Shared Types

TypeScript types are shared between frontend and backend (located in `src/types/index.ts`). Key types include:
- `Case` - Patient case data
- `ExamFinding` - Individual examination finding
- `StudentSession` - User exam session
- `BodyRegion`, `ManeuverType` - Enums for exam maneuvers

## Development Guidelines

1. Keep components small and focused
2. Use TypeScript strictly (no `any` types)
3. Follow React best practices (hooks, functional components)
4. Maintain shared types in sync with backend
5. Write semantic, accessible HTML
6. Keep state management centralized with Zustand

## Environment Variables

Create a `.env.local` file for local development:

```env
VITE_API_URL=http://localhost:3001
```

Access in code via `import.meta.env.VITE_API_URL`
