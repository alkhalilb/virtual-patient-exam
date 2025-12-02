import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';

/**
 * Create a new student session
 * POST /api/sessions
 * Body: { caseId: string }
 */
export const createSession = async (req: Request, res: Response) => {
  try {
    const { caseId } = req.body;

    if (!caseId) {
      return res.status(400).json({
        success: false,
        error: 'Case ID is required',
      });
    }

    // Verify case exists
    const caseExists = await prisma.case.findUnique({
      where: { id: caseId },
    });

    if (!caseExists) {
      return res.status(404).json({
        success: false,
        error: 'Case not found',
      });
    }

    // Create new session
    const session = await prisma.studentSession.create({
      data: {
        caseId,
        startTime: new Date(),
      },
    });

    res.status(201).json({
      success: true,
      data: {
        session,
      },
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create session',
    });
  }
};

/**
 * Record a performed maneuver in a session
 * POST /api/sessions/:id/maneuver
 * Body: { findingId: string, inputMethod: 'click' | 'text', rawInput?: string }
 */
export const recordManeuver = async (req: Request, res: Response) => {
  try {
    const { id: sessionId } = req.params;
    const { findingId, inputMethod, rawInput } = req.body;

    if (!findingId || !inputMethod) {
      return res.status(400).json({
        success: false,
        error: 'Finding ID and input method are required',
      });
    }

    // Verify session exists
    const session = await prisma.studentSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
      });
    }

    // Don't allow recording maneuvers on completed sessions
    if (session.endTime) {
      return res.status(400).json({
        success: false,
        error: 'Session has already been completed',
      });
    }

    // Record the maneuver
    const maneuver = await prisma.performedManeuver.create({
      data: {
        sessionId,
        findingId,
        inputMethod,
        rawInput,
        timestamp: new Date(),
      },
    });

    res.status(201).json({
      success: true,
      data: {
        maneuver,
      },
    });
  } catch (error) {
    console.error('Error recording maneuver:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record maneuver',
    });
  }
};

/**
 * Submit diagnosis and complete session
 * PUT /api/sessions/:id/submit
 * Body: { diagnosis: string }
 */
export const submitDiagnosis = async (req: Request, res: Response) => {
  try {
    const { id: sessionId } = req.params;
    const { diagnosis } = req.body;

    if (!diagnosis) {
      return res.status(400).json({
        success: false,
        error: 'Diagnosis is required',
      });
    }

    // Get session with case and maneuvers
    const session = await prisma.studentSession.findUnique({
      where: { id: sessionId },
      include: {
        case: {
          include: {
            findings: true,
          },
        },
        maneuversPerformed: {
          include: {
            finding: true,
          },
        },
      },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
      });
    }

    if (session.endTime) {
      return res.status(400).json({
        success: false,
        error: 'Session has already been completed',
      });
    }

    // Calculate scoring
    const score = calculateScore(session, diagnosis);

    // Get key findings that were missed
    const keyFindingIds = session.case.keyFindings;
    const performedFindingIds = session.maneuversPerformed.map(m => m.findingId);
    const missedKeyFindings = session.case.findings.filter(
      f => keyFindingIds.includes(f.id) && !performedFindingIds.includes(f.id)
    );

    // Update session with diagnosis and score
    const updatedSession = await prisma.studentSession.update({
      where: { id: sessionId },
      data: {
        endTime: new Date(),
        submittedDiagnosis: diagnosis,
        completeness: score.completeness,
        efficiency: score.efficiency,
        diagnosisAccuracy: score.diagnosisAccuracy,
        overallScore: score.overallScore,
        feedback: score.feedback,
      },
      include: {
        case: true,
        maneuversPerformed: {
          include: {
            finding: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: {
        session: updatedSession,
        score: {
          completeness: score.completeness,
          efficiency: score.efficiency,
          diagnosisAccuracy: score.diagnosisAccuracy,
          overallScore: score.overallScore,
          feedback: score.feedback,
        },
        correctDiagnosis: session.case.diagnosis,
        keyFindingsMissed: missedKeyFindings,
      },
    });
  } catch (error) {
    console.error('Error submitting diagnosis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit diagnosis',
    });
  }
};

/**
 * Get session review with all findings
 * GET /api/sessions/:id/review
 */
export const getSessionReview = async (req: Request, res: Response) => {
  try {
    const { id: sessionId } = req.params;

    const session = await prisma.studentSession.findUnique({
      where: { id: sessionId },
      include: {
        case: {
          include: {
            findings: true,
          },
        },
        maneuversPerformed: {
          include: {
            finding: true,
          },
          orderBy: {
            timestamp: 'asc',
          },
        },
      },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
      });
    }

    res.json({
      success: true,
      data: {
        session,
      },
    });
  } catch (error) {
    console.error('Error fetching session review:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch session review',
    });
  }
};

/**
 * Calculate session score
 * This is a simplified scoring algorithm - can be enhanced later
 */
function calculateScore(
  session: any,
  submittedDiagnosis: string
): {
  completeness: number;
  efficiency: number;
  diagnosisAccuracy: number;
  overallScore: number;
  feedback: string[];
} {
  const keyFindingIds = session.case.keyFindings;
  const performedFindingIds = session.maneuversPerformed.map((m: any) => m.findingId);
  const totalFindings = session.case.findings.length;

  // Completeness: Did they check the key findings?
  const keyFindingsChecked = keyFindingIds.filter((id: string) =>
    performedFindingIds.includes(id)
  ).length;
  const completeness = Math.round((keyFindingsChecked / keyFindingIds.length) * 100);

  // Efficiency: Did they avoid unnecessary maneuvers?
  const unnecessaryManeuvers = performedFindingIds.length - keyFindingsChecked;
  const efficiency = Math.max(0, Math.round(100 - (unnecessaryManeuvers / totalFindings) * 50));

  // Diagnosis accuracy: Simple string similarity (can be enhanced with NLP)
  const correctDiagnosis = session.case.diagnosis.toLowerCase();
  const submitted = submittedDiagnosis.toLowerCase();
  const diagnosisAccuracy = submitted.includes(correctDiagnosis) || correctDiagnosis.includes(submitted) ? 100 : 50;

  // Overall score
  const overallScore = Math.round((completeness + efficiency + diagnosisAccuracy) / 3);

  // Generate feedback
  const feedback: string[] = [];

  if (completeness < 100) {
    const missedCount = keyFindingIds.length - keyFindingsChecked;
    feedback.push(`You missed ${missedCount} key finding${missedCount > 1 ? 's' : ''} that would have helped with the diagnosis.`);
  } else {
    feedback.push('Excellent! You checked all key findings.');
  }

  if (efficiency < 70) {
    feedback.push('Consider focusing on more targeted examination maneuvers based on your differential diagnosis.');
  } else if (efficiency > 90) {
    feedback.push('Great efficiency! You performed a focused, hypothesis-driven examination.');
  }

  if (diagnosisAccuracy < 100) {
    feedback.push(`The correct diagnosis was: ${session.case.diagnosis}`);
  } else {
    feedback.push('Correct diagnosis! Well done.');
  }

  return {
    completeness,
    efficiency,
    diagnosisAccuracy,
    overallScore,
    feedback,
  };
}
