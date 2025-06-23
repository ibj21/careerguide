import { Routes, Route } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import Profile from './components/Profile';
import Quiz from './components/Quiz';
import CareerPathPage from './pages/CareerPathPage';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthForm />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/path-recommendations/:career" element={<CareerPathPage />} />
      <Route path="/chatbot" element={<Chatbot />} />
    </Routes>
  );
}

export default App;
