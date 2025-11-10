const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the Supabase config dynamically FIRST (before static files)
app.get('/JS/supabase-config.js', (req, res) => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  const hasEnvVars = supabaseUrl && supabaseKey;
  
  let configContent;
  
  if (hasEnvVars) {
    // Environment variables are set - enable Supabase
    configContent = `// Supabase Configuration - ENABLED via Environment Variables
const SUPABASE_URL = '${supabaseUrl}';
const SUPABASE_ANON_KEY = '${supabaseKey}';
const SUPABASE_ENABLED = true;

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Table name for todos
const TODOS_TABLE = 'todos';

console.log('✓ Supabase connection enabled');
`;
  } else {
    // No environment variables - disable Supabase
    configContent = `// Supabase Configuration - DISABLED (No environment variables set)
// Using localStorage only until environment variables are configured in Render
const SUPABASE_URL = null;
const SUPABASE_ANON_KEY = null;
const SUPABASE_ENABLED = false;
const supabase = null;
const TODOS_TABLE = null;

console.log('⚠ Supabase disabled - Using localStorage only');
console.log('To enable Supabase: Set SUPABASE_URL and SUPABASE_ANON_KEY in Render environment variables');
`;
  }
  
  res.set('Content-Type', 'application/javascript');
  res.set('Cache-Control', 'no-store'); // Don't cache this file
  res.send(configContent);
});

// Serve static files from current directory (AFTER dynamic routes)
app.use(express.static(__dirname));

// Send index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  const hasEnvVars = process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY;
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`Database: ${hasEnvVars ? '✓ Supabase ENABLED' : '✗ localStorage only (Set environment variables to enable Supabase)'}`);
});
