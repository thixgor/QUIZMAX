import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizContext';
import { ArrowLeft, CheckCircle, XCircle, Share2, User, Calendar } from 'lucide-react';

const QuizView = () => {
  const { id } = useParams();
  const { getQuizById, incrementViews, incrementAttempts } = useQuiz();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const foundQuiz = getQuizById(id);
    if (foundQuiz) {
      setQuiz(foundQuiz);
      incrementViews(id);
    }
  }, [id]);

  if (!quiz) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <h2 className="text-2xl font-bold mb-4 text-brand-dark-blue">
            Quiz não encontrado
          </h2>
          <p className="text-gray-600 mb-4">
            O quiz que você está procurando não existe ou foi removido.
          </p>
          <Link to="/" className="btn-primary">
            Voltar para Início
          </Link>
        </div>
      </div>
    );
  }

  // Verificar se o quiz tem perguntas
  if (!quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <h2 className="text-2xl font-bold mb-4 text-brand-dark-blue">
            Quiz sem perguntas
          </h2>
          <p className="text-gray-600 mb-4">
            Este quiz ainda não possui perguntas cadastradas.
          </p>
          <Link to="/" className="btn-primary">
            Voltar para Início
          </Link>
        </div>
      </div>
    );
  }

  const handleStart = () => {
    setHasStarted(true);
    incrementAttempts(id);
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });

    // Mostrar feedback imediato se a opção estiver ativada
    if (quiz.showAnswerImmediately) {
      setShowFeedback(true);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowFeedback(false); // Resetar feedback ao avançar
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowFeedback(false); // Resetar feedback ao voltar
    }
  };

  const isCurrentAnswerCorrect = () => {
    const question = quiz.questions[currentQuestion];
    const userAnswer = answers[question.id];

    if (question.type === 'multiple-choice') {
      return userAnswer === question.correctAnswer;
    } else if (question.type === 'true-false') {
      return userAnswer === question.correctAnswer;
    } else if (question.type === 'image-marking') {
      if (question.answerType === 'objective') {
        return userAnswer === question.correctAnswer;
      } else if (question.answerType === 'discursive') {
        return checkDiscursiveAnswer(userAnswer, question);
      }
    }
    return false;
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const checkDiscursiveAnswer = (userAnswer, question) => {
    if (!userAnswer || typeof userAnswer !== 'string') return false;

    const normalizeText = (text) => text.toLowerCase().trim();
    const normalizedUserAnswer = normalizeText(userAnswer);

    // Verificar resposta principal
    if (normalizedUserAnswer === normalizeText(question.discursiveAnswer || '')) {
      return true;
    }

    // Verificar sinônimos/respostas alternativas
    if (question.acceptedAnswers) {
      const acceptedAnswers = question.acceptedAnswers
        .split(',')
        .map(ans => normalizeText(ans))
        .filter(ans => ans.length > 0);

      return acceptedAnswers.some(accepted => normalizedUserAnswer === accepted);
    }

    return false;
  };

  const calculateScore = () => {
    let correct = 0;
    let total = 0;

    quiz.questions.forEach((question) => {
      const userAnswer = answers[question.id];
      total++; // Contar todas as perguntas

      if (question.type === 'multiple-choice') {
        if (userAnswer === question.correctAnswer) {
          correct++;
        }
      } else if (question.type === 'true-false') {
        if (userAnswer === question.correctAnswer) {
          correct++;
        }
      } else if (question.type === 'image-marking') {
        if (question.answerType === 'objective') {
          if (userAnswer === question.correctAnswer) {
            correct++;
          }
        } else if (question.answerType === 'discursive') {
          if (checkDiscursiveAnswer(userAnswer, question)) {
            correct++;
          }
        }
      }
    });

    return {
      correct,
      total,
      percentage: total > 0 ? Math.round((correct / total) * 100) : 0
    };
  };

  const copyShareLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    alert('Link copiado para a área de transferência!');
  };

  // Quiz Info Page
  if (!hasStarted) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-brand-dark-blue hover:text-brand-light-blue"
          >
            <ArrowLeft size={20} />
            <span>Voltar</span>
          </button>
        </div>

        <div className="card">
          <h1 className="text-4xl font-bold mb-4 text-brand-dark-blue">{quiz.title}</h1>

          {quiz.description && (
            <p className="text-lg text-gray-600 mb-6">{quiz.description}</p>
          )}

          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="grid md:grid-cols-2 gap-4 text-gray-600">
              <div className="flex items-center space-x-2">
                <User size={20} className="text-brand-light-blue" />
                <span>Criado por: <strong>{quiz.creatorName}</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={20} className="text-brand-light-blue" />
                <span>
                  {new Date(quiz.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-lg mb-2 text-brand-dark-blue">Informações do Quiz</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Total de perguntas: <strong>{quiz.questions.length}</strong></li>
              <li>• Visualizações: <strong>{quiz.views || 0}</strong></li>
              <li>• Tentativas: <strong>{quiz.attempts || 0}</strong></li>
            </ul>
          </div>

          <div className="flex space-x-4">
            <button onClick={handleStart} className="btn-primary flex-1">
              Iniciar Quiz
            </button>
            <button onClick={copyShareLink} className="btn-secondary flex items-center space-x-2">
              <Share2 size={20} />
              <span>Compartilhar</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results Page
  if (showResults) {
    const score = calculateScore();

    return (
      <div className="max-w-3xl mx-auto">
        <div className="card">
          <h1 className="text-4xl font-bold mb-6 text-brand-dark-blue text-center">
            Resultados
          </h1>

          <div className="bg-gradient-to-r from-brand-dark-blue to-brand-light-blue text-white rounded-lg p-8 mb-6 text-center">
            <div className="text-6xl font-bold mb-2">{score.percentage}%</div>
            <div className="text-xl">
              {score.correct} de {score.total} questões corretas
            </div>
          </div>

          <div className="space-y-6">
            {quiz.questions.map((question, index) => {
              const userAnswer = answers[question.id];
              let isCorrect = null;

              if (question.type === 'true-false') {
                isCorrect = userAnswer === question.correctAnswer;
              } else if (question.type === 'multiple-choice') {
                isCorrect = userAnswer === question.correctAnswer;
              } else if (question.type === 'image-marking') {
                if (question.answerType === 'objective') {
                  isCorrect = userAnswer === question.correctAnswer;
                } else if (question.answerType === 'discursive') {
                  isCorrect = checkDiscursiveAnswer(userAnswer, question);
                }
              }

              return (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3 mb-3">
                    {isCorrect !== null && (
                      isCorrect ? (
                        <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={24} />
                      ) : (
                        <XCircle className="text-red-500 flex-shrink-0 mt-1" size={24} />
                      )
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">
                        Pergunta {index + 1}: {question.question}
                      </h3>

                      {question.image && (
                        <div className="relative inline-block mb-3">
                          <img
                            src={question.image}
                            alt="Imagem da questão"
                            className="max-w-md rounded-lg"
                          />
                          {/* Renderizar marcações se existirem */}
                          {question.markers && question.markers.length > 0 && (
                            <svg
                              className="absolute top-0 left-0 w-full h-full pointer-events-none"
                              style={{ zIndex: 10 }}
                            >
                              {question.markers.map((marker) => (
                                <g key={marker.id}>
                                  {marker.type === 'arrow' && (
                                    <>
                                      <defs>
                                        <marker
                                          id={`arrowhead-result-${marker.id}`}
                                          markerWidth="10"
                                          markerHeight="10"
                                          refX="9"
                                          refY="3"
                                          orient="auto"
                                        >
                                          <polygon points="0 0, 10 3, 0 6" fill={marker.color || '#F18D2F'} />
                                        </marker>
                                      </defs>
                                      <line
                                        x1={marker.x}
                                        y1={marker.y}
                                        x2={marker.endX}
                                        y2={marker.endY}
                                        stroke={marker.color || '#F18D2F'}
                                        strokeWidth="3"
                                        markerEnd={`url(#arrowhead-result-${marker.id})`}
                                      />
                                    </>
                                  )}
                                  {marker.type === 'circle' && (
                                    <circle
                                      cx={marker.x}
                                      cy={marker.y}
                                      r={marker.radius}
                                      stroke={marker.color || '#F18D2F'}
                                      strokeWidth="3"
                                      fill="none"
                                    />
                                  )}
                                  {marker.type === 'point' && (
                                    <circle
                                      cx={marker.x}
                                      cy={marker.y}
                                      r="8"
                                      fill={marker.color || '#F18D2F'}
                                    />
                                  )}
                                </g>
                              ))}
                            </svg>
                          )}
                        </div>
                      )}

                      {question.type === 'true-false' && (
                        <div className="space-y-2">
                          <p>
                            Sua resposta:{' '}
                            <strong className={userAnswer === question.correctAnswer ? 'text-green-600' : 'text-red-600'}>
                              {userAnswer === true ? 'Verdadeiro' : userAnswer === false ? 'Falso' : 'Não respondida'}
                            </strong>
                          </p>
                          <p>
                            Resposta correta: <strong className="text-green-600">
                              {question.correctAnswer ? 'Verdadeiro' : 'Falso'}
                            </strong>
                          </p>
                        </div>
                      )}

                      {(question.type === 'multiple-choice' ||
                        (question.type === 'image-marking' && question.answerType === 'objective')) && (
                        <div className="space-y-2">
                          {question.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={`p-2 rounded ${
                                optIndex === question.correctAnswer
                                  ? 'bg-green-100 border border-green-500'
                                  : userAnswer === optIndex
                                  ? 'bg-red-100 border border-red-500'
                                  : 'bg-gray-50'
                              }`}
                            >
                              {String.fromCharCode(65 + optIndex)}. {option}
                              {optIndex === question.correctAnswer && ' ✓'}
                              {userAnswer === optIndex && optIndex !== question.correctAnswer && ' ✗'}
                            </div>
                          ))}
                        </div>
                      )}

                      {question.type === 'image-marking' && question.answerType === 'discursive' && (
                        <div>
                          <p className={`mb-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                            <strong>Sua resposta:</strong> <em>{userAnswer || 'Não respondida'}</em>
                            {isCorrect && ' ✓'}
                            {!isCorrect && userAnswer && ' ✗'}
                          </p>
                          <div className="bg-green-50 p-3 rounded border border-green-200">
                            <p><strong>Resposta esperada:</strong> {question.discursiveAnswer}</p>
                            {question.acceptedAnswers && (
                              <p className="text-sm mt-2">
                                <strong>Também aceito:</strong> {question.acceptedAnswers}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {question.explanation && (
                        <div className="mt-3 bg-blue-50 p-3 rounded border border-blue-200">
                          <strong>Explicação:</strong> {question.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => {
                setHasStarted(false);
                setCurrentQuestion(0);
                setAnswers({});
                setShowResults(false);
              }}
              className="btn-primary flex-1"
            >
              Tentar Novamente
            </button>
            <Link to="/" className="btn-outline flex-1 text-center">
              Voltar para Início
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Questions
  const question = quiz.questions[currentQuestion];

  // Verificação de segurança adicional
  if (!question) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <h2 className="text-2xl font-bold mb-4 text-brand-dark-blue">
            Erro ao carregar pergunta
          </h2>
          <p className="text-gray-600 mb-4">
            Ocorreu um erro ao carregar esta pergunta.
          </p>
          <button
            onClick={() => {
              setHasStarted(false);
              setCurrentQuestion(0);
            }}
            className="btn-primary"
          >
            Voltar ao Início do Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-4 flex justify-between items-center">
        <span className="text-gray-600">
          Pergunta {currentQuestion + 1} de {quiz.questions.length}
        </span>
        <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 ml-4">
          <div
            className="bg-brand-light-blue h-2 rounded-full transition-all"
            style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="card">
        <h2 className="text-2xl font-bold mb-4 text-brand-dark-blue">{question.question}</h2>

        {question.image && (
          <div className="mb-4 relative inline-block">
            <img
              src={question.image}
              alt="Imagem da questão"
              className="max-w-full rounded-lg"
            />
            {/* Renderizar marcações se existirem */}
            {question.markers && question.markers.length > 0 && (
              <svg
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{ zIndex: 10 }}
              >
                {question.markers.map((marker) => (
                  <g key={marker.id}>
                    {marker.type === 'arrow' && (
                      <>
                        <defs>
                          <marker
                            id={`arrowhead-${marker.id}`}
                            markerWidth="10"
                            markerHeight="10"
                            refX="9"
                            refY="3"
                            orient="auto"
                          >
                            <polygon points="0 0, 10 3, 0 6" fill={marker.color || '#F18D2F'} />
                          </marker>
                        </defs>
                        <line
                          x1={marker.x}
                          y1={marker.y}
                          x2={marker.endX}
                          y2={marker.endY}
                          stroke={marker.color || '#F18D2F'}
                          strokeWidth="3"
                          markerEnd={`url(#arrowhead-${marker.id})`}
                        />
                      </>
                    )}
                    {marker.type === 'circle' && (
                      <circle
                        cx={marker.x}
                        cy={marker.y}
                        r={marker.radius}
                        stroke={marker.color || '#F18D2F'}
                        strokeWidth="3"
                        fill="none"
                      />
                    )}
                    {marker.type === 'point' && (
                      <circle
                        cx={marker.x}
                        cy={marker.y}
                        r="8"
                        fill={marker.color || '#F18D2F'}
                      />
                    )}
                  </g>
                ))}
              </svg>
            )}
          </div>
        )}

        {question.type === 'multiple-choice' && (
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <label
                key={index}
                className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  answers[question.id] === index
                    ? 'border-brand-light-blue bg-blue-50'
                    : 'border-gray-300 hover:border-brand-light-blue'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  checked={answers[question.id] === index}
                  onChange={() => handleAnswer(question.id, index)}
                  className="mr-3"
                />
                <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
              </label>
            ))}
          </div>
        )}

        {question.type === 'true-false' && (
          <div className="flex space-x-4">
            <button
              onClick={() => handleAnswer(question.id, true)}
              className={`flex-1 py-6 rounded-lg border-2 font-semibold text-lg transition-all ${
                answers[question.id] === true
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'bg-white border-gray-300 hover:border-green-500'
              }`}
            >
              Verdadeiro
            </button>
            <button
              onClick={() => handleAnswer(question.id, false)}
              className={`flex-1 py-6 rounded-lg border-2 font-semibold text-lg transition-all ${
                answers[question.id] === false
                  ? 'bg-red-500 border-red-500 text-white'
                  : 'bg-white border-gray-300 hover:border-red-500'
              }`}
            >
              Falso
            </button>
          </div>
        )}

        {question.type === 'image-marking' && question.answerType === 'objective' && (
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <label
                key={index}
                className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  answers[question.id] === index
                    ? 'border-brand-light-blue bg-blue-50'
                    : 'border-gray-300 hover:border-brand-light-blue'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  checked={answers[question.id] === index}
                  onChange={() => handleAnswer(question.id, index)}
                  className="mr-3"
                />
                <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
              </label>
            ))}
          </div>
        )}

        {question.type === 'image-marking' && question.answerType === 'discursive' && (
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Sua resposta:
            </label>
            <textarea
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              className="input-field"
              rows="4"
              placeholder="Digite sua resposta aqui..."
            />
          </div>
        )}

        {/* Feedback Imediato */}
        {showFeedback && answers[question.id] !== undefined && (
          <div className={`mt-6 p-4 rounded-lg border-2 ${
            isCurrentAnswerCorrect()
              ? 'bg-green-50 border-green-500'
              : 'bg-red-50 border-red-500'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              {isCurrentAnswerCorrect() ? (
                <>
                  <CheckCircle className="text-green-600" size={24} />
                  <span className="font-bold text-green-600 text-lg">Resposta Correta!</span>
                </>
              ) : (
                <>
                  <XCircle className="text-red-600" size={24} />
                  <span className="font-bold text-red-600 text-lg">Resposta Incorreta</span>
                </>
              )}
            </div>

            {!isCurrentAnswerCorrect() && (
              <div className="mt-3">
                {question.type === 'true-false' && (
                  <p className="text-gray-700">
                    <strong>Resposta correta:</strong> {question.correctAnswer ? 'Verdadeiro' : 'Falso'}
                  </p>
                )}
                {(question.type === 'multiple-choice' ||
                  (question.type === 'image-marking' && question.answerType === 'objective')) && (
                  <p className="text-gray-700">
                    <strong>Resposta correta:</strong> {String.fromCharCode(65 + question.correctAnswer)}. {question.options[question.correctAnswer]}
                  </p>
                )}
                {question.type === 'image-marking' && question.answerType === 'discursive' && (
                  <div className="text-gray-700">
                    <p><strong>Resposta esperada:</strong> {question.discursiveAnswer}</p>
                    {question.acceptedAnswers && (
                      <p className="text-sm mt-1">
                        <strong>Também aceito:</strong> {question.acceptedAnswers}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {question.explanation && (
              <div className="mt-3 pt-3 border-t border-gray-300">
                <p className="text-gray-700">
                  <strong>Explicação:</strong> {question.explanation}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>

          {currentQuestion === quiz.questions.length - 1 ? (
            <button onClick={handleSubmit} className="btn-primary">
              Finalizar Quiz
            </button>
          ) : (
            <button onClick={handleNext} className="btn-primary">
              Próxima
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizView;
