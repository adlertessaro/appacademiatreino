import { createClient } from '@supabase/supabase-js';

// Estas variáveis o Vite vai procurar no teu ficheiro .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);