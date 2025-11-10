const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('.', {
  setHeaders: (res, filePath) => {
    // Don't cache the config file
    if (filePath.endsWith('supabase-config.js')) {
      res.set('Cache-Control', 'no-store');
    }
  }
}));

// Serve the Supabase config with environment variables injected
app.get('/JS/supabase-config.js', (req, res) => {
  const supabaseUrl = process.env.SUPABASE_URL || 'https://gmdbptmkokbteckspwro.supabase.co';
  const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtZGJwdG1rb2tidGVja3Nwd3JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MDIzMDUsImV4cCI6MjA3ODM3ODMwNX0._FXduu7kkBT2E_pUoY_SYCB_QWRtMhb1q0pGDBcThDs';
  
  const usingEnvVars = process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY;
  
  const configContent = `// Supabase Configuration
// ${usingEnvVars ? 'Using environment variables from Render' : 'Using default values - Set environment variables in Render for production'}
const SUPABASE_URL = '${supabaseUrl}';
const SUPABASE_ANON_KEY = '${supabaseKey}';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Table name for todos
const TODOS_TABLE = 'todos';
`;
  
  res.set('Content-Type', 'application/javascript');
  res.send(configContent);
});

app.listen(PORT, () => {
  const usingEnvVars = process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY;
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment variables: ${usingEnvVars ? '✓ CONFIGURED' : '✗ Using defaults (Set in Render Dashboard)'}`);
  if (usingEnvVars) {
    console.log('✓ SUPABASE_URL:', process.env.SUPABASE_URL);
    console.log('✓ SUPABASE_ANON_KEY: [HIDDEN]');
  }
});
