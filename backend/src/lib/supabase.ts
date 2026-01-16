import { createClient } from '@supabase/supabase-js';
import 'dotenv/config'; // Necessário para o Node ler o arquivo .env

// No Backend, usamos process.env e não import.meta.env
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);