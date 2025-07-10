import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xqzbecjtfbjzvtyzqzpy.supabase.co' 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxemJlY2p0ZmJqenZ0eXpxenB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMDkxNTcsImV4cCI6MjA2NzU4NTE1N30.3mlMe_an_DfzxQ-gtVm0LBIQ9njJwoz4z10qZY-5oL4'   

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
