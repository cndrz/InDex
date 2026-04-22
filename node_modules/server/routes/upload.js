const express = require('express');
const router = express.Router();
const multer = require('multer');
const Papa = require('papaparse');
const { analyzeData, generateCorrelationMatrix } = require('../services/dataAnalyzer');
const { detectOutliersAndQuality } = require('../services/outlierDetection');

// Multer memory storage configured with 50MB file size limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }
});

router.post('/upload', upload.single('dataset'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No CSV file uploaded' });
  }

  const csvString = req.file.buffer.toString('utf8');

  Papa.parse(csvString, {
    header: true,
    dynamicTyping: true, // converts numbers and booleans automatically
    skipEmptyLines: true,
    complete: (results) => {
      if (results.errors.length && results.data.length === 0) {
        return res.status(400).json({ error: 'Failed to parse CSV', details: results.errors });
      }

      const rawData = results.data;
      const columns = results.meta.fields || [];

      try {
        // Analysis Pipeline
        const columnStats = analyzeData(rawData, columns);
        const dataQuality = detectOutliersAndQuality(rawData, columns, columnStats);
        const correlationMatrix = generateCorrelationMatrix(rawData, columnStats);

        res.json({
          previewData: rawData.slice(0, 100), // First N rows
          summary: {
            rowCount: rawData.length,
            columnCount: columns.length,
          },
          columnStats,
          dataQuality,
          correlationMatrix,
        });
      } catch (err) {
        console.error("Analysis Error:", err);
        res.status(500).json({ error: 'Error during data analysis', message: err.message });
      }
    },
    error: (err) => {
      res.status(500).json({ error: 'Error reading CSV inside PapaParse', details: err.message });
    }
  });
});

module.exports = router;
