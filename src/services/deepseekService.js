// Serviço de integração com DeepSeek API para geração de quizzes

const DEEPSEEK_API_KEY = 'sk-362717a46bba48cdac58061aad4e41eb';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

/**
 * Gera questões usando a API do DeepSeek
 * @param {Object} params - Parâmetros para geração
 * @param {string} params.tema - Tema do quiz
 * @param {number} params.quantidade - Quantidade de questões (máx 5)
 * @param {string} params.dificuldade - FÁCIL, MÉDIA ou DIFÍCIL
 * @param {number} params.modelo - 1 (Rápida) ou 2 (Complexa)
 * @returns {Promise<Array>} Array de questões geradas
 */
export async function gerarQuestoesPorIA({ tema, quantidade, dificuldade, modelo }) {
  try {
    const prompt = modelo === 1
      ? criarPromptModeloRapido(tema, quantidade, dificuldade)
      : criarPromptModeloComplexo(tema, quantidade, dificuldade);

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em criar questões educacionais de múltipla escolha. Sempre responda em formato JSON válido.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse do JSON retornado pela IA
    const questoesGeradas = JSON.parse(content);

    // Converter para o formato do QuizMAX
    return questoesGeradas.map((q, index) => ({
      id: Date.now().toString() + index,
      type: 'multiple-choice',
      question: q.enunciado,
      options: [q.alternativa_a, q.alternativa_b, q.alternativa_c, q.alternativa_d],
      correctAnswer: ['a', 'b', 'c', 'd'].indexOf(q.correta.toLowerCase()),
      explanation: q.explicacao || ''
    }));

  } catch (error) {
    console.error('Erro ao gerar questões por IA:', error);
    throw new Error('Falha ao gerar questões. Tente novamente.');
  }
}

/**
 * Cria prompt para Modelo 1 - Questões Rápidas
 */
function criarPromptModeloRapido(tema, quantidade, dificuldade) {
  return `Crie exatamente ${quantidade} questão(ões) de múltipla escolha sobre o tema "${tema}" com dificuldade ${dificuldade}.

CARACTERÍSTICAS DAS QUESTÕES (Modelo Rápido):
- Questões diretas e objetivas
- Foco em fixação cognitiva rápida
- Enunciado claro e conciso
- 4 alternativas (A, B, C, D)
- Uma alternativa correta
- Três distratores plausíveis

DIFICULDADE ${dificuldade.toUpperCase()}:
${dificuldade === 'FÁCIL' ? '- Conceitos básicos e fundamentais\n- Memorização e reconhecimento direto' : ''}
${dificuldade === 'MÉDIA' ? '- Aplicação de conceitos\n- Compreensão e interpretação' : ''}
${dificuldade === 'DIFÍCIL' ? '- Análise crítica e síntese\n- Raciocínio avançado e conexões complexas' : ''}

FORMATO DE RESPOSTA (JSON):
Responda APENAS com um array JSON válido, sem texto adicional:

[
  {
    "enunciado": "Texto da pergunta aqui",
    "alternativa_a": "Texto da alternativa A",
    "alternativa_b": "Texto da alternativa B",
    "alternativa_c": "Texto da alternativa C",
    "alternativa_d": "Texto da alternativa D",
    "correta": "a",
    "explicacao": "Breve explicação da resposta correta"
  }
]

IMPORTANTE: Retorne SOMENTE o JSON, sem markdown, sem texto antes ou depois.`;
}

/**
 * Cria prompt para Modelo 2 - Questões Complexas e Bem Desenvolvidas
 */
function criarPromptModeloComplexo(tema, quantidade, dificuldade) {
  return `Crie exatamente ${quantidade} questão(ões) de múltipla escolha COMPLEXA e BEM DESENVOLVIDA sobre o tema "${tema}" com dificuldade ${dificuldade}.

CARACTERÍSTICAS DAS QUESTÕES (Modelo Complexo):

1. TEXTO-BASE (Contexto Rico):
   - Trecho de artigo científico, citação de autor relevante, ou descrição de cenário real
   - Dados, gráficos fictícios, tabelas ou estatísticas relacionadas ao tema
   - Contexto que simule uma situação-problema prática

2. ENUNCIADO:
   - Comando claro após o texto-base
   - Exige aplicação, análise, interpretação ou avaliação (Eixo Cognitivo III)
   - Relevante para aplicação prática do conhecimento
   - Conecta teoria com situação apresentada no texto-base

3. ALTERNATIVAS:
   - Uma alternativa CORRETA que resolve completamente a situação-problema
   - Três DISTRATORES fortes e coesos:
     * Conceitos da mesma área temática
     * Aplicações incorretas ou parciais
     * Interpretações que abordam o contexto mas não o comando
     * Conclusões equivocadas plausíveis
     * Devem confundir quem tem conhecimento superficial

DIFICULDADE ${dificuldade.toUpperCase()}:
${dificuldade === 'FÁCIL' ? '- Texto-base simples e direto\n- Conexões evidentes entre contexto e resposta' : ''}
${dificuldade === 'MÉDIA' ? '- Texto-base moderadamente complexo\n- Requer interpretação cuidadosa do contexto' : ''}
${dificuldade === 'DIFÍCIL' ? '- Texto-base denso e multifacetado\n- Múltiplas camadas de interpretação\n- Distratores altamente plausíveis' : ''}

FORMATO DE RESPOSTA (JSON):
Responda APENAS com um array JSON válido:

[
  {
    "enunciado": "**TEXTO-BASE:**\\n\\n[Texto contextual rico aqui - pode incluir citações, dados, cenário]\\n\\n**COMANDO:**\\n\\n[Pergunta clara que exige análise/aplicação]",
    "alternativa_a": "Texto da alternativa A (elaborada e completa)",
    "alternativa_b": "Texto da alternativa B (elaborada e completa)",
    "alternativa_c": "Texto da alternativa C (elaborada e completa)",
    "alternativa_d": "Texto da alternativa D (elaborada e completa)",
    "correta": "a",
    "explicacao": "Explicação detalhada: por que esta é a correta e por que as outras são distratores"
  }
]

IMPORTANTE:
- Retorne SOMENTE o JSON, sem markdown, sem \`\`\`json
- Use \\n para quebras de linha dentro do enunciado
- Garanta que o texto-base seja RICO e CONTEXTUALIZADO`;
}
