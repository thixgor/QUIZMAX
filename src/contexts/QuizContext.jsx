import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const QuizContext = createContext();

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

export const QuizProvider = ({ children }) => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = () => {
    const storedQuizzes = JSON.parse(localStorage.getItem('quizmax_quizzes') || '[]');
    setQuizzes(storedQuizzes);
  };

  const createQuiz = (quizData) => {
    const newQuiz = {
      id: Date.now().toString(),
      ...quizData,
      creatorId: user?.id || 'anonymous',
      creatorName: user?.name || 'Anônimo',
      createdAt: new Date().toISOString(),
      views: 0,
      attempts: 0,
      questions: []
    };

    const updatedQuizzes = [...quizzes, newQuiz];
    setQuizzes(updatedQuizzes);
    localStorage.setItem('quizmax_quizzes', JSON.stringify(updatedQuizzes));

    return newQuiz;
  };

  const updateQuiz = (quizId, updates) => {
    const updatedQuizzes = quizzes.map(quiz =>
      quiz.id === quizId ? { ...quiz, ...updates, updatedAt: new Date().toISOString() } : quiz
    );

    setQuizzes(updatedQuizzes);
    localStorage.setItem('quizmax_quizzes', JSON.stringify(updatedQuizzes));
  };

  const deleteQuiz = (quizId) => {
    const updatedQuizzes = quizzes.filter(quiz => quiz.id !== quizId);
    setQuizzes(updatedQuizzes);
    localStorage.setItem('quizmax_quizzes', JSON.stringify(updatedQuizzes));
  };

  const duplicateQuiz = (quizId) => {
    const quizToDuplicate = quizzes.find(quiz => quiz.id === quizId);
    if (!quizToDuplicate) return;

    const duplicatedQuiz = {
      ...quizToDuplicate,
      id: Date.now().toString(),
      title: `${quizToDuplicate.title} (Cópia)`,
      createdAt: new Date().toISOString(),
      views: 0,
      attempts: 0
    };

    const updatedQuizzes = [...quizzes, duplicatedQuiz];
    setQuizzes(updatedQuizzes);
    localStorage.setItem('quizmax_quizzes', JSON.stringify(updatedQuizzes));

    return duplicatedQuiz;
  };

  const getQuizById = (quizId) => {
    return quizzes.find(quiz => quiz.id === quizId);
  };

  const getUserQuizzes = (userId) => {
    return quizzes.filter(quiz => quiz.creatorId === userId);
  };

  const getPublicQuizzes = () => {
    return quizzes.filter(quiz => quiz.visibility === 'public');
  };

  const incrementViews = (quizId) => {
    const updatedQuizzes = quizzes.map(quiz =>
      quiz.id === quizId ? { ...quiz, views: (quiz.views || 0) + 1 } : quiz
    );
    setQuizzes(updatedQuizzes);
    localStorage.setItem('quizmax_quizzes', JSON.stringify(updatedQuizzes));
  };

  const incrementAttempts = (quizId) => {
    const updatedQuizzes = quizzes.map(quiz =>
      quiz.id === quizId ? { ...quiz, attempts: (quiz.attempts || 0) + 1 } : quiz
    );
    setQuizzes(updatedQuizzes);
    localStorage.setItem('quizmax_quizzes', JSON.stringify(updatedQuizzes));
  };

  const value = {
    quizzes,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    duplicateQuiz,
    getQuizById,
    getUserQuizzes,
    getPublicQuizzes,
    incrementViews,
    incrementAttempts,
    loadQuizzes
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};
