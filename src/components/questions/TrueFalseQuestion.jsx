import { useState } from 'react';
import { Upload, X, Check } from 'lucide-react';

const TrueFalseQuestion = ({ question, onChange }) => {
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

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Afirmação/Pergunta *
        </label>
        <textarea
          value={question.question}
          onChange={(e) => onChange({ question: e.target.value })}
          className="input-field"
          rows="2"
          placeholder="Digite a afirmação ou pergunta"
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

      {/* True/False Selection */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Resposta Correta *
        </label>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => onChange({ correctAnswer: true })}
            className={`flex-1 py-4 rounded-lg border-2 font-semibold transition-all ${
              question.correctAnswer === true
                ? 'bg-green-500 border-green-500 text-white'
                : 'bg-white border-gray-300 text-gray-700 hover:border-green-500'
            }`}
          >
            {question.correctAnswer === true && <Check className="inline mr-2" size={20} />}
            Verdadeiro
          </button>
          <button
            type="button"
            onClick={() => onChange({ correctAnswer: false })}
            className={`flex-1 py-4 rounded-lg border-2 font-semibold transition-all ${
              question.correctAnswer === false
                ? 'bg-red-500 border-red-500 text-white'
                : 'bg-white border-gray-300 text-gray-700 hover:border-red-500'
            }`}
          >
            {question.correctAnswer === false && <Check className="inline mr-2" size={20} />}
            Falso
          </button>
        </div>
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

export default TrueFalseQuestion;
