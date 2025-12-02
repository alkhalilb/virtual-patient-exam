import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExamStore } from '../store/examStore';
import type { BodyRegion, ManeuverType } from '../types';
import './ExamPage.css';

export default function ExamPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const {
    currentCase,
    currentSession,
    currentFinding,
    performedFindings,
    isLoading,
    error,
    startSession,
    performExamination,
    resetExam,
  } = useExamStore();

  const [selectedRegion, setSelectedRegion] = useState<BodyRegion | null>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [diagnosis, setDiagnosis] = useState('');

  useEffect(() => {
    if (caseId) {
      resetExam();
      startSession(caseId);
    }
  }, [caseId, startSession, resetExam]);

  const handleRegionClick = (region: BodyRegion) => {
    setSelectedRegion(region);
  };

  const handleManeuverClick = async (maneuver: ManeuverType) => {
    if (selectedRegion) {
      await performExamination(selectedRegion, maneuver);
      // Keep region selected for multiple maneuvers
    }
  };

  const handleSubmitDiagnosis = async () => {
    if (!diagnosis.trim()) {
      alert('Please enter a diagnosis');
      return;
    }

    try {
      const result = await useExamStore.getState().submitDiagnosis(diagnosis);
      navigate(`/feedback/${currentSession?.id}`, { state: { result } });
    } catch (error: any) {
      alert('Error submitting diagnosis: ' + error.message);
    }
  };

  if (!caseId) {
    return <div>No case selected</div>;
  }

  if (isLoading && !currentCase) {
    return (
      <div className="exam-page">
        <div className="loading">Loading case...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="exam-page">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  if (!currentCase) {
    return (
      <div className="exam-page">
        <div className="error">Case not found</div>
      </div>
    );
  }

  const regions: { label: string; value: BodyRegion }[] = [
    { label: 'Head', value: 'head' },
    { label: 'Neck', value: 'neck' },
    { label: 'Chest', value: 'chest' },
    { label: 'Abdomen', value: 'abdomen' },
    { label: 'Back', value: 'back' },
    { label: 'Left Upper Extremity', value: 'upper_extremity_left' },
    { label: 'Right Upper Extremity', value: 'upper_extremity_right' },
    { label: 'Left Lower Extremity', value: 'lower_extremity_left' },
    { label: 'Right Lower Extremity', value: 'lower_extremity_right' },
  ];

  const maneuvers: { label: string; value: ManeuverType }[] = [
    { label: 'Inspect', value: 'inspect' },
    { label: 'Palpate', value: 'palpate' },
    { label: 'Percuss', value: 'percuss' },
    { label: 'Auscultate', value: 'auscultate' },
    { label: 'Special Test', value: 'special_test' },
    { label: 'Measure', value: 'measure' },
  ];

  return (
    <div className="exam-page">
      <header className="exam-header">
        <h2>{currentCase.title}</h2>
        <p className="patient-info">
          {currentCase.age} y/o {currentCase.sex} - {currentCase.chiefComplaint}
        </p>
        <div className="exam-actions">
          <button onClick={() => setShowSubmitDialog(true)} className="submit-button">
            Submit Diagnosis
          </button>
          <button onClick={() => navigate('/')} className="back-button">
            ← Back to Cases
          </button>
        </div>
      </header>

      <div className="exam-content">
        {/* Left Panel - Body Regions & Maneuvers */}
        <div className="exam-controls">
          <div className="control-section">
            <h3>Select Body Region</h3>
            <div className="region-list">
              {regions.map((region) => (
                <button
                  key={region.value}
                  className={`region-button ${
                    selectedRegion === region.value ? 'selected' : ''
                  }`}
                  onClick={() => handleRegionClick(region.value)}
                >
                  {region.label}
                </button>
              ))}
            </div>
          </div>

          {selectedRegion && (
            <div className="control-section">
              <h3>Select Maneuver</h3>
              <div className="maneuver-list">
                {maneuvers.map((maneuver) => (
                  <button
                    key={maneuver.value}
                    className="maneuver-button"
                    onClick={() => handleManeuverClick(maneuver.value)}
                    disabled={isLoading}
                  >
                    {maneuver.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="vital-signs">
            <h3>Vital Signs</h3>
            <ul>
              <li><strong>BP:</strong> {currentCase.bp}</li>
              <li><strong>HR:</strong> {currentCase.hr} bpm</li>
              <li><strong>RR:</strong> {currentCase.rr} /min</li>
              <li><strong>Temp:</strong> {currentCase.temp}°C</li>
              <li><strong>SpO2:</strong> {currentCase.spo2}%</li>
            </ul>
          </div>
        </div>

        {/* Right Panel - Findings Display */}
        <div className="findings-panel">
          {currentFinding ? (
            <div className="current-finding">
              <h3>Examination Finding</h3>
              <div className="finding-details">
                <div className="finding-location">
                  <strong>Region:</strong> {currentFinding.region}
                  {' • '}
                  <strong>Maneuver:</strong> {currentFinding.maneuver}
                </div>
                {currentFinding.isAbnormal && (
                  <span className="abnormal-badge">Abnormal</span>
                )}
                <p className="finding-description">{currentFinding.description}</p>
                {currentFinding.mediaUrl && (
                  <div className="media-placeholder">
                    <em>Media: {currentFinding.mediaUrl}</em>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="no-finding">
              <p>Select a body region and maneuver to begin examination</p>
            </div>
          )}

          {performedFindings.length > 0 && (
            <div className="findings-history">
              <h4>Examination History ({performedFindings.length})</h4>
              <div className="findings-list">
                {performedFindings.map((finding, index) => (
                  <div
                    key={index}
                    className={`finding-item ${finding.isAbnormal ? 'abnormal' : ''}`}
                  >
                    <strong>{finding.region}</strong> - {finding.maneuver}
                    {finding.isAbnormal && ' ⚠️'}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit Diagnosis Dialog */}
      {showSubmitDialog && (
        <div className="modal-overlay" onClick={() => setShowSubmitDialog(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Submit Your Diagnosis</h3>
            <textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="Enter your diagnosis..."
              rows={4}
              className="diagnosis-input"
            />
            <div className="modal-actions">
              <button onClick={handleSubmitDiagnosis} className="confirm-button">
                Submit
              </button>
              <button
                onClick={() => setShowSubmitDialog(false)}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
