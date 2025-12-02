# Virtual Patient Physical Examination Simulator

## Overview

A web application that allows medical students to practice physical examination skills on virtual patients before standardized patient (SP) encounters. Students interact with a virtual patient by clicking anatomical regions or typing natural language commands. The system responds with appropriate clinical findings (images, sounds, videos, or text descriptions) based on pre-authored cases.

### Educational Goal

Support **hypothesis-driven physical examination** by making students explicitly choose what to examine and why, then interpret realistic findings to refine their differential diagnosis.

---

## Core Features

### 1. Interactive Patient Interface

- **Visual body model**: Front and back views of a patient (standing or supine depending on context)
- **Clickable regions**: Head/neck, chest, abdomen, back, upper extremities, lower extremities, with sub-regions (e.g., chest → cardiac area, lung fields)
- **Region highlighting**: Visual feedback on hover showing clickable areas
- **Position toggle**: Allow switching patient position (sitting, standing, supine, lateral) when relevant to exam

### 2. Input Methods

#### Click-Based Input
- Click on body region → opens menu of available maneuvers for that region
- Example: Click chest → options: "Inspect", "Auscultate (lungs)", "Auscultate (heart)", "Percuss", "Palpate"

#### Natural Language Input
- Text field where students type what they want to do
- AI parses intent and maps to structured command
- Examples:
  - "Listen to the heart" → {region: "chest", maneuver: "auscultate", target: "cardiac", location: "all_areas"}
  - "Check JVP" → {region: "neck", maneuver: "inspect", target: "jugular_venous_pressure"}
  - "Percuss the right lower lung field posteriorly" → {region: "back", maneuver: "percuss", target: "lung", location: "right_lower"}

### 3. Finding Presentation

Based on the case and maneuver selected, display appropriate media:

| Finding Type | Format | Examples |
|--------------|--------|----------|
| Auscultation | Audio + waveform visualization | Heart murmurs, lung sounds, bowel sounds |
| Inspection | Image or video | Skin findings, JVD, respiratory pattern, gait |
| Palpation | Text description + optional image | "Tender to palpation in RUQ with guarding" |
| Percussion | Audio + text | Dullness, tympany, hyperresonance |
| Special tests | Video or text result | Brudzinski sign, Murphy's sign result |

### 4. Case System

Each case contains:
- **Patient demographics**: Age, sex, presenting complaint
- **Brief history**: Available if student asks (HPI, PMH, etc.)
- **Vital signs**: Displayed on request
- **Exam findings map**: Every possible maneuver mapped to a finding
- **Working diagnosis**: For feedback/scoring purposes
- **Key findings**: Which exam maneuvers are most relevant

### 5. Student Workflow

1. Student receives case prompt (e.g., "45-year-old male with shortness of breath")
2. Student forms initial hypothesis
3. Student performs targeted exam maneuvers
4. System shows findings for each maneuver
5. Student refines hypothesis based on findings
6. Student submits differential diagnosis
7. System provides feedback on exam efficiency and accuracy

### 6. Feedback System

- **Exam completeness**: Did they check the key findings?
- **Exam efficiency**: Did they avoid unnecessary maneuvers?
- **Diagnosis accuracy**: How close to the intended diagnosis?
- **Reasoning display**: Show which findings supported the diagnosis

---

## Technical Architecture

### Frontend
- **Framework**: React with TypeScript
- **Body interface**: SVG-based interactive anatomy (or Canvas for more complex interactions)
- **Audio**: Web Audio API for heart/lung sounds with playback controls
- **State management**: React Context or Zustand for case/exam state

### Backend
- **Framework**: Node.js with Express or Python with FastAPI
- **Database**: PostgreSQL for cases and user progress
- **File storage**: S3 or equivalent for media files (images, audio, video)
- **AI parsing**: Claude API for natural language input interpretation

### Data Models

```typescript
interface Case {
  id: string;
  title: string;
  demographics: {
    age: number;
    sex: string;
    chiefComplaint: string;
  };
  history: {
    hpi: string;
    pmh: string[];
    medications: string[];
    allergies: string[];
    socialHistory: string;
    familyHistory: string;
  };
  vitals: {
    bp: string;
    hr: number;
    rr: number;
    temp: number;
    spo2: number;
  };
  findings: ExamFinding[];
  diagnosis: string;
  keyFindings: string[]; // IDs of critical findings
}

interface ExamFinding {
  id: string;
  region: BodyRegion;
  maneuver: ManeuverType;
  target?: string; // e.g., "mitral_area", "right_lower_lobe"
  location?: string; // specific location within region
  findingType: "audio" | "image" | "video" | "text";
  mediaUrl?: string;
  description: string;
  isAbnormal: boolean;
}

type BodyRegion = 
  | "head" | "neck" | "chest" | "abdomen" 
  | "back" | "upper_extremity_left" | "upper_extremity_right"
  | "lower_extremity_left" | "lower_extremity_right";

type ManeuverType = 
  | "inspect" | "auscultate" | "percuss" 
  | "palpate" | "special_test" | "measure";

interface StudentSession {
  id: string;
  caseId: string;
  startTime: Date;
  maneuversPerformed: PerformedManeuver[];
  submittedDiagnosis?: string;
  score?: SessionScore;
}

interface PerformedManeuver {
  findingId: string;
  timestamp: Date;
  inputMethod: "click" | "text";
  rawInput?: string; // if text input, store original
}
```

### API Endpoints

```
GET  /api/cases                    - List available cases
GET  /api/cases/:id                - Get case details (without findings initially)
POST /api/cases/:id/examine        - Perform exam maneuver, returns finding
POST /api/cases/:id/parse-input    - Parse natural language to maneuver
POST /api/sessions                 - Start new session
PUT  /api/sessions/:id/submit      - Submit diagnosis, get feedback
GET  /api/sessions/:id/review      - Get full session review with all findings
```

### AI Integration for Input Parsing

Use Claude API to parse natural language input:

```typescript
interface ParsedManeuver {
  region: BodyRegion;
  maneuver: ManeuverType;
  target?: string;
  location?: string;
  confidence: number;
  clarificationNeeded?: string;
}

// Prompt structure for Claude
const systemPrompt = `You are parsing physical examination commands from medical students.
Extract the following from their input:
- region: the body region being examined
- maneuver: inspect, auscultate, percuss, palpate, special_test, or measure
- target: specific structure (e.g., "heart", "lungs", "liver")
- location: specific location (e.g., "mitral_area", "right_lower_lobe", "mcburney_point")

Return JSON only. If unclear, set clarificationNeeded with a follow-up question.`;
```

---

## Content Requirements

### Initial Case Set (Suggested Starter Cases)

1. **Cardiac**: CHF exacerbation (S3, crackles, JVD, edema)
2. **Pulmonary**: COPD exacerbation (wheezing, hyperresonance, prolonged expiration)
3. **Pulmonary**: Pneumonia (crackles, egophony, dullness to percussion)
4. **Abdominal**: Appendicitis (RLQ tenderness, guarding, positive special tests)
5. **Abdominal**: Cholecystitis (RUQ tenderness, Murphy's sign)
6. **Neurological**: Stroke (facial droop, drift, speech abnormality)

### Media Assets Needed Per Case

- **Heart sounds**: Normal + relevant abnormal (mp3/wav, 5-10 seconds each)
- **Lung sounds**: Normal + relevant abnormal for each lung zone
- **Images**: Any visible findings (skin, JVD, edema, asymmetry)
- **Videos**: Gait, tremor, respiratory pattern if relevant

### Sources for Media

- Existing institutional recordings
- 3M Littmann sound library
- NEJM clinical images (with licensing)
- Custom recordings from simulation lab
- Open-source medical media libraries

---

## User Interface Mockup Description

### Main Exam Screen

```
+----------------------------------------------------------+
|  Case: 65 y/o M with dyspnea on exertion    [Vitals] [Hx] |
+----------------------------------------------------------+
|                    |                                      |
|   [Body Diagram]   |   Finding Display Area               |
|                    |   +------------------------------+   |
|    (clickable      |   |                              |   |
|     SVG overlay)   |   |   [Image/Video/Audio         |   |
|                    |   |    of current finding]        |   |
|                    |   |                              |   |
|                    |   +------------------------------+   |
|                    |   Description: "S3 gallop heard      |
|                    |   at apex, loudest with bell"        |
+----------------------------------------------------------+
|  What would you like to examine?                          |
|  [________________________________________________] [Go]  |
|                                                           |
|  Recent: JVP ✓ | Heart ✓ | Lungs (pending)              |
+----------------------------------------------------------+
|  [Submit Diagnosis]                         [Review Exam] |
+----------------------------------------------------------+
```

---

## Future Enhancements

1. **Hypothesis tracking**: Students explicitly state hypothesis before each maneuver
2. **Branching cases**: Findings change based on what was examined first (simulating clinical deterioration)
3. **Timed mode**: OSCE-style time pressure
4. **Multiplayer**: Students examine same patient, compare approaches
5. **SP integration**: Use findings from this app during actual SP encounters (SP references what student "found")
6. **Analytics dashboard**: Track common errors, time per maneuver, most-missed findings
7. **Case authoring tool**: Web interface for faculty to create new cases without coding
8. **LMS integration**: Connect to Canvas/Blackboard for assignment and grading

---

## Development Phases

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

## Questions to Resolve

1. **Granularity**: How specific should exam locations be? (e.g., "auscultate heart" vs. "auscultate mitral area with bell in left lateral decubitus position")
2. **Normal findings**: Should every possible maneuver return something, even if normal? (Recommended: yes, to reinforce thoroughness)
3. **Feedback timing**: Immediate feedback after each maneuver, or only at end?
4. **Integration**: Should this tie into existing curriculum software or be standalone?
5. **Content creation workflow**: Who authors cases? What's the review process?

---

## References

- MedBiquitous Virtual Patient Standard: https://www.medbiq.org/virtual_patient
- Body Interact: https://bodyinteract.com/
- ALICE (Artificial Learning Interface of Clinical Education)
- Bates' Guide to Physical Examination (for standardized exam structure)
