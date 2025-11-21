import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadQuizzes();
    } else {
      loadPublicQuizzes();
    }
  }, [user]);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setQuizzes(data || []);
    } catch (error) {
      console.error('Erro ao carregar quizzes:', error);
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const loadPublicQuizzes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('visibility', 'public')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setQuizzes(data || []);
    } catch (error) {
      console.error('Erro ao carregar quizzes públicos:', error);
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const createQuiz = async (quizData) => {
    try {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const newQuiz = {
        creator_id: user.id,
        title: quizData.title,
        description: quizData.description || null,
        visibility: quizData.visibility || 'private',
        show_answer_immediately: quizData.showAnswerImmediately || false,
        questions: quizData.questions || [],
        views: 0,
        attempts: 0
      };

      const { data, error } = await supabase
        .from('quizzes')
        .insert([newQuiz])
        .select()
        .single();

      if (error) throw error;

      setQuizzes([data, ...quizzes]);
      return data;
    } catch (error) {
      console.error('Erro ao criar quiz:', error);
      throw error;
    }
  };

  const updateQuiz = async (quizId, updates) => {
    try {
      const updateData = {
        title: updates.title,
        description: updates.description,
        visibility: updates.visibility,
        show_answer_immediately: updates.showAnswerImmediately,
        questions: updates.questions
      };

      const { data, error } = await supabase
        .from('quizzes')
        .update(updateData)
        .eq('id', quizId)
        .select()
        .single();

      if (error) throw error;

      setQuizzes(quizzes.map(quiz => quiz.id === quizId ? data : quiz));
    } catch (error) {
      console.error('Erro ao atualizar quiz:', error);
      throw error;
    }
  };

  const deleteQuiz = async (quizId) => {
    try {
      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', quizId);

      if (error) throw error;

      setQuizzes(quizzes.filter(quiz => quiz.id !== quizId));
    } catch (error) {
      console.error('Erro ao deletar quiz:', error);
      throw error;
    }
  };

  const duplicateQuiz = async (quizId) => {
    try {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const quizToDuplicate = quizzes.find(quiz => quiz.id === quizId);
      if (!quizToDuplicate) throw new Error('Quiz não encontrado');

      const duplicatedQuiz = {
        creator_id: user.id,
        title: `${quizToDuplicate.title} (Cópia)`,
        description: quizToDuplicate.description,
        visibility: quizToDuplicate.visibility,
        show_answer_immediately: quizToDuplicate.show_answer_immediately,
        questions: quizToDuplicate.questions,
        views: 0,
        attempts: 0
      };

      const { data, error } = await supabase
        .from('quizzes')
        .insert([duplicatedQuiz])
        .select()
        .single();

      if (error) throw error;

      setQuizzes([data, ...quizzes]);
      return data;
    } catch (error) {
      console.error('Erro ao duplicar quiz:', error);
      throw error;
    }
  };

  const getQuizById = (quizId) => {
    return quizzes.find(quiz => quiz.id === quizId);
  };

  const getUserQuizzes = (userId) => {
    return quizzes.filter(quiz => quiz.creator_id === userId);
  };

  const getPublicQuizzes = () => {
    return quizzes.filter(quiz => quiz.visibility === 'public');
  };

  const incrementViews = async (quizId) => {
    try {
      const quiz = quizzes.find(q => q.id === quizId);
      if (!quiz) return;

      const { error } = await supabase
        .from('quizzes')
        .update({ views: (quiz.views || 0) + 1 })
        .eq('id', quizId);

      if (error) throw error;

      setQuizzes(quizzes.map(q =>
        q.id === quizId ? { ...q, views: (q.views || 0) + 1 } : q
      ));
    } catch (error) {
      console.error('Erro ao incrementar visualizações:', error);
    }
  };

  const incrementAttempts = async (quizId) => {
    try {
      const quiz = quizzes.find(q => q.id === quizId);
      if (!quiz) return;

      const { error } = await supabase
        .from('quizzes')
        .update({ attempts: (quiz.attempts || 0) + 1 })
        .eq('id', quizId);

      if (error) throw error;

      setQuizzes(quizzes.map(q =>
        q.id === quizId ? { ...q, attempts: (q.attempts || 0) + 1 } : q
      ));
    } catch (error) {
      console.error('Erro ao incrementar tentativas:', error);
    }
  };

  const value = {
    quizzes,
    loading,
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
