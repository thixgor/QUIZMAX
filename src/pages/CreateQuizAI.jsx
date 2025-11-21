import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useQuiz } from '../contexts/QuizContext';
import { gerarQuestoesPorIA } from '../services/deepseekService';
import { Sparkles, ArrowLeft, Loader2, Zap, Brain } from 'lucide-react';

const CreateQuizAI = () => {
  const { user, isAuthenticated } = useAuth();
  const { createQuiz } = useQuiz();
  const navigate = useNavigate();

  const [tema, setTema] = useState('');
  const [quantidade, setQuantidade] = useState(3);
  const [dificuldade, setDificuldade] = useState('MÉDIA');
  const [modelo, setModelo] = useState(1);
  const [visibility, setVisibility] = useState('public');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <h2 className="text-2xl font-bold mb-4 text-brand-dark-blue">
            Acesso Negado
          </h2>
          <p className="text-gray-600 mb-4">
            Você precisa estar logado para criar quizzes com IA.
          </p>
          <button onClick={() => navigate('/login')} className="btn-primary">
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!tema.trim()) {
        setError('⚠️ Por favor, informe o tema do quiz');
        setLoading(false);
        return;
      }

      // Gerar questões usando IA
      const questoesGeradas = await gerarQuestoesPorIA({
        tema,
        quantidade,
        dificuldade,
        modelo
      });

      // Criar o quiz com as questões geradas
      const quizData = {
        title: `Quiz de ${tema} (Gerado por IA)`,
        description: `Quiz ${modelo === 1 ? 'rápido' : 'complexo'} sobre ${tema} - Dificuldade: ${dificuldade}`,
        visibility,
        showAnswerImmediately: true,
        questions: questoesGeradas
      };

      const newQuiz = await createQuiz(quizData);
      navigate(`/quiz/${newQuiz.id}`);

    } catch (error) {
      setError(`⚠️ ${error.message}`);
      console.error('Erro ao gerar quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-brand-dark-blue hover:text-brand-light-blue"
        >
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </button>
      </div>

      <div className="card">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-brand-light-blue rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-brand-dark-blue">Criar Quiz com IA</h2>
          <p className="text-gray-600 mt-2">
            Deixe a inteligência artificial criar questões personalizadas para você!
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border-2 border-red-500 text-red-800 px-6 py-4 rounded-lg mb-6 shadow-lg">
            <div className="flex items-start space-x-3">
              <span className="text-3xl">⚠️</span>
              <div className="flex-1">
                <p className="font-bold text-lg mb-1">Erro</p>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleGenerate} className="space-y-6">
          {/* Tema */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Tema do Quiz *
            </label>
            <input
              type="text"
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              className="input-field"
              placeholder="Ex: Fotossíntese, Segunda Guerra Mundial, Python..."
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Seja específico para melhores resultados
            </p>
          </div>

          {/* Quantidade de Questões */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Quantidade de Questões: {quantidade}
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={quantidade}
              onChange={(e) => setQuantidade(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5 (máx)</span>
            </div>
          </div>

          {/* Dificuldade */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Dificuldade
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setDificuldade('FÁCIL')}
                className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                  dificuldade === 'FÁCIL'
                    ? 'bg-green-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                😊 Fácil
              </button>
              <button
                type="button"
                onClick={() => setDificuldade('MÉDIA')}
                className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                  dificuldade === 'MÉDIA'
                    ? 'bg-yellow-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🤔 Média
              </button>
              <button
                type="button"
                onClick={() => setDificuldade('DIFÍCIL')}
                className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                  dificuldade === 'DIFÍCIL'
                    ? 'bg-red-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🔥 Difícil
              </button>
            </div>
          </div>

          {/* Modelo de Questão */}
          <div>
            <label className="block text-gray-700 font-semibold mb-3">
              Modelo de Questão
            </label>
            <div className="space-y-3">
              {/* Modelo 1 - Rápida */}
              <div
                onClick={() => setModelo(1)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  modelo === 1
                    ? 'border-brand-light-blue bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      modelo === 1 ? 'border-brand-light-blue' : 'border-gray-300'
                    }`}>
                      {modelo === 1 && (
                        <div className="w-3 h-3 rounded-full bg-brand-light-blue"></div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Zap size={20} className="text-yellow-500" />
                      <h3 className="font-bold text-lg">Modelo 1 - Questões Rápidas</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Questões diretas e objetivas, perfeitas para fixação cognitiva rápida e revisão de conceitos.
                      Enunciados claros e concisos com 4 alternativas.
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      ⚡ Ideal para: Revisão rápida, memorização, conceitos básicos
                    </p>
                  </div>
                </div>
              </div>

              {/* Modelo 2 - Complexa */}
              <div
                onClick={() => setModelo(2)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  modelo === 2
                    ? 'border-purple-500 bg-purple-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      modelo === 2 ? 'border-purple-500' : 'border-gray-300'
                    }`}>
                      {modelo === 2 && (
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Brain size={20} className="text-purple-500" />
                      <h3 className="font-bold text-lg">Modelo 2 - Questões Complexas</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Questões elaboradas com texto-base rico (artigos, cenários, dados), exigindo análise,
                      interpretação e aplicação prática. Distratores fortes e coesos.
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      🧠 Ideal para: Aprofundamento, análise crítica, aplicação de conhecimento
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visibilidade */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Visibilidade
            </label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="input-field"
            >
              <option value="public">Público - Qualquer pessoa pode ver</option>
              <option value="unlisted">Não listado - Apenas com o link</option>
              <option value="private">Privado - Apenas você</option>
            </select>
          </div>

          {/* Botão Gerar */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-outline flex-1"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Gerando com IA...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>Gerar Quiz</span>
                </>
              )}
            </button>
          </div>
        </form>

        {loading && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Loader2 className="animate-spin text-brand-light-blue" size={24} />
              <div>
                <p className="font-semibold text-brand-dark-blue">
                  Gerando suas questões...
                </p>
                <p className="text-sm text-gray-600">
                  A IA está criando {quantidade} questão(ões) {modelo === 1 ? 'rápida(s)' : 'complexa(s)'} sobre {tema}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateQuizAI;
