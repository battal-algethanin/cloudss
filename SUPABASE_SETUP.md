# Supabase Setup Instructions

This todo list app now uses Supabase for persistent data storage. Follow these steps to set it up:

## 1. Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project

## 2. Create the Database Table

Once your project is created, go to the SQL Editor and run this query:

```sql
-- Create todos table
CREATE TABLE todos (
  id BIGSERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations (for demo purposes)
-- For production, you should implement proper authentication
CREATE POLICY "Allow all operations on todos" ON todos
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

## 3. Get Your Supabase Credentials

1. Go to your project settings (gear icon in the sidebar)
2. Click on "API" in the settings menu
3. Copy the following:
   - **Project URL** (under "Project URL")
   - **Anon/Public Key** (under "Project API keys" - use the `anon` `public` key)

## 4. Configure the App

1. Open `JS/supabase-config.js`
2. Replace the placeholder values:
   ```javascript
   const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // Replace with your Project URL
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your anon key
   ```

## 5. Test the App

1. Open `index.html` in your browser
2. Add a todo item
3. Refresh the page - your todos should persist!
4. Check your Supabase dashboard to see the data in the `todos` table

## Features

- ✅ Persistent storage across browser sessions
- ✅ Track completed status
- ✅ Automatic fallback to localStorage if Supabase is unavailable
- ✅ Real-time data synchronization

## Security Note

For production use, you should implement proper authentication using Supabase Auth and update the Row Level Security policies to restrict access based on user authentication.

## Troubleshooting

- Check the browser console for any error messages
- Verify your Supabase URL and API key are correct
- Make sure the `todos` table exists in your Supabase project
- Ensure Row Level Security policies are properly configured
