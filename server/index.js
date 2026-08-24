const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Database Initialization
const db = require('./db');

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/trainers', require('./routes/trainers'));
app.use('/api/internships', require('./routes/internships'));
app.use('/api/certifications', require('./routes/certifications'));
app.use('/api/placements', require('./routes/placements'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/reviews', require('./routes/reviews'));

// Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'SkillBridge Inter-Institutional Hub API',
    clusterName: 'Western Maharashtra Innovation Cluster',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Serve Static Files from React Client in Production
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDistPath));

// Fallback SPA route (Express 5 compatible)
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    const indexPath = path.join(clientDistPath, 'index.html');
    return res.sendFile(indexPath, (err) => {
      if (err) {
        return res.status(200).send(`
          <!DOCTYPE html>
          <html>
            <head><title>SkillBridge API Server</title></head>
            <body style="font-family: sans-serif; padding: 40px; text-align: center; background: #0f172a; color: #f8fafc;">
              <h1>SkillBridge Backend API is Running 🚀</h1>
              <p>API endpoints are accessible at <code>/api/*</code>.</p>
              <p>For development UI, ensure the client is running via <code>npm run dev</code> in <code>/client</code>.</p>
            </body>
          </html>
        `);
      }
    });
  }
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  next();
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` SkillBridge Backend running on http://localhost:${PORT}`);
    console.log(` API Health Check: http://localhost:${PORT}/api/health`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
