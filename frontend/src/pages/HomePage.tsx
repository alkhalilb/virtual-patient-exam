import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCaseListStore } from '../store/caseListStore';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const { cases, isLoading, error, fetchCases } = useCaseListStore();

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const handleSelectCase = (caseId: string) => {
    navigate(`/exam/${caseId}`);
  };

  if (isLoading) {
    return (
      <div className="home-page">
        <div className="loading">Loading cases...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page">
        <div className="error">
          <h2>Error Loading Cases</h2>
          <p>{error}</p>
          <button onClick={() => fetchCases()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Virtual Patient Physical Examination Simulator</h1>
        <p>Select a case to begin practicing your examination skills</p>
        <button
          onClick={() => navigate('/media-generation')}
          className="media-generation-link"
        >
          🎨 Generate AI Media
        </button>
      </header>

      <div className="case-list">
        {cases.length === 0 ? (
          <div className="no-cases">
            <p>No cases available. Please seed the database.</p>
            <code>cd backend && npm run db:seed</code>
          </div>
        ) : (
          cases.map((caseItem) => (
            <div
              key={caseItem.id}
              className="case-card"
              onClick={() => handleSelectCase(caseItem.id)}
            >
              <h3>{caseItem.title}</h3>
              <div className="case-demographics">
                <span>{caseItem.age} year old {caseItem.sex}</span>
              </div>
              <div className="case-complaint">
                <strong>Chief Complaint:</strong> {caseItem.chiefComplaint}
              </div>
              <button className="start-button">
                Start Examination →
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
