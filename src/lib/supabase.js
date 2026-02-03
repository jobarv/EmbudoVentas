import { createClient } from '@supabase/supabase-js'

// Estas variables se leen de tu archivo .env para mayor seguridad
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validamos que las variables existan para evitar errores silenciosos
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Faltan las variables de entorno de Supabase. Revisa tu archivo .env")
}

// Creamos e exportamos la instancia del cliente
export const supabase = createClient(supabaseUrl, supabaseAnonKey)