// Supabase Configuration
const SUPABASE_URL = 'https://gmdbptmkokbteckspwro.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtZGJwdG1rb2tidGVja3Nwd3JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MDIzMDUsImV4cCI6MjA3ODM3ODMwNX0._FXduu7kkBT2E_pUoY_SYCB_QWRtMhb1q0pGDBcThDs';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Table name for todos
const TODOS_TABLE = 'todos';
