import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizContext';
import { useAuth } from '../contexts/AuthContext';
import { PlusCircle, Trash2, Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import MultipleChoiceQuestion from '../components/questions/MultipleChoiceQuestion';
import TrueFalseQuestion from '../components/questions/TrueFalseQuestion';
import ImageMarkingQuestion from '../components/questions/ImageMarkingQuestion';

const EditQuiz = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { getQuizById, updateQuiz } = useQuiz();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [showAnswerImmediately, setShowAnswerImmediately] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const foundQuiz = getQuizById(id);
    if (foundQuiz) {
      if (!isAuthenticated || foundQuiz.creatorId !== user?.id) {
        navigate('/');
        return;
      }

      setQuiz(foundQuiz);
      setTitle(foundQuiz.title);
      setDescription(foundQuiz.description || '');
      setVisibility(foundQuiz.visibility);
      setShowAnswerImmediately(foundQuiz.showAnswerImmediately || false);
      setQuestions(foundQuiz.questions || []);
    } else {
      navigate('/');
    }
  }, [id, isAuthenticated, user]);

  const addQuestion = (type) => {
    const newQuestion = {
      id: Date.now().toString(),
      type,
      question: '',
      image: null,
      ...(type === 'multiple-choice' && {
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: ''
      }),
      ...(type === 'true-false' && {
        correctAnswer: true,
        explanation: ''
      }),
      ...(type === 'image-marking' && {
        markers: [],
        answerType: 'objective',
        options: ['', '', '', ''],
        correctAnswer: 0,
        discursiveAnswer: '',
        explanation: ''
      })
    };

    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (questionId, updates) => {
    setQuestions(questions.map(q =>
      q.id === questionId ? { ...q, ...updates } : q
    ));
  };

  const deleteQuestion = (questionId) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const handleSave = () => {
    setError('');

    if (!title.trim()) {
      setError('⚠️ Por favor, adicione um título ao quiz antes de salvar');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (questions.length === 0) {
      setError('⚠️ Por favor, adicione pelo menos uma pergunta ao quiz antes de salvar');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Validar perguntas
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        setError(`⚠️ Pergunta ${i + 1}: O texto da pergunta é obrigatório. Por favor, preencha o campo "Pergunta" antes de salvar.`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      if (q.type === 'multiple-choice') {
        const hasEmptyOption = q.options.some(opt => !opt.trim());
        if (hasEmptyOption) {
          setError(`⚠️ Pergunta ${i + 1}: Todas as 4 alternativas devem ser preenchidas. Por favor, complete todas as opções.`);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }

      if (q.type === 'image-marking' && !q.image) {
        setError(`⚠️ Pergunta ${i + 1}: Uma imagem é obrigatória para questões de Identificação por Marcação. Por favor, faça upload de uma imagem.`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      if (q.type === 'image-marking' && q.answerType === 'objective') {
        const hasEmptyOption = q.options.some(opt => !opt.trim());
        if (hasEmptyOption) {
          setError(`⚠️ Pergunta ${i + 1}: Todas as 4 alternativas devem ser preenchidas nas questões objetivas.`);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }

      if (q.type === 'image-marking' && q.answerType === 'discursive' && !q.discursiveAnswer?.trim()) {
        setError(`⚠️ Pergunta ${i + 1}: A "Resposta Esperada" é obrigatória para questões discursivas.`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    updateQuiz(id, {
      title,
      description,
      visibility,
      showAnswerImmediately,
      questions
    });

    navigate(`/quiz/${id}`);
  };

  if (!quiz) {
    return <div className="text-center">Carregando...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-brand-dark-blue hover:text-brand-light-blue"
        >
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </button>
      </div>

      <div className="card mb-6">
        <h1 className="text-3xl font-bold mb-6 text-brand-dark-blue">Editar Quiz</h1>

        {error && (
          <div className="bg-red-100 border-2 border-red-500 text-red-800 px-6 py-4 rounded-lg mb-6 shadow-lg animate-pulse">
            <div className="flex items-start space-x-3">
              <span className="text-3xl">⚠️</span>
              <div className="flex-1">
                <p className="font-bold text-lg mb-1">Erro na Validação</p>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Título do Quiz *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="Digite o título do quiz"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Descrição (opcional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
              rows="3"
              placeholder="Adicione uma descrição para o quiz"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Visibilidade
            </label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="input-field"
            >
              <option value="public">Público</option>
              <option value="unlisted">Não listado</option>
              <option value="private">Privado</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Exibição do Gabarito
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="answerDisplay"
                  checked={!showAnswerImmediately}
                  onChange={() => setShowAnswerImmediately(false)}
                  className="w-4 h-4 text-brand-light-blue"
                />
                <span>Mostrar gabarito apenas no final do quiz</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="answerDisplay"
                  checked={showAnswerImmediately}
                  onChange={() => setShowAnswerImmediately(true)}
                  className="w-4 h-4 text-brand-light-blue"
                />
                <span>Mostrar gabarito logo após responder cada pergunta</span>
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {showAnswerImmediately
                ? 'O aluno verá se acertou ou errou logo após responder cada pergunta.'
                : 'O aluno verá todos os resultados apenas ao finalizar o quiz.'}
            </p>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4 mb-6">
        {questions.map((question, index) => (
          <div key={question.id} className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-brand-dark-blue">
                Pergunta {index + 1} - {
                  question.type === 'multiple-choice' ? 'Múltipla Escolha' :
                  question.type === 'true-false' ? 'Verdadeiro ou Falso' :
                  'Identificação por Marcação'
                }
              </h3>
              <button
                onClick={() => deleteQuestion(question.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>

            {question.type === 'multiple-choice' && (
              <MultipleChoiceQuestion
                question={question}
                onChange={(updates) => updateQuestion(question.id, updates)}
              />
            )}

            {question.type === 'true-false' && (
              <TrueFalseQuestion
                question={question}
                onChange={(updates) => updateQuestion(question.id, updates)}
              />
            )}

            {question.type === 'image-marking' && (
              <ImageMarkingQuestion
                question={question}
                onChange={(updates) => updateQuestion(question.id, updates)}
              />
            )}
          </div>
        ))}
      </div>

      {/* Add Question Buttons */}
      <div className="card mb-6">
        <h3 className="text-xl font-bold mb-4 text-brand-dark-blue">Adicionar Pergunta</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => addQuestion('multiple-choice')}
            className="btn-outline flex flex-col items-center py-6"
          >
            <PlusCircle size={32} className="mb-2" />
            <span>Múltipla Escolha</span>
          </button>

          <button
            onClick={() => addQuestion('true-false')}
            className="btn-outline flex flex-col items-center py-6"
          >
            <PlusCircle size={32} className="mb-2" />
            <span>Verdadeiro ou Falso</span>
          </button>

          <button
            onClick={() => addQuestion('image-marking')}
            className="btn-outline flex flex-col items-center py-6"
          >
            <ImageIcon size={32} className="mb-2" />
            <span>Identificação por Marcação</span>
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="btn-outline"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="btn-primary flex items-center space-x-2"
        >
          <Save size={20} />
          <span>Salvar Alterações</span>
        </button>
      </div>
    </div>
  );
};

export default EditQuiz;
