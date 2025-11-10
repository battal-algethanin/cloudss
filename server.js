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
  const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
  const supabaseKey = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
  
  const configContent = `// Supabase Configuration (injected from environment variables)
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
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment variables configured: ${process.env.SUPABASE_URL ? 'YES' : 'NO'}`);
});
