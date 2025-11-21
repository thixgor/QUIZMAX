import { useState, useRef } from 'react';
import { Upload, X, Circle, ArrowRight, Pointer } from 'lucide-react';

const ImageMarkingQuestion = ({ question, onChange }) => {
  const [imagePreview, setImagePreview] = useState(question.image);
  const [currentTool, setCurrentTool] = useState('arrow'); // arrow, circle, point
  const canvasRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        onChange({ image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    onChange({ image: null, markers: [] });
  };

  const handleCanvasClick = (e) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newMarker = {
      id: Date.now().toString(),
      type: currentTool,
      x,
      y,
      ...(currentTool === 'circle' && { radius: 30 }),
      ...(currentTool === 'arrow' && { endX: x + 50, endY: y })
    };

    const newMarkers = [...(question.markers || []), newMarker];
    onChange({ markers: newMarkers });
  };

  const removeMarker = (markerId) => {
    const newMarkers = question.markers.filter(m => m.id !== markerId);
    onChange({ markers: newMarkers });
  };

  const updateOption = (index, value) => {
    const newOptions = [...question.options];
    newOptions[index] = value;
    onChange({ options: newOptions });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Pergunta *
        </label>
        <textarea
          value={question.question}
          onChange={(e) => onChange({ question: e.target.value })}
          className="input-field"
          rows="2"
          placeholder="Digite a pergunta"
        />
      </div>

      {/* Image Upload - Required */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Imagem * (obrigatória para este tipo de questão)
        </label>
        {imagePreview ? (
          <div className="space-y-2">
            <div className="relative inline-block">
              <div
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="relative cursor-crosshair"
                style={{ maxWidth: '600px' }}
              >
                <img src={imagePreview} alt="Preview" className="w-full rounded-lg" />

                {/* Render markers */}
                <svg
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  style={{ zIndex: 10 }}
                >
                  {question.markers?.map((marker) => (
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
                              <polygon points="0 0, 10 3, 0 6" fill="#F18D2F" />
                            </marker>
                          </defs>
                          <line
                            x1={marker.x}
                            y1={marker.y}
                            x2={marker.endX}
                            y2={marker.endY}
                            stroke="#F18D2F"
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
                          stroke="#F18D2F"
                          strokeWidth="3"
                          fill="none"
                        />
                      )}
                      {marker.type === 'point' && (
                        <circle
                          cx={marker.x}
                          cy={marker.y}
                          r="8"
                          fill="#F18D2F"
                        />
                      )}
                    </g>
                  ))}
                </svg>
              </div>
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 z-20"
              >
                <X size={16} />
              </button>
            </div>

            {/* Marking Tools */}
            <div className="flex space-x-2 items-center">
              <span className="text-sm font-semibold text-gray-700">Ferramentas:</span>
              <button
                type="button"
                onClick={() => setCurrentTool('arrow')}
                className={`p-2 rounded ${
                  currentTool === 'arrow'
                    ? 'bg-brand-orange text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                <ArrowRight size={20} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentTool('circle')}
                className={`p-2 rounded ${
                  currentTool === 'circle'
                    ? 'bg-brand-orange text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                <Circle size={20} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentTool('point')}
                className={`p-2 rounded ${
                  currentTool === 'point'
                    ? 'bg-brand-orange text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                <Pointer size={20} />
              </button>
              {question.markers?.length > 0 && (
                <button
                  type="button"
                  onClick={() => onChange({ markers: [] })}
                  className="ml-4 text-sm text-red-500 hover:text-red-700"
                >
                  Limpar todas as marcações
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500">
              Clique na imagem para adicionar marcações (setas, círculos ou pontos)
            </p>
          </div>
        ) : (
          <label className="flex items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-brand-light-blue">
            <div className="text-center">
              <Upload className="mx-auto text-gray-400 mb-2" size={32} />
              <span className="text-gray-500">Clique para fazer upload da imagem</span>
              <p className="text-xs text-red-500 mt-2">* Obrigatório para este tipo de questão</p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Answer Type */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Tipo de Resposta *
        </label>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => onChange({ answerType: 'objective' })}
            className={`flex-1 py-3 rounded-lg border-2 font-semibold ${
              question.answerType === 'objective'
                ? 'bg-brand-light-blue border-brand-light-blue text-white'
                : 'bg-white border-gray-300 text-gray-700'
            }`}
          >
            Objetiva (4 alternativas)
          </button>
          <button
            type="button"
            onClick={() => onChange({ answerType: 'discursive' })}
            className={`flex-1 py-3 rounded-lg border-2 font-semibold ${
              question.answerType === 'discursive'
                ? 'bg-brand-light-blue border-brand-light-blue text-white'
                : 'bg-white border-gray-300 text-gray-700'
            }`}
          >
            Discursiva
          </button>
        </div>
      </div>

      {/* Objective Options */}
      {question.answerType === 'objective' && (
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Alternativas *
          </label>
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`correct-${question.id}`}
                  checked={question.correctAnswer === index}
                  onChange={() => onChange({ correctAnswer: index })}
                  className="w-4 h-4 text-brand-light-blue"
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  className="input-field flex-1"
                  placeholder={`Alternativa ${String.fromCharCode(65 + index)}`}
                />
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Marque o botão de rádio para indicar a resposta correta
          </p>
        </div>
      )}

      {/* Discursive Answer */}
      {question.answerType === 'discursive' && (
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Resposta Esperada * (gabarito comentado)
          </label>
          <textarea
            value={question.discursiveAnswer || ''}
            onChange={(e) => onChange({ discursiveAnswer: e.target.value })}
            className="input-field"
            rows="3"
            placeholder="Digite a resposta esperada para esta questão discursiva"
          />
        </div>
      )}

      {/* Explanation */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Explicação {question.answerType === 'discursive' ? '(opcional)' : '(opcional)'}
        </label>
        <textarea
          value={question.explanation || ''}
          onChange={(e) => onChange({ explanation: e.target.value })}
          className="input-field"
          rows="2"
          placeholder="Adicione uma explicação adicional"
        />
      </div>
    </div>
  );
};

export default ImageMarkingQuestion;
