# Deployment Guide

## Single Server Setup

This project has been configured to run everything on a single port for easier deployment.

### Development

**Option 1: Full development server (recommended)**
```bash
npm run dev:full
```
This builds the project and starts the server on port 3001, serving both the frontend and all APIs.

**Option 2: Separate development (for frontend development)**
```bash
# Terminal 1 - Frontend dev server with hot reload
npm run dev

# Terminal 2 - Backend API server
npm run server:dev
```

### Production

**Local production build and start:**
```bash
npm start
```
This will:
1. Build the React app to `dist/`
2. Start the Express server on port 3001
3. Serve the built React app and all API endpoints

### Environment Variables

Ensure these are set in your `.env` file:
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Instagram Scraping Configuration
APIFY_API_TOKEN=your_apify_api_token
APIFY_ACTOR_ID=apidojo~instagram-comments-scraper

# Optional - will default to 3001
PORT=3001
```

### API Endpoints

All APIs are now served from the same port:

- **Health Check**: `GET /api/health`
- **Instagram Scraping**: `POST /api/instagram/scrape`
- **Instagram Imports**: `GET /api/instagram/imports`
- **Widget Data**: `GET /api/widget/:widgetId`
- **Widget Analytics**: 
  - `POST /api/widget/:widgetId/view`
  - `POST /api/widget/:widgetId/click`
- **Widget Embed Script**: `GET /widget-embed.js`
- **Frontend**: `GET /*` (serves React app)

### Netlify Deployment

1. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`

2. **Environment Variables**: Set all the environment variables in Netlify dashboard

3. **Netlify Functions**: The project includes `netlify/functions/server.js` for serverless deployment

4. **Redirects**: Configured in `netlify.toml` to route API calls to the Netlify function

### Other Hosting Platforms

For platforms like Heroku, Railway, or DigitalOcean:

1. Set the `PORT` environment variable (they usually provide this automatically)
2. Set all other environment variables in the platform's dashboard
3. Use the start command: `npm start`

### Testing

Test that everything works:
```bash
# Health check
curl http://localhost:3001/api/health

# Frontend
curl http://localhost:3001

# Widget embed script
curl http://localhost:3001/widget-embed.js
```

## Benefits of Single Server Setup

- ✅ **Simplified Deployment**: Only one server to deploy and manage
- ✅ **No CORS Issues**: Frontend and backend on same domain
- ✅ **Cost Effective**: Single hosting instance needed
- ✅ **Environment Consistency**: Same setup for dev, staging, and production
- ✅ **Easier Debugging**: All logs in one place
- ✅ **Widget Compatibility**: Embed scripts work seamlessly

## Troubleshooting

**Instagram API not working?**
- Check `APIFY_API_TOKEN` is set correctly
- Verify Instagram URLs are in correct format
- Check server logs for detailed error messages

**Widget not loading?**
- Ensure widget embed script URL is correct
- Check CORS headers in browser network tab
- Verify widget ID exists in database

**Frontend not loading?**
- Run `npm run build` to ensure dist folder is created
- Check that static file serving is working: `ls dist/`
- Verify server is serving `index.html` for unknown routes