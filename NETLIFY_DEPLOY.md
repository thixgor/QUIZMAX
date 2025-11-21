# Deploy no Netlify - QuizMAX

Este documento explica como configurar as variáveis de ambiente no Netlify para deploy em produção.

## Desenvolvimento Local com Netlify CLI

Se você estiver usando `netlify dev`, as variáveis de ambiente devem estar no arquivo `.env.development`:

```bash
# .env.development
VITE_SUPABASE_URL=https://nrotkqfpnlpmrluabljd.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
```

**Importante:**
- O arquivo `.env.development` está no `.gitignore` e NÃO será commitado
- Cada desenvolvedor precisa criar seu próprio arquivo localmente

### Reiniciar o Netlify Dev

Após criar o `.env.development`, reinicie o servidor:

```bash
# Pare o servidor (Ctrl+C)
# Depois reinicie:
netlify dev
```

## Deploy em Produção

Para fazer deploy no Netlify em produção, você precisa configurar as variáveis de ambiente no dashboard:

### Opção 1: Via Dashboard (Recomendado)

1. Acesse: https://app.netlify.com
2. Selecione seu projeto QuizMAX
3. Vá em **Site settings** → **Environment variables**
4. Clique em **Add a variable**
5. Adicione estas variáveis:

```
Nome: VITE_SUPABASE_URL
Valor: https://nrotkqfpnlpmrluabljd.supabase.co
Scopes: Production, Deploy previews, Branch deploys

Nome: VITE_SUPABASE_ANON_KEY
Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yb3RrcWZwbmxwbXJsdWFibGpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NTM3MDYsImV4cCI6MjA3OTMyOTcwNn0.rC_rHYILHeFNx2fzGm9kx0Y3m1ZcK3mtDlrbAzS90dw
Scopes: Production, Deploy previews, Branch deploys
```

6. Clique em **Save**

### Opção 2: Via Netlify CLI

```bash
netlify env:set VITE_SUPABASE_URL "https://nrotkqfpnlpmrluabljd.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "sua_chave_aqui"
```

## Verificar Configuração

Depois de configurar as variáveis:

1. Faça um novo deploy:
   ```bash
   git push
   ```

2. Aguarde o build completar

3. Acesse seu site em produção

4. Abra o Console do navegador (F12)

5. Procure pela mensagem:
   ```
   === TESTE DE VARIÁVEIS DE AMBIENTE ===
   VITE_SUPABASE_URL: https://nrotkqfpnlpmrluabljd.supabase.co
   VITE_SUPABASE_ANON_KEY: DEFINIDA ✓
   ```

Se aparecer, está funcionando! ✅

## Troubleshooting

### Erro: "Missing Supabase environment variables"

**Desenvolvimento Local:**
1. Verifique se o arquivo `.env.development` existe na raiz do projeto
2. Verifique se as variáveis começam com `VITE_` (obrigatório para Vite)
3. Reinicie o `netlify dev`

**Produção:**
1. Verifique se as variáveis estão configuradas no dashboard do Netlify
2. Verifique se os nomes estão corretos (com prefixo `VITE_`)
3. Faça um novo deploy (trigger manual no dashboard se necessário)

### Variáveis não aparecem no build

- Certifique-se de que as variáveis têm o prefixo `VITE_`
- No Vite, apenas variáveis com prefixo `VITE_` são expostas no cliente
- Variáveis sem esse prefixo são ignoradas por segurança

### Alternativa: Usar npm run dev

Se o Netlify CLI continuar com problemas, você pode usar diretamente:

```bash
# Em vez de netlify dev
npm run dev
```

Isso usará o arquivo `.env` normal e funcionará com o Vite diretamente na porta 5173.

## Estrutura de Arquivos .env

```
.env                  → Desenvolvimento local (Vite direto)
.env.development      → Desenvolvimento local (Netlify CLI)
.env.local            → Local overrides (não commitado)
.env.production       → Não usado (configure no Netlify dashboard)
.env.example          → Template (commitado no git)
```

## Segurança

⚠️ **IMPORTANTE:**
- NUNCA commite arquivos `.env` no git
- A chave ANON do Supabase é segura para expor no cliente
- Mas NUNCA exponha a SERVICE_ROLE_KEY do Supabase
- Todas as operações sensíveis devem usar Row Level Security (RLS)

## Deploy Automático

O Netlify faz deploy automático quando você:
1. Faz `git push` para a branch principal
2. Cria um Pull Request (deploy preview)
3. Faz merge de PR

Configure as variáveis de ambiente ANTES do primeiro deploy!
