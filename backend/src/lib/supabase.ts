import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// ADICIONE ESTAS LINHAS PARA TESTAR:
console.log("URL Encontrada:", process.env.SUPABASE_URL);
console.log("Chave Encontrada:", process.env.SUPABASE_ANON_KEY ? "Sim (Protegida)" : "Não");

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);