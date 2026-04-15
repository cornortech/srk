const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4400;
const DIST_DIR = path.join(__dirname, 'dist/apps/task');

// Health Check Endpoint for DigitalOcean/Deployment
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', app: 'task' });
});

// Serve static assets (CSS, JS, images, etc.)
app.use(express.static(DIST_DIR, {
  maxAge: '1d',
  etag: false
}));

// SSG Routes - Serve pre-rendered HTML directly
app.get('/', (req, res, next) => {
  const filePath = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }
  next();
});

// All other routes - try SSG first, fallback to SPA
app.get('*', (req, res) => {
  const pathname = req.path;
  
  // Try exact path first
  let filePath = path.join(DIST_DIR, pathname);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return res.sendFile(filePath);
  }

  // Try with /index.html (SSG routes like /about, /blog, etc.)
  filePath = path.join(DIST_DIR, pathname, 'index.html');
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }

  // Fallback to main index.html for SPA routing (CSR pages)
  filePath = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }

  // 404
  res.status(404).send('Not Found');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Serving: ${DIST_DIR}`);
  console.log(`✅ SSG Routes: /about, /contact, /blog, /faq, etc.`);
  console.log(`✅ SPA Routes: /dashboard, /affiliate, etc.`);
});
