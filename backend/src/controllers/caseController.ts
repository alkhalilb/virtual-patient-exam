import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';

/**
 * Get all available cases
 * GET /api/cases
 */
export const getAllCases = async (_req: Request, res: Response) => {
  try {
    const cases = await prisma.case.findMany({
      select: {
        id: true,
        title: true,
        age: true,
        sex: true,
        chiefComplaint: true,
        createdAt: true,
        // Don't include findings or diagnosis in list view
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      success: true,
      count: cases.length,
      data: cases,
    });
  } catch (error) {
    console.error('Error fetching cases:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cases',
    });
  }
};

/**
 * Get a single case by ID (without findings initially)
 * GET /api/cases/:id
 */
export const getCaseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const caseData = await prisma.case.findUnique({
      where: { id },
      include: {
        findings: false, // Don't include findings in initial fetch
      },
    });

    if (!caseData) {
      return res.status(404).json({
        success: false,
        error: 'Case not found',
      });
    }

    // Return case data without diagnosis (that's revealed after submission)
    const { diagnosis, keyFindings, ...caseWithoutDiagnosis } = caseData;

    res.json({
      success: true,
      data: caseWithoutDiagnosis,
    });
  } catch (error) {
    console.error('Error fetching case:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch case',
    });
  }
};

/**
 * Perform an examination maneuver on a case
 * POST /api/cases/:id/examine
 * Body: { region, maneuver, target?, location? }
 */
export const examineCase = async (req: Request, res: Response) => {
  try {
    const { id: caseId } = req.params;
    const { region, maneuver, target, location } = req.body;

    // Validate required fields
    if (!region || !maneuver) {
      return res.status(400).json({
        success: false,
        error: 'Region and maneuver are required',
      });
    }

    // Find matching finding
    const finding = await prisma.examFinding.findFirst({
      where: {
        caseId,
        region,
        maneuver,
        ...(target && { target }),
        ...(location && { location }),
      },
    });

    if (!finding) {
      // Return a generic "normal" finding if no specific finding exists
      return res.json({
        success: true,
        data: {
          finding: {
            id: 'normal',
            region,
            maneuver,
            target,
            location,
            findingType: 'text',
            description: 'Examination unremarkable. No abnormalities detected.',
            isAbnormal: false,
          },
        },
      });
    }

    res.json({
      success: true,
      data: {
        finding,
      },
    });
  } catch (error) {
    console.error('Error performing examination:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to perform examination',
    });
  }
};

/**
 * Parse natural language input to examination command
 * POST /api/cases/:id/parse-input
 * Body: { input: string }
 *
 * NOTE: This endpoint will use Claude API in Phase 2
 * For now, returns a simple parser response
 */
export const parseNaturalLanguageInput = async (req: Request, res: Response) => {
  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({
        success: false,
        error: 'Input text is required',
      });
    }

    // TODO: Implement Claude API parsing in Phase 2
    // For now, return a placeholder response
    res.json({
      success: true,
      data: {
        parsed: {
          confidence: 0,
          clarificationNeeded: 'Natural language parsing will be available in Phase 2. Please use the click interface for now.',
        },
      },
    });
  } catch (error) {
    console.error('Error parsing input:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to parse input',
    });
  }
};
