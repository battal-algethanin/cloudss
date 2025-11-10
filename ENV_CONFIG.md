# Environment Variables Configuration for Render

This project demonstrates cloud configuration management using environment variables in Render.

## Setup Instructions

### 1. Configure Environment Variables in Render

1. Go to your Render Dashboard
2. Select your service (todo-list)
3. Click on **"Environment"** in the left sidebar
4. Add the following environment variables:

   | Key | Value |
   |-----|-------|
   | `SUPABASE_URL` | Your Supabase project URL |
   | `SUPABASE_ANON_KEY` | Your Supabase anon/public key |

5. Click **"Save Changes"**

### 2. Deploy

Once you push to GitHub, Render will automatically:
- Install dependencies (`npm install`)
- Start the Node.js server (`npm start`)
- Inject environment variables into the application at runtime

## How It Works

- **Server-side injection**: The `server.js` file serves the `supabase-config.js` dynamically
- **Environment variables**: Credentials are stored securely in Render's environment
- **Runtime configuration**: Config is generated on-the-fly using `process.env`
- **No hardcoded secrets**: Sensitive data never appears in the codebase

## Benefits of This Approach

✅ **Security**: Credentials not exposed in source code  
✅ **Flexibility**: Easy to change configurations without code changes  
✅ **Best Practice**: Follows 12-factor app methodology  
✅ **Environment-specific**: Different configs for dev/staging/production  

## Local Development

Create a `.env` file (not committed to git):
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

Then run:
```bash
npm install
npm start
```
