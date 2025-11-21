import { useState } from 'react';
import { Upload, X } from 'lucide-react';

const MultipleChoiceQuestion = ({ question, onChange }) => {
  const [imagePreview, setImagePreview] = useState(question.image);

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
    onChange({ image: null });
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

      {/* Image Upload */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Imagem (opcional)
        </label>
        {imagePreview ? (
          <div className="relative inline-block">
            <img src={imagePreview} alt="Preview" className="max-w-xs rounded-lg" />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-brand-light-blue">
            <div className="text-center">
              <Upload className="mx-auto text-gray-400 mb-2" size={32} />
              <span className="text-gray-500">Clique para fazer upload</span>
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

      {/* Options */}
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

      {/* Explanation */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Explicação (opcional)
        </label>
        <textarea
          value={question.explanation}
          onChange={(e) => onChange({ explanation: e.target.value })}
          className="input-field"
          rows="2"
          placeholder="Adicione uma explicação sobre a resposta correta"
        />
      </div>
    </div>
  );
};

export default MultipleChoiceQuestion;
