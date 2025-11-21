import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizContext';
import { useAuth } from '../contexts/AuthContext';
import {
  Edit,
  Trash2,
  Copy,
  Eye,
  Share2,
  Lock,
  Globe,
  EyeOff,
  PlusCircle
} from 'lucide-react';

const MyQuizzes = () => {
  const { user, isAuthenticated } = useAuth();
  const { getUserQuizzes, deleteQuiz, duplicateQuiz, updateQuiz } = useQuiz();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <h2 className="text-2xl font-bold mb-4 text-brand-dark-blue">
            Acesso Negado
          </h2>
          <p className="text-gray-600 mb-4">
            Você precisa estar logado para ver seus quizzes.
          </p>
          <button onClick={() => navigate('/login')} className="btn-primary">
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

  const userQuizzes = getUserQuizzes(user.id);

  const handleDelete = async (quizId) => {
    try {
      await deleteQuiz(quizId);
      setShowDeleteConfirm(null);
    } catch (error) {
      alert('Erro ao excluir quiz: ' + error.message);
    }
  };

  const handleDuplicate = async (quizId) => {
    try {
      const duplicated = await duplicateQuiz(quizId);
      if (duplicated) {
        navigate(`/edit/${duplicated.id}`);
      }
    } catch (error) {
      alert('Erro ao duplicar quiz: ' + error.message);
    }
  };

  const toggleVisibility = async (quiz) => {
    try {
      const visibilityOrder = ['public', 'unlisted', 'private'];
      const currentIndex = visibilityOrder.indexOf(quiz.visibility);
      const nextIndex = (currentIndex + 1) % visibilityOrder.length;
      const newVisibility = visibilityOrder[nextIndex];

      await updateQuiz(quiz.id, {
        title: quiz.title,
        description: quiz.description,
        visibility: newVisibility,
        showAnswerImmediately: quiz.show_answer_immediately,
        questions: quiz.questions
      });
    } catch (error) {
      alert('Erro ao alterar visibilidade: ' + error.message);
    }
  };

  const getVisibilityIcon = (visibility) => {
    switch (visibility) {
      case 'public':
        return <Globe size={16} className="text-green-500" />;
      case 'unlisted':
        return <EyeOff size={16} className="text-yellow-500" />;
      case 'private':
        return <Lock size={16} className="text-red-500" />;
      default:
        return null;
    }
  };

  const getVisibilityLabel = (visibility) => {
    switch (visibility) {
      case 'public':
        return 'Público';
      case 'unlisted':
        return 'Não listado';
      case 'private':
        return 'Privado';
      default:
        return '';
    }
  };

  const copyShareLink = (quizId) => {
    const link = `${window.location.origin}/quiz/${quizId}`;
    navigator.clipboard.writeText(link);
    alert('Link copiado para a área de transferência!');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-brand-dark-blue">Meus Quizzes</h1>
        <Link to="/create" className="btn-primary flex items-center space-x-2">
          <PlusCircle size={20} />
          <span>Criar Novo Quiz</span>
        </Link>
      </div>

      {userQuizzes.length === 0 ? (
        <div className="card text-center py-12">
          <h3 className="text-2xl font-bold mb-2 text-gray-400">
            Você ainda não criou nenhum quiz
          </h3>
          <p className="text-gray-500 mb-6">
            Comece criando seu primeiro quiz agora!
          </p>
          <Link to="/create" className="btn-primary inline-flex items-center space-x-2">
            <PlusCircle size={20} />
            <span>Criar Primeiro Quiz</span>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userQuizzes.map((quiz) => (
            <div key={quiz.id} className="card">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-brand-dark-blue flex-1">
                  {quiz.title}
                </h3>
                <button
                  onClick={() => toggleVisibility(quiz)}
                  className="ml-2"
                  title={`Clique para alterar (atual: ${getVisibilityLabel(quiz.visibility)})`}
                >
                  {getVisibilityIcon(quiz.visibility)}
                </button>
              </div>

              {quiz.description && (
                <p className="text-gray-600 mb-3 text-sm">{quiz.description}</p>
              )}

              <div className="text-sm text-gray-500 mb-4">
                <p>Criado em: {new Date(quiz.createdAt).toLocaleDateString('pt-BR')}</p>
                <p>Perguntas: {quiz.questions?.length || 0}</p>
                <p>Visualizações: {quiz.views || 0}</p>
                <p>Tentativas: {quiz.attempts || 0}</p>
                <p className="flex items-center space-x-1 mt-1">
                  {getVisibilityIcon(quiz.visibility)}
                  <span>{getVisibilityLabel(quiz.visibility)}</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/quiz/${quiz.id}`}
                  className="flex-1 min-w-[120px] btn-outline text-center flex items-center justify-center space-x-1 text-sm py-2"
                >
                  <Eye size={16} />
                  <span>Visualizar</span>
                </Link>

                <Link
                  to={`/edit/${quiz.id}`}
                  className="flex-1 min-w-[120px] btn-primary text-center flex items-center justify-center space-x-1 text-sm py-2"
                >
                  <Edit size={16} />
                  <span>Editar</span>
                </Link>

                <button
                  onClick={() => copyShareLink(quiz.id)}
                  className="flex-1 min-w-[120px] bg-brand-light-blue hover:bg-brand-dark-blue text-white font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1 text-sm"
                  title="Copiar link de compartilhamento"
                >
                  <Share2 size={16} />
                  <span>Compartilhar</span>
                </button>

                <button
                  onClick={() => handleDuplicate(quiz.id)}
                  className="flex-1 min-w-[120px] bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1 text-sm"
                  title="Duplicar quiz"
                >
                  <Copy size={16} />
                  <span>Duplicar</span>
                </button>

                <button
                  onClick={() => setShowDeleteConfirm(quiz.id)}
                  className="flex-1 min-w-[120px] bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1 text-sm"
                >
                  <Trash2 size={16} />
                  <span>Excluir</span>
                </button>
              </div>

              {/* Delete Confirmation Modal */}
              {showDeleteConfirm === quiz.id && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-md">
                    <h3 className="text-xl font-bold mb-4 text-brand-dark-blue">
                      Confirmar Exclusão
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Tem certeza que deseja excluir o quiz "{quiz.title}"? Esta ação não pode ser desfeita.
                    </p>
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => setShowDeleteConfirm(null)}
                        className="btn-outline"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleDelete(quiz.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyQuizzes;
