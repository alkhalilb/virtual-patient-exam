# Virtual Patient Physical Examination Simulator

## 🚨 CRITICAL WORKFLOW RULE 🚨

**EVERY SINGLE TIME you make ANY change, addition, or modification to this project:**
1. **Update CURRENT_TASK.md** - Document what you're working on right now
2. **Update this README.md** - Reflect completed work in the appropriate section

**NO EXCEPTIONS. This keeps the project organized and trackable.**

---

## Project Overview

A web application that allows medical students to practice physical examination skills on virtual patients before standardized patient (SP) encounters. Students interact with a virtual patient by clicking anatomical regions or typing natural language commands. The system responds with appropriate clinical findings (images, sounds, videos, or text descriptions) based on pre-authored cases.

### Educational Goal
Support **hypothesis-driven physical examination** by making students explicitly choose what to examine and why, then interpret realistic findings to refine their differential diagnosis.

---

## Current Status

**Project Phase:** Phase 1 MVP Complete + AI Media Generation - Ready for Testing! 🎉
**Last Updated:** 2025-12-02 (AI Media Generation Added)

### ✅ Phase 1 MVP Complete

**The application is fully functional and ready to run once dependencies are installed and database is configured.**

#### Backend Complete
- ✅ Node.js + Express + TypeScript server
- ✅ Prisma ORM with complete schema (4 models with relationships)
- ✅ PostgreSQL database design
- ✅ Full API implementation:
  - GET /api/cases - List all cases
  - GET /api/cases/:id - Get case details
  - POST /api/cases/:id/examine - Perform examination
  - POST /api/sessions - Create session
  - POST /api/sessions/:id/maneuver - Record maneuver
  - PUT /api/sessions/:id/submit - Submit diagnosis with scoring
  - GET /api/sessions/:id/review - Get session review
- ✅ **AI Media Generation API** 🎨 **NEW!**
  - GET /api/media/status - Check Replicate API availability
  - GET /api/media/available-types - List available image/video types
  - POST /api/media/generate-image - Generate medical images with Flux AI
  - POST /api/media/generate-video - Generate medical videos with Kling AI
  - POST /api/media/image-to-video - Convert existing images to videos
- ✅ Seed data with 3 complete clinical cases:
  - CHF Exacerbation (15 detailed findings)
  - COPD Exacerbation (4 findings)
  - Pneumonia (4 findings)
- ✅ Scoring algorithm (completeness, efficiency, diagnosis accuracy)

#### Frontend Complete
- ✅ React 19 + TypeScript + Vite
- ✅ React Router v7 with 4 routes
- ✅ Zustand state management (exam store, case list store)
- ✅ Complete API service layer
- ✅ Four full pages with styling:
  - HomePage: Case selection grid + link to AI media generation
  - ExamPage: Interactive examination interface
  - FeedbackPage: Score visualization and feedback
  - **MediaGenerationPage**: AI-powered media generation UI 🎨 **NEW!**
- ✅ Responsive UI with CSS styling

### Not Started (Phase 2+)
- ⏸️ Interactive SVG body diagram (currently button-based)
- ⏸️ Audio/video media playback (placeholder text for now)
- ⏸️ AI parsing integration (Claude API for natural language)
- ⏸️ User authentication
- ⏸️ Additional cases (have 3, spec called for 6)
- ⏸️ Analytics dashboard

---

## Core Features

### 1. Interactive Patient Interface
- **Visual body model**: Front and back views of a patient (standing or supine)
- **Clickable regions**: Head/neck, chest, abdomen, back, extremities with sub-regions
- **Region highlighting**: Visual feedback on hover
- **Position toggle**: Switch patient position (sitting, standing, supine, lateral)

### 2. Input Methods

#### Click-Based Input
- Click on body region → menu of available maneuvers
- Example: Click chest → "Inspect", "Auscultate (lungs)", "Auscultate (heart)", "Percuss", "Palpate"

#### Natural Language Input
- Text field for natural language commands
- AI parses intent and maps to structured command
- Examples:
  - "Listen to the heart" → cardiac auscultation
  - "Check JVP" → neck inspection for jugular venous pressure
  - "Percuss the right lower lung field posteriorly" → targeted percussion

### 3. Finding Presentation

| Finding Type | Format | Examples |
|--------------|--------|----------|
| Auscultation | Audio + waveform | Heart murmurs, lung sounds, bowel sounds |
| Inspection | Image or video | Skin findings, JVD, respiratory pattern |
| Palpation | Text description + optional image | Tenderness, guarding, masses |
| Percussion | Audio + text | Dullness, tympany, hyperresonance |
| Special tests | Video or text result | Brudzinski sign, Murphy's sign |

### 4. Student Workflow
1. Receive case prompt (e.g., "45-year-old male with shortness of breath")
2. Form initial hypothesis
3. Perform targeted exam maneuvers
4. View findings for each maneuver
5. Refine hypothesis based on findings
6. Submit differential diagnosis
7. Receive feedback on exam efficiency and accuracy

### 5. Feedback System
- **Exam completeness**: Coverage of key findings
- **Exam efficiency**: Avoidance of unnecessary maneuvers
- **Diagnosis accuracy**: Comparison to intended diagnosis
- **Reasoning display**: Show which findings supported diagnosis

### 6. AI Media Generation 🎨 **NEW!**

Generate realistic medical images and videos using AI to supplement case libraries.

#### Features
- **Flux AI Image Generation**: High-quality medical photography-style images
  - Bilateral pitting edema
  - Jugular venous distention (JVD)
  - Barrel chest deformity
  - Hepatomegaly appearance
  - And more predefined medical findings

- **Kling AI Video Generation**: Short animated videos (2-3 seconds)
  - JVD with visible pulsation
  - Tachypneic respirations
  - Two-step process: Flux generates base image → Kling animates it

- **Cost-Effective**:
  - Images: ~$0.003 each
  - Videos: ~$0.05-0.15 each
  - Ideal for educational use on limited budgets

#### Setup
1. Sign up at [replicate.com](https://replicate.com)
2. Get your API token
3. Add to `backend/.env`: `REPLICATE_API_TOKEN=your_token_here`
4. Access via HomePage button "🎨 Generate AI Media" or navigate to `/media-generation`

#### Technical Details
- **Image Model**: black-forest-labs/flux-schnell (fast, high-quality)
- **Video Model**: minimax/video-01 (image-to-video transformation)
- **Storage**: Files automatically saved to `/media/images/` and `/media/videos/`
- **API Platform**: Replicate (hosts both Flux and Kling models)

---

## Technical Architecture

### Frontend Stack
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite (fast dev server, optimized builds)
- **Routing**: React Router v7
- **Body Interface**: SVG-based interactive anatomy
- **Audio**: Web Audio API for heart/lung sounds
- **State Management**: Zustand (lightweight, TypeScript-first)

### Backend Stack
- **Framework**: Node.js with Express + TypeScript
- **Database**: PostgreSQL for cases and user progress
- **ORM**: Prisma (type-safe database queries, great migrations)
- **File Storage**: Local filesystem for generated media, S3 for production
- **AI Services**:
  - Anthropic Claude API for natural language interpretation (Phase 2)
  - Replicate API for AI image/video generation (Flux + Kling models)
- **Runtime**: tsx for development, compiled JS for production

### Key Data Models

#### Case
- Demographics (age, sex, chief complaint)
- History (HPI, PMH, medications, allergies, social/family history)
- Vital signs
- Exam findings map (every possible maneuver → finding)
- Working diagnosis
- Key findings (critical exam maneuvers)

#### Exam Finding
- Body region and maneuver type
- Target and location specifics
- Finding type (audio/image/video/text)
- Media URL and description
- Abnormality flag

#### Student Session
- Case ID and timestamps
- Performed maneuvers with input method tracking
- Submitted diagnosis
- Scoring and feedback

### API Endpoints
```
GET  /api/cases                    - List available cases
GET  /api/cases/:id                - Get case details
POST /api/cases/:id/examine        - Perform exam maneuver, returns finding
POST /api/cases/:id/parse-input    - Parse natural language to maneuver
POST /api/sessions                 - Start new session
PUT  /api/sessions/:id/submit      - Submit diagnosis, get feedback
GET  /api/sessions/:id/review      - Get full session review

# AI Media Generation (NEW!)
GET  /api/media/status             - Check if Replicate API is configured
GET  /api/media/available-types    - List available image/video types
POST /api/media/generate-image     - Generate medical image with Flux AI
POST /api/media/generate-video     - Generate medical video with Kling AI
POST /api/media/image-to-video     - Convert existing image to video
```

---

## Initial Case Set

1. **Cardiac**: CHF exacerbation (S3, crackles, JVD, edema)
2. **Pulmonary**: COPD exacerbation (wheezing, hyperresonance, prolonged expiration)
3. **Pulmonary**: Pneumonia (crackles, egophony, dullness to percussion)
4. **Abdominal**: Appendicitis (RLQ tenderness, guarding, positive special tests)
5. **Abdominal**: Cholecystitis (RUQ tenderness, Murphy's sign)
6. **Neurological**: Stroke (facial droop, drift, speech abnormality)

---

## Development Roadmap

### Phase 1: MVP (4-6 weeks)
- Single case with all findings
- Click-based body interface only
- Basic finding display (image + text)
- No user accounts, no persistence

### Phase 2: Core Features (4-6 weeks)
- Natural language input with AI parsing
- Audio playback for heart/lung sounds
- 5-6 complete cases
- Session tracking and basic feedback

### Phase 3: Polish (4-6 weeks)
- User accounts and progress tracking
- Case authoring interface
- Analytics and reporting
- Mobile-responsive design

---

## Future Enhancements

1. **Hypothesis tracking**: Students explicitly state hypothesis before each maneuver
2. **Branching cases**: Findings change based on examination sequence
3. **Timed mode**: OSCE-style time pressure
4. **Multiplayer**: Students examine same patient, compare approaches
5. **SP integration**: Use findings during actual SP encounters
6. **Analytics dashboard**: Track common errors, time per maneuver, most-missed findings
7. **Case authoring tool**: Web interface for faculty to create cases
8. **LMS integration**: Connect to Canvas/Blackboard for assignments

---

## Project Structure

```
/
├── README.md                      # This file - project overview
├── CURRENT_TASK.md                # Active work tracking
├── virtual-patient-exam-spec.md   # Original specification
├── frontend/                      # React TypeScript application
├── backend/                       # API server
├── database/                      # Schema and migrations
├── media/                         # Audio, images, videos
└── docs/                          # Additional documentation
```

---

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- PostgreSQL 14+ (for Phase 1 database work)
- **Replicate API token** (for AI media generation - optional but recommended)
- Claude API key (for Phase 2 NLP features - future)

### Installation

#### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration (DATABASE_URL will be needed for Prisma)
```

#### Frontend Setup
```bash
cd frontend
npm install
```

### Development

Run both servers concurrently during development:

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
# Backend API will run on http://localhost:3001
# Health check: http://localhost:3001/health
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
# Frontend will run on http://localhost:5173
```

### Quick Start (First Time)

```bash
# Install all dependencies
cd backend && npm install && cd ../frontend && npm install && cd ..

# Copy environment files
cp backend/.env.example backend/.env

# Start development (run in separate terminals)
cd backend && npm run dev
cd frontend && npm run dev
```

Visit `http://localhost:5173` to see the application.

---

## Open Questions

1. **Granularity**: How specific should exam locations be?
2. **Normal findings**: Should every possible maneuver return something?
3. **Feedback timing**: Immediate or end-of-session feedback?
4. **Integration**: Standalone or integrate with existing curriculum software?
5. **Content creation**: Who authors cases and what's the review process?

---

## Resources

- [MedBiquitous Virtual Patient Standard](https://www.medbiq.org/virtual_patient)
- [Body Interact](https://bodyinteract.com/)
- Bates' Guide to Physical Examination
- [Original Specification](./virtual-patient-exam-spec.md)

---

## License

TBD

---

## Contributors

TBD

---

**Remember: Update CURRENT_TASK.md and this README.md with every change!**
