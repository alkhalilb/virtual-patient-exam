import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ExamPage from './pages/ExamPage';
import FeedbackPage from './pages/FeedbackPage';
import MediaGenerationPage from './pages/MediaGenerationPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/exam/:caseId" element={<ExamPage />} />
          <Route path="/feedback/:sessionId" element={<FeedbackPage />} />
          <Route path="/media-generation" element={<MediaGenerationPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
