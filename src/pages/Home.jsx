import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useQuiz } from '../contexts/QuizContext';
import { PlusCircle, TrendingUp, Users, Target } from 'lucide-react';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const { getPublicQuizzes } = useQuiz();

  const publicQuizzes = getPublicQuizzes();

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-dark-blue to-brand-light-blue text-white rounded-xl p-12 mb-8">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold mb-4">Bem-vindo ao QuizMAX</h1>
          <p className="text-xl mb-6">
            Crie, compartilhe e participe de quizzes interativos com diferentes tipos de perguntas.
            A plataforma definitiva para criar questionários envolventes em 2025.
          </p>
          {isAuthenticated ? (
            <Link
              to="/create"
              className="inline-flex items-center space-x-2 bg-brand-orange hover:bg-orange-600 px-6 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              <PlusCircle size={24} />
              <span>Criar Novo Quiz</span>
            </Link>
          ) : (
            <div className="flex space-x-4">
              <Link
                to="/register"
                className="inline-flex items-center space-x-2 bg-brand-orange hover:bg-orange-600 px-6 py-3 rounded-lg font-semibold text-lg transition-colors"
              >
                <span>Começar Agora</span>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center space-x-2 bg-white text-brand-dark-blue hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold text-lg transition-colors"
              >
                <span>Já tenho conta</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-brand-light-blue rounded-full flex items-center justify-center">
              <Target className="text-white" size={32} />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2 text-brand-dark-blue">Múltiplos Tipos de Perguntas</h3>
          <p className="text-gray-600">
            Escolha entre múltipla escolha, verdadeiro/falso e identificação por marcação de imagem.
          </p>
        </div>

        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-brand-orange rounded-full flex items-center justify-center">
              <Users className="text-white" size={32} />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2 text-brand-dark-blue">Compartilhamento Fácil</h3>
          <p className="text-gray-600">
            Gere links únicos e compartilhe seus quizzes com qualquer pessoa.
          </p>
        </div>

        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-brand-light-blue rounded-full flex items-center justify-center">
              <TrendingUp className="text-white" size={32} />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2 text-brand-dark-blue">Acompanhe Resultados</h3>
          <p className="text-gray-600">
            Veja quantas pessoas visualizaram e tentaram seus quizzes.
          </p>
        </div>
      </div>

      {/* Public Quizzes */}
      {publicQuizzes.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold mb-6 text-brand-dark-blue">Quizzes Públicos</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicQuizzes.map((quiz) => (
              <Link
                key={quiz.id}
                to={`/quiz/${quiz.id}`}
                className="card hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold mb-2 text-brand-dark-blue">{quiz.title}</h3>
                {quiz.description && (
                  <p className="text-gray-600 mb-3">{quiz.description}</p>
                )}
                <div className="text-sm text-gray-500">
                  <p>Criado por: {quiz.creatorName}</p>
                  <p>
                    {new Date(quiz.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="mt-2">
                    {quiz.views || 0} visualizações • {quiz.attempts || 0} tentativas
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {publicQuizzes.length === 0 && (
        <div className="card text-center py-12">
          <h3 className="text-2xl font-bold mb-2 text-gray-400">Nenhum quiz público ainda</h3>
          <p className="text-gray-500">
            {isAuthenticated
              ? 'Seja o primeiro a criar um quiz público!'
              : 'Faça login para criar o primeiro quiz público!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
