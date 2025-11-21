import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { QuizProvider } from './contexts/QuizContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateQuiz from './pages/CreateQuiz';
import CreateQuizAI from './pages/CreateQuizAI';
import EditQuiz from './pages/EditQuiz';
import MyQuizzes from './pages/MyQuizzes';
import QuizView from './pages/QuizView';

function App() {
  return (
    <Router>
      <AuthProvider>
        <QuizProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/create" element={<CreateQuiz />} />
              <Route path="/create-ai" element={<CreateQuizAI />} />
              <Route path="/edit/:id" element={<EditQuiz />} />
              <Route path="/my-quizzes" element={<MyQuizzes />} />
              <Route path="/quiz/:id" element={<QuizView />} />
            </Routes>
          </Layout>
        </QuizProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
