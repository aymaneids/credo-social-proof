import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { getWidgetData, trackWidgetView, trackWidgetClick } from './api/widget.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));
app.use(express.static(path.join(__dirname, '../public')));

// Widget API routes
app.get('/api/widget/:widgetId', getWidgetData);
app.post('/api/widget/:widgetId/view', trackWidgetView);
app.post('/api/widget/:widgetId/click', trackWidgetClick);

// Widget script serving
app.get('/widget/:widgetId.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutes cache
  res.sendFile(path.join(__dirname, '../public/widget-loader.js'));
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});