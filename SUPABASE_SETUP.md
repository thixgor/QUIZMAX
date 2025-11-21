# Configuração do Supabase para QuizMAX

Este documento contém as instruções para configurar o banco de dados Supabase para o QuizMAX.

## Passo 1: Executar o Schema SQL

Há dois arquivos SQL disponíveis:
- **`supabase-schema.sql`** - Schema completo (recomendado)
- **`supabase-schema-simple.sql`** - Schema simplificado (use se o completo der erro)

### Executando o SQL:

1. Acesse o Supabase Dashboard: https://app.supabase.com
2. Selecione seu projeto QuizMAX
3. No menu lateral, clique em **SQL Editor**
4. Clique em **+ New query**
5. Copie todo o conteúdo do arquivo `supabase-schema.sql`
6. Cole no editor SQL
7. Clique em **Run** (ou pressione Ctrl+Enter)

**Se der erro de tipo UUID/text:** Tente usar o arquivo `supabase-schema-simple.sql` em vez disso.

O script irá criar:
- Tabela `profiles` (perfis de usuário)
- Tabela `quizzes` (quizzes)
- Tabela `quiz_attempts` (tentativas de quiz)
- Bucket de storage `quiz-images` (para imagens)
- Políticas de Row Level Security (RLS)
- Triggers e funções auxiliares

## Passo 2: Verificar as Tabelas

Após executar o script, verifique se as tabelas foram criadas:

1. No menu lateral, clique em **Table Editor**
2. Você deve ver as tabelas:
   - `profiles`
   - `quizzes`
   - `quiz_attempts`

## Passo 3: Verificar o Storage

1. No menu lateral, clique em **Storage**
2. Você deve ver o bucket `quiz-images`
3. O bucket está configurado como público para permitir acesso às imagens

## Passo 4: Testar a Autenticação

1. Na aplicação, tente criar uma nova conta
2. O trigger automático deve criar um perfil em `profiles`
3. Você pode verificar em **Table Editor > profiles**

## Estrutura do Banco de Dados

### Tabela `profiles`
- `id` - UUID (referência para auth.users)
- `email` - Email do usuário
- `name` - Nome do usuário
- `created_at` - Data de criação
- `updated_at` - Data de atualização

### Tabela `quizzes`
- `id` - UUID (gerado automaticamente)
- `creator_id` - UUID (referência para auth.users)
- `title` - Título do quiz
- `description` - Descrição (opcional)
- `visibility` - 'public', 'private' ou 'unlisted'
- `show_answer_immediately` - Boolean
- `questions` - JSONB (array de perguntas)
- `views` - Número de visualizações
- `attempts` - Número de tentativas
- `created_at` - Data de criação
- `updated_at` - Data de atualização

### Tabela `quiz_attempts`
- `id` - UUID (gerado automaticamente)
- `quiz_id` - UUID (referência para quizzes)
- `user_id` - UUID (referência para auth.users)
- `answers` - JSONB (respostas do usuário)
- `score` - Pontuação
- `total_questions` - Total de perguntas
- `percentage` - Percentual de acerto
- `completed_at` - Data de conclusão

## Políticas de Segurança (RLS)

### Profiles
- Todos podem visualizar perfis
- Usuários podem inserir e atualizar apenas seus próprios perfis

### Quizzes
- Quizzes públicos são visíveis por todos
- Quizzes não listados são acessíveis por link
- Usuários só podem editar/deletar seus próprios quizzes
- Qualquer usuário autenticado pode criar quizzes

### Quiz Attempts
- Usuários podem ver apenas suas próprias tentativas
- Criadores de quiz podem ver tentativas em seus quizzes
- Qualquer pessoa pode criar uma tentativa

### Storage (quiz-images)
- Qualquer pessoa pode visualizar imagens (público)
- Usuários autenticados podem fazer upload
- Usuários podem atualizar/deletar apenas suas próprias imagens

## Variáveis de Ambiente

Certifique-se de que o arquivo `.env` existe com:

```
VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
```

**IMPORTANTE:** O arquivo `.env` já está no `.gitignore` e não será commitado por segurança.

## Troubleshooting

### Erro: "relation already exists"
Se você tentar executar o script novamente e ver este erro, significa que as tabelas já existem. Você pode:
1. Deletar as tabelas existentes no Table Editor
2. Ou comentar as partes do script que já foram executadas

### Erro: "permission denied"
Certifique-se de estar usando o SQL Editor com permissões de admin no Supabase.

### Imagens não aparecem
Verifique se:
1. O bucket `quiz-images` foi criado
2. O bucket está marcado como "public"
3. As políticas de storage foram aplicadas

## Próximos Passos

Após configurar o Supabase:
1. Execute `npm install` para instalar as dependências
2. Execute `npm run dev` para iniciar o servidor de desenvolvimento
3. Crie uma conta de teste
4. Crie um quiz de teste
5. Verifique se os dados aparecem no Supabase Dashboard
