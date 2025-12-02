import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.performedManeuver.deleteMany();
  await prisma.studentSession.deleteMany();
  await prisma.examFinding.deleteMany();
  await prisma.case.deleteMany();

  console.log('✅ Cleared existing data');

  // ============================================================================
  // CASE 1: CHF (Congestive Heart Failure) Exacerbation
  // ============================================================================

  const chfCase = await prisma.case.create({
    data: {
      title: 'CHF Exacerbation',
      age: 65,
      sex: 'Male',
      chiefComplaint: 'Shortness of breath and leg swelling',

      // History
      hpi: 'Patient is a 65-year-old male presenting with progressive shortness of breath over the past week, worse when lying flat. He has been sleeping on three pillows. He also notes bilateral leg swelling up to his knees. He has gained 10 pounds in the last week. He has a history of coronary artery disease with an MI 2 years ago.',
      pmh: ['Coronary artery disease', 'Myocardial infarction (2 years ago)', 'Hypertension', 'Type 2 diabetes'],
      medications: ['Lisinopril 20mg daily', 'Metoprolol 50mg BID', 'Atorvastatin 40mg daily', 'Furosemide 40mg daily', 'Metformin 1000mg BID'],
      allergies: ['NKDA'],
      socialHistory: 'Former smoker (quit 5 years ago, 30 pack-year history). Drinks 1-2 beers per week. Retired construction worker.',
      familyHistory: 'Father died of MI at age 60. Mother with hypertension.',

      // Vital signs
      bp: '150/92',
      hr: 98,
      rr: 24,
      temp: 37.1,
      spo2: 92,

      diagnosis: 'Congestive Heart Failure Exacerbation',
      keyFindings: [], // Will be populated with finding IDs after creation
    },
  });

  console.log('✅ Created CHF case');

  // Create findings for CHF case
  const chfFindings = await Promise.all([
    // ===== GENERAL INSPECTION =====
    prisma.examFinding.create({
      data: {
        caseId: chfCase.id,
        region: 'head',
        maneuver: 'inspect',
        target: 'general',
        description: 'Patient appears mildly uncomfortable, sitting upright in bed. Mild respiratory distress noted.',
        findingType: 'text',
        isAbnormal: true,
      },
    }),

    // ===== NECK EXAM =====
    prisma.examFinding.create({
      data: {
        caseId: chfCase.id,
        region: 'neck',
        maneuver: 'inspect',
        target: 'jugular_venous_pressure',
        description: 'Jugular venous distention (JVD) present. JVP estimated at 12 cm H2O (elevated, normal <8 cm). Visible pulsations in internal jugular vein when patient at 45 degrees.',
        findingType: 'text',
        isAbnormal: true,
      },
    }),

    // ===== CARDIAC EXAM =====
    prisma.examFinding.create({
      data: {
        caseId: chfCase.id,
        region: 'chest',
        maneuver: 'inspect',
        target: 'precordium',
        description: 'No visible heave or thrill. Apex beat displaced laterally to anterior axillary line, suggesting cardiomegaly.',
        findingType: 'text',
        isAbnormal: true,
      },
    }),

    prisma.examFinding.create({
      data: {
        caseId: chfCase.id,
        region: 'chest',
        maneuver: 'palpate',
        target: 'apex',
        description: 'Point of maximal impulse (PMI) palpated in the 6th intercostal space, anterior axillary line. Sustained and displaced, indicating left ventricular hypertrophy.',
        findingType: 'text',
        isAbnormal: true,
      },
    }),

    prisma.examFinding.create({
      data: {
        caseId: chfCase.id,
        region: 'chest',
        maneuver: 'auscultate',
        target: 'heart',
        location: 'apex',
        description: 'S3 gallop heard at apex, best with bell of stethoscope in left lateral decubitus position. S1 and S2 present. No S4. Regular rate and rhythm.',
        findingType: 'audio',
        mediaUrl: '/media/audio/s3-gallop.mp3',
        isAbnormal: true,
      },
    }),

    prisma.examFinding.create({
      data: {
        caseId: chfCase.id,
        region: 'chest',
        maneuver: 'auscultate',
        target: 'heart',
        location: 'mitral_area',
        description: 'Possible soft holosystolic murmur at mitral area, suggesting functional mitral regurgitation. S3 gallop prominent.',
        findingType: 'audio',
        mediaUrl: '/media/audio/mitral-regurg-functional.mp3',
        isAbnormal: true,
      },
    }),

    // ===== LUNG EXAM =====
    prisma.examFinding.create({
      data: {
        caseId: chfCase.id,
        region: 'chest',
        maneuver: 'inspect',
        target: 'respiratory',
        description: 'Increased work of breathing noted. Using accessory muscles. Respiratory rate 24 breaths per minute.',
        findingType: 'text',
        isAbnormal: true,
      },
    }),

    prisma.examFinding.create({
      data: {
        caseId: chfCase.id,
        region: 'back',
        maneuver: 'auscultate',
        target: 'lungs',
        location: 'bilateral_bases',
        description: 'Bilateral inspiratory crackles (rales) heard at lung bases, extending up to mid-lung fields. Consistent with pulmonary edema.',
        findingType: 'audio',
        mediaUrl: '/media/audio/crackles-bilateral.mp3',
        isAbnormal: true,
      },
    }),

    prisma.examFinding.create({
      data: {
        caseId: chfCase.id,
        region: 'back',
        maneuver: 'percuss',
        target: 'lungs',
        location: 'bilateral_bases',
        description: 'Dullness to percussion at bilateral lung bases, suggesting pleural effusions.',
        findingType: 'text',
        isAbnormal: true,
      },
    }),

    // ===== ABDOMINAL EXAM =====
    prisma.examFinding.create({
      data: {
        caseId: chfCase.id,
        region: 'abdomen',
        maneuver: 'inspect',
        target: 'general',
        description: 'Abdomen soft, non-distended. No visible pulsations or masses.',
        findingType: 'text',
        isAbnormal: false,
      },
    }),

    prisma.examFinding.create({
      data: {
        caseId: chfCase.id,
        region: 'abdomen',
        maneuver: 'palpate',
        target: 'liver',
        location: 'right_upper_quadrant',
        description: 'Liver palpable 3 cm below costal margin, smooth, tender. Hepatomegaly due to hepatic congestion.',
        findingType: 'text',
        isAbnormal: true,
      },
    }),

    prisma.examFinding.create({
      data: {
        caseId: chfCase.id,
        region: 'abdomen',
        maneuver: 'palpate',
        target: 'hepatojugular_reflux',
        description: 'Hepatojugular reflux positive. Sustained pressure on RUQ causes JVP to rise >4 cm and remain elevated.',
        findingType: 'text',
        isAbnormal: true,
      },
    }),

    // ===== EXTREMITY EXAM =====
    prisma.examFinding.create({
      data: {
        caseId: chfCase.id,
        region: 'lower_extremity_left',
        maneuver: 'inspect',
        target: 'general',
        description: 'Bilateral lower extremity edema present, extending to mid-calf. 2+ pitting edema noted.',
        findingType: 'image',
        mediaUrl: '/media/images/pitting-edema-bilateral.jpg',
        isAbnormal: true,
      },
    }),

    prisma.examFinding.create({
      data: {
        caseId: chfCase.id,
        region: 'lower_extremity_right',
        maneuver: 'inspect',
        target: 'general',
        description: 'Bilateral lower extremity edema present, extending to mid-calf. 2+ pitting edema noted. Symmetric.',
        findingType: 'image',
        mediaUrl: '/media/images/pitting-edema-bilateral.jpg',
        isAbnormal: true,
      },
    }),

    prisma.examFinding.create({
      data: {
        caseId: chfCase.id,
        region: 'lower_extremity_left',
        maneuver: 'palpate',
        target: 'edema',
        description: 'Pitting edema to mid-calf bilaterally. Indent remains for >5 seconds after pressure. No calf tenderness.',
        findingType: 'text',
        isAbnormal: true,
      },
    }),

    prisma.examFinding.create({
      data: {
        caseId: chfCase.id,
        region: 'lower_extremity_left',
        maneuver: 'palpate',
        target: 'pulses',
        description: 'Dorsalis pedis and posterior tibial pulses 2+ bilaterally and symmetric.',
        findingType: 'text',
        isAbnormal: false,
      },
    }),
  ]);

  console.log(`✅ Created ${chfFindings.length} findings for CHF case`);

  // Update case with key findings
  const keyFindingIds = chfFindings
    .filter(f =>
      f.target === 'jugular_venous_pressure' ||
      f.target === 'heart' && f.location === 'apex' ||
      f.target === 'lungs' && f.location === 'bilateral_bases' ||
      f.target === 'edema'
    )
    .map(f => f.id);

  await prisma.case.update({
    where: { id: chfCase.id },
    data: { keyFindings: keyFindingIds },
  });

  console.log('✅ Updated CHF case with key findings');

  // ============================================================================
  // CASE 2: COPD Exacerbation
  // ============================================================================

  const copdCase = await prisma.case.create({
    data: {
      title: 'COPD Exacerbation',
      age: 68,
      sex: 'Female',
      chiefComplaint: 'Worsening shortness of breath and cough',

      hpi: 'A 68-year-old female with known COPD presents with worsening shortness of breath and productive cough for 3 days. Sputum is yellowish-green. She has been using her rescue inhaler more frequently. She denies fever but feels more fatigued than usual.',
      pmh: ['COPD (GOLD Stage 3)', 'Hypertension', 'Former smoker'],
      medications: ['Albuterol inhaler PRN', 'Tiotropium daily', 'Fluticasone/salmeterol BID', 'Amlodipine 5mg daily'],
      allergies: ['Penicillin (rash)'],
      socialHistory: 'Former smoker - quit 5 years ago, 45 pack-year history. Lives alone, retired teacher.',
      familyHistory: 'Mother had emphysema.',

      bp: '138/84',
      hr: 102,
      rr: 26,
      temp: 37.4,
      spo2: 88,

      diagnosis: 'Acute COPD Exacerbation',
      keyFindings: [],
    },
  });

  console.log('✅ Created COPD case');

  const copdFindings = await Promise.all([
    prisma.examFinding.create({
      data: {
        caseId: copdCase.id,
        region: 'chest',
        maneuver: 'inspect',
        target: 'respiratory',
        description: 'Barrel chest deformity noted. Pursed-lip breathing observed. Using accessory muscles of respiration. Prolonged expiratory phase.',
        findingType: 'text',
        isAbnormal: true,
      },
    }),

    prisma.examFinding.create({
      data: {
        caseId: copdCase.id,
        region: 'chest',
        maneuver: 'auscultate',
        target: 'lungs',
        location: 'bilateral',
        description: 'Diffuse expiratory wheezes throughout all lung fields. Decreased breath sounds bilaterally. Prolonged expiratory phase.',
        findingType: 'audio',
        mediaUrl: '/media/audio/wheezes-expiratory.mp3',
        isAbnormal: true,
      },
    }),

    prisma.examFinding.create({
      data: {
        caseId: copdCase.id,
        region: 'chest',
        maneuver: 'percuss',
        target: 'lungs',
        location: 'bilateral',
        description: 'Hyperresonance to percussion throughout lung fields bilaterally, consistent with air trapping.',
        findingType: 'text',
        isAbnormal: true,
      },
    }),

    prisma.examFinding.create({
      data: {
        caseId: copdCase.id,
        region: 'chest',
        maneuver: 'palpate',
        target: 'chest_expansion',
        description: 'Reduced chest expansion bilaterally, symmetric. Decreased tactile fremitus.',
        findingType: 'text',
        isAbnormal: true,
      },
    }),
  ]);

  await prisma.case.update({
    where: { id: copdCase.id },
    data: { keyFindings: copdFindings.map(f => f.id) },
  });

  console.log(`✅ Created ${copdFindings.length} findings for COPD case`);

  // ============================================================================
  // CASE 3: Pneumonia
  // ============================================================================

  const pneumoniaCase = await prisma.case.create({
    data: {
      title: 'Community-Acquired Pneumonia',
      age: 45,
      sex: 'Male',
      chiefComplaint: 'Fever, cough, and chest pain',

      hpi: 'A 45-year-old male presents with 4 days of fever, productive cough with green sputum, and right-sided chest pain that worsens with deep breathing. He also complains of chills and night sweats.',
      pmh: ['None'],
      medications: ['None'],
      allergies: ['NKDA'],
      socialHistory: 'Non-smoker, occasional alcohol use. Works as accountant.',
      familyHistory: 'Non-contributory',

      bp: '118/72',
      hr: 108,
      rr: 22,
      temp: 38.9,
      spo2: 93,

      diagnosis: 'Right Lower Lobe Pneumonia',
      keyFindings: [],
    },
  });

  const pneumoniaFindings = await Promise.all([
    prisma.examFinding.create({
      data: {
        caseId: pneumoniaCase.id,
        region: 'back',
        maneuver: 'auscultate',
        target: 'lungs',
        location: 'right_lower_lobe',
        description: 'Coarse crackles heard in right lower lobe. Bronchial breath sounds in same area.',
        findingType: 'audio',
        mediaUrl: '/media/audio/crackles-coarse.mp3',
        isAbnormal: true,
      },
    }),

    prisma.examFinding.create({
      data: {
        caseId: pneumoniaCase.id,
        region: 'back',
        maneuver: 'percuss',
        target: 'lungs',
        location: 'right_lower_lobe',
        description: 'Dullness to percussion over right lower lobe, consistent with consolidation.',
        findingType: 'text',
        isAbnormal: true,
      },
    }),

    prisma.examFinding.create({
      data: {
        caseId: pneumoniaCase.id,
        region: 'back',
        maneuver: 'palpate',
        target: 'tactile_fremitus',
        location: 'right_lower_lobe',
        description: 'Increased tactile fremitus over right lower lobe.',
        findingType: 'text',
        isAbnormal: true,
      },
    }),

    prisma.examFinding.create({
      data: {
        caseId: pneumoniaCase.id,
        region: 'back',
        maneuver: 'special_test',
        target: 'egophony',
        location: 'right_lower_lobe',
        description: 'Egophony present over right lower lobe ("E" to "A" change). Suggests consolidation.',
        findingType: 'text',
        isAbnormal: true,
      },
    }),
  ]);

  await prisma.case.update({
    where: { id: pneumoniaCase.id },
    data: { keyFindings: pneumoniaFindings.map(f => f.id) },
  });

  console.log(`✅ Created ${pneumoniaFindings.length} findings for Pneumonia case`);

  // Get final counts
  const casesCount = await prisma.case.count();
  const findingsCount = await prisma.examFinding.count();

  console.log('\n🎉 Database seeded successfully!');
  console.log(`📊 Summary:`);
  console.log(`   - ${casesCount} cases created`);
  console.log(`   - ${findingsCount} exam findings created`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
