const express = require('express');
const cors = require('cors');
const path = require('path');
const uploadRoute = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Main upload/analysis route
app.use('/api', uploadRoute);

app.get('/api/health', (req, res) => res.send('OK'));

// Serve static React files in production
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
