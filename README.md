# QuizMAX

QuizMAX é uma aplicação web moderna para criação e compartilhamento de quizzes interativos com diferentes tipos de perguntas.

## Características

- 🎨 Design moderno com cores da marca (Azul escuro, Azul claro, Laranja)
- 🔐 Sistema de autenticação (login/registro)
- 📝 Múltiplos tipos de perguntas:
  - Múltipla escolha (4 alternativas)
  - Verdadeiro ou Falso
  - Identificação por Marcação de Imagem
- 📊 Gerenciamento completo de quizzes
- 🔗 Sistema de compartilhamento com links únicos
- 📱 Design responsivo
- 💾 Armazenamento local com localStorage

## Tecnologias Utilizadas

- **React** - Biblioteca para construção da interface
- **Vite** - Build tool rápido e moderno
- **TailwindCSS** - Framework CSS utilitário
- **React Router** - Navegação entre páginas
- **Lucide React** - Ícones modernos
- **Netlify** - Hospedagem e deploy

## Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## Deploy no Netlify

O projeto está configurado para deploy automático no Netlify. Basta conectar seu repositório GitHub ao Netlify e ele detectará automaticamente as configurações do `netlify.toml`.

### Comandos de Build:
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`

## Estrutura de Pastas

```
src/
├── components/       # Componentes reutilizáveis
│   ├── questions/   # Componentes de tipos de perguntas
│   ├── Layout.jsx
│   └── Navbar.jsx
├── contexts/        # Context API (Auth e Quiz)
├── pages/           # Páginas da aplicação
├── hooks/           # Custom hooks
├── utils/           # Funções utilitárias
└── App.jsx          # Componente principal
```

## Funcionalidades

### Autenticação
- Registro de novos usuários
- Login com email e senha
- Persistência de sessão

### Criação de Quiz
- Título e descrição
- Configuração de visibilidade (Público/Privado/Não listado)
- Adicionar múltiplas perguntas de diferentes tipos
- Upload de imagens
- Explicações para respostas

### Tipos de Perguntas

#### 1. Múltipla Escolha
- 4 alternativas
- Seleção da resposta correta
- Campo para explicação
- Imagem opcional

#### 2. Verdadeiro ou Falso
- Afirmação/pergunta
- Seleção de V ou F
- Campo para explicação
- Imagem opcional

#### 3. Identificação por Marcação
- Upload de imagem obrigatório
- Ferramentas de marcação (setas, círculos, pontos)
- Resposta objetiva (4 alternativas) ou discursiva
- Explicação opcional

### Gerenciamento de Quizzes
- Listar quizzes criados
- Editar quiz
- Excluir quiz
- Duplicar quiz
- Alterar visibilidade
- Compartilhar link

### Visualização de Quiz
- Informações do quiz (criador, data, descrição)
- Responder perguntas
- Ver resultados com gabarito
- Estatísticas (visualizações e tentativas)

## Cores da Marca

```css
Azul Escuro: rgba(42, 60, 138)
Azul Claro: rgba(24, 173, 229)
Laranja: rgba(241, 141, 47)
```

## Logo

O placeholder da logo está localizado na navbar. Substitua quando tiver o arquivo SVG da logo.

## Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto foi criado em 2025.

## Contato

QuizMAX - A plataforma definitiva para criar questionários envolventes em 2025.
