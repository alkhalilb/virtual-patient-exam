import { useLocation, useNavigate } from 'react-router-dom';
import './FeedbackPage.css';

export default function FeedbackPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="feedback-page">
        <div className="error">No feedback available</div>
        <button onClick={() => navigate('/')}>Return to Cases</button>
      </div>
    );
  }

  const { score, correctDiagnosis, keyFindingsMissed } = result;

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#27ae60';
    if (score >= 70) return '#f39c12';
    return '#e74c3c';
  };

  return (
    <div className="feedback-page">
      <div className="feedback-container">
        <header className="feedback-header">
          <h1>Examination Complete</h1>
          <p>Here's how you did:</p>
        </header>

        <div className="score-summary">
          <div
            className="overall-score"
            style={{ borderColor: getScoreColor(score.overallScore) }}
          >
            <div className="score-label">Overall Score</div>
            <div
              className="score-value"
              style={{ color: getScoreColor(score.overallScore) }}
            >
              {score.overallScore}%
            </div>
          </div>

          <div className="score-breakdown">
            <div className="score-item">
              <span className="score-category">Completeness</span>
              <div className="score-bar">
                <div
                  className="score-fill"
                  style={{
                    width: `${score.completeness}%`,
                    backgroundColor: getScoreColor(score.completeness),
                  }}
                />
              </div>
              <span className="score-percentage">{score.completeness}%</span>
            </div>

            <div className="score-item">
              <span className="score-category">Efficiency</span>
              <div className="score-bar">
                <div
                  className="score-fill"
                  style={{
                    width: `${score.efficiency}%`,
                    backgroundColor: getScoreColor(score.efficiency),
                  }}
                />
              </div>
              <span className="score-percentage">{score.efficiency}%</span>
            </div>

            <div className="score-item">
              <span className="score-category">Diagnosis Accuracy</span>
              <div className="score-bar">
                <div
                  className="score-fill"
                  style={{
                    width: `${score.diagnosisAccuracy}%`,
                    backgroundColor: getScoreColor(score.diagnosisAccuracy),
                  }}
                />
              </div>
              <span className="score-percentage">{score.diagnosisAccuracy}%</span>
            </div>
          </div>
        </div>

        <div className="feedback-section">
          <h2>Correct Diagnosis</h2>
          <div className="diagnosis-box">
            {correctDiagnosis}
          </div>
        </div>

        {score.feedback && score.feedback.length > 0 && (
          <div className="feedback-section">
            <h2>Feedback</h2>
            <ul className="feedback-list">
              {score.feedback.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {keyFindingsMissed && keyFindingsMissed.length > 0 && (
          <div className="feedback-section missed-findings">
            <h2>Key Findings Missed</h2>
            <div className="missed-list">
              {keyFindingsMissed.map((finding: any) => (
                <div key={finding.id} className="missed-item">
                  <strong>{finding.region} - {finding.maneuver}</strong>
                  <p>{finding.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="feedback-actions">
          <button onClick={() => navigate('/')} className="home-button">
            Return to Cases
          </button>
          <button
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
