# 🚀 CONFIGURAR VARIÁVEIS DE AMBIENTE NO NETLIFY (PRODUÇÃO)

## ⚠️ IMPORTANTE: Este passo é OBRIGATÓRIO para o site funcionar em produção!

O arquivo `netlify.toml` configura apenas o **desenvolvimento local** (`netlify dev`).

Para que o site funcione em **PRODUÇÃO** (após deploy), você PRECISA configurar as variáveis no dashboard do Netlify.

---

## 📋 PASSO A PASSO

### 1. Acesse o Dashboard do Netlify
```
https://app.netlify.com
```

### 2. Selecione seu site QuizMAX
- Clique no nome do site na lista

### 3. Vá em Environment Variables
- Menu lateral → **Site configuration**
- Depois → **Environment variables**

### 4. Adicione as 2 Variáveis

**Variável 1:**
```
Key: VITE_SUPABASE_URL
Value: https://nrotkqfpnlpmrluabljd.supabase.co

Scopes (marque todos):
☑ Production
☑ Deploy previews
☑ Branch deploys
```

**Variável 2:**
```
Key: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yb3RrcWZwbmxwbXJsdWFibGpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NTM3MDYsImV4cCI6MjA3OTMyOTcwNn0.rC_rHYILHeFNx2fzGm9kx0Y3m1ZcK3mtDlrbAzS90dw

Scopes (marque todos):
☑ Production
☑ Deploy previews
☑ Branch deploys
```

### 5. Salve as Variáveis
- Clique em **Save**

### 6. Faça um Novo Deploy
Opção A - Automático (recomendado):
```bash
git push
```

Opção B - Manual no Dashboard:
- Vá em **Deploys**
- Clique em **Trigger deploy** → **Deploy site**

### 7. Aguarde o Build Completar
- Monitore o progresso em **Deploys**
- Aguarde o status mudar para **Published**

### 8. Teste o Site em Produção
- Acesse a URL do Netlify (ex: https://seu-site.netlify.app)
- Abra o Console do navegador (F12)
- Procure por:
```
=== TESTE DE VARIÁVEIS DE AMBIENTE ===
VITE_SUPABASE_URL: https://nrotkqfpnlpmrluabljd.supabase.co
VITE_SUPABASE_ANON_KEY: DEFINIDA ✓
```

Se aparecer isso → **FUNCIONOU!** ✅

Se ainda aparecer `undefined` → Repita os passos acima

---

## 🔍 POR QUE PRECISA DISSO?

### Desenvolvimento Local:
```
netlify dev → Lê .env.development → Funciona ✓
```

### Produção (Deploy):
```
git push → Netlify Build → ??? .env não existe (gitignored) → ERRO ✗
```

### Solução:
```
Netlify Dashboard → Environment Variables → Netlify Build → Funciona ✓
```

---

## ⚙️ ALTERNATIVA: Via Netlify CLI

Se preferir, você pode configurar via terminal:

```bash
netlify env:set VITE_SUPABASE_URL "https://nrotkqfpnlpmrluabljd.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yb3RrcWZwbmxwbXJsdWFibGpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NTM3MDYsImV4cCI6MjA3OTMyOTcwNn0.rC_rHYILHeFNx2fzGm9kx0Y3m1ZcK3mtDlrbAzS90dw"

# Depois faça push
git push
```

---

## ✅ CHECKLIST

- [ ] Acessei o Netlify Dashboard
- [ ] Fui em Site configuration → Environment variables
- [ ] Adicionei VITE_SUPABASE_URL
- [ ] Adicionei VITE_SUPABASE_ANON_KEY
- [ ] Marquei todos os scopes (Production, Deploy previews, Branch deploys)
- [ ] Salvei as variáveis
- [ ] Fiz um novo deploy (git push ou manual)
- [ ] Aguardei o build completar
- [ ] Testei o site em produção
- [ ] As variáveis aparecem no console
- [ ] O site funciona sem erro "Missing Supabase environment variables"

---

## 🆘 TROUBLESHOOTING

### Erro persiste após configurar?

1. **Verifique se salvou as variáveis:**
   - Dashboard → Environment variables
   - Devem aparecer 2 variáveis listadas

2. **Verifique se fez novo deploy:**
   - O Netlify NÃO atualiza deploys antigos
   - Precisa fazer um deploy NOVO após configurar

3. **Verifique os nomes das variáveis:**
   - Devem começar com `VITE_` (obrigatório no Vite)
   - Nome exato: `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`

4. **Limpe o cache do navegador:**
   - Ctrl + Shift + R (hard refresh)
   - Ou abra em aba anônima

5. **Verifique os logs do build:**
   - Dashboard → Deploys → Clique no deploy
   - Veja se há erros relacionados a variáveis

---

## 📞 SUPORTE

Se o erro persistir após seguir TODOS os passos:
1. Tire print das variáveis configuradas no Netlify
2. Tire print dos logs do deploy
3. Tire print do erro no console do navegador
4. Compartilhe para análise

**Este arquivo pode ser deletado após configurar com sucesso!**
