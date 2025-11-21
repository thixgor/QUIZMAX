// Teste de variáveis de ambiente
console.log('=== TESTE DE VARIÁVEIS DE AMBIENTE ===');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'DEFINIDA ✓' : 'NÃO DEFINIDA ✗');
console.log('======================================');

export {};
