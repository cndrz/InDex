const ss = require('simple-statistics');

function analyzeData(data, columns) {
  const stats = {};

  columns.forEach((col) => {
    let nullCount = 0;
    const values = [];
    const uniqueVals = new Set();
    let numCount = 0;
    let boolCount = 0;
    let stringCount = 0;
    let dateCount = 0;

    data.forEach((row) => {
      const val = row[col];
      if (val === null || val === undefined || val === '') {
        nullCount++;
      } else {
        uniqueVals.add(val);
        values.push(val);

        if (typeof val === 'number') {
          numCount++;
        } else if (typeof val === 'boolean') {
          boolCount++;
        } else if (!isNaN(Date.parse(val)) && typeof val === 'string' && val.length > 5 && isNaN(Number(val))) {
          dateCount++;
        } else {
          stringCount++;
        }
      }
    });

    let type = 'string';
    if (numCount > stringCount && numCount > boolCount && numCount > dateCount) type = 'number';
    else if (dateCount > stringCount && dateCount > boolCount) type = 'date';
    else if (boolCount > stringCount && boolCount > numCount) type = 'boolean';
    
    // Convert to strict numbers if it's considered numeric
    const numericValues = type === 'number' ? values.map(v => Number(v)).filter(v => !isNaN(v)) : [];

    const isNumeric = type === 'number' && numericValues.length > 0;

    stats[col] = {
      type,
      nullCount,
      uniqueCount: uniqueVals.size,
      totalNonNull: values.length,
      numericStats: isNumeric ? {
        min: Number(ss.min(numericValues).toFixed(4)),
        max: Number(ss.max(numericValues).toFixed(4)),
        mean: Number(ss.mean(numericValues).toFixed(4)),
        median: Number(ss.median(numericValues).toFixed(4)),
        stdDev: numericValues.length > 1 ? Number(ss.standardDeviation(numericValues).toFixed(4)) : 0,
      } : null,
      histogram: isNumeric ? generateHistogram(numericValues, 10) : null,
      valueCounts: type === 'string' || type === 'boolean' 
        ? getValueCounts(values).slice(0, 10) 
        : null
    };
  });

  return stats;
}

function getValueCounts(values) {
  const counts = {};
  values.forEach(v => { counts[v] = (counts[v] || 0) + 1; });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([val, count]) => ({ val, count }));
}

function generateHistogram(values, binsCount) {
  if (!values || values.length === 0) return [];
  const min = ss.min(values);
  const max = ss.max(values);
  if (min === max) return [{ binStart: min, binEnd: max, count: values.length }];

  const binWidth = (max - min) / binsCount;
  const bins = Array.from({ length: binsCount }, (_, i) => ({
    binStart: Number((min + i * binWidth).toFixed(4)),
    binEnd: Number((min + (i + 1) * binWidth).toFixed(4)),
    count: 0
  }));

  values.forEach(v => {
    let binIndex = Math.floor((v - min) / binWidth);
    if (binIndex === binsCount) binIndex--; 
    bins[binIndex].count++;
  });

  return bins;
}

function generateCorrelationMatrix(data, columnStats) {
  const numericColumns = Object.keys(columnStats).filter(col => columnStats[col].type === 'number');
  const matrix = [];

  for (let i = 0; i < numericColumns.length; i++) {
    for (let j = 0; j < numericColumns.length; j++) {
      const colA = numericColumns[i];
      const colB = numericColumns[j];
      
      const pairs = [];
      data.forEach(row => {
        const a = Number(row[colA]);
        const b = Number(row[colB]);
        if (!isNaN(a) && !isNaN(b)) {
           pairs.push([a, b]);
        }
      });
      
      let corr = 0;
      if (pairs.length > 1) {
        try {
          const arrA = pairs.map(p => p[0]);
          const arrB = pairs.map(p => p[1]);
          // Standard Deviation must be > 0 to have correlation
          if (ss.standardDeviation(arrA) > 0 && ss.standardDeviation(arrB) > 0) {
              corr = ss.sampleCorrelation(arrA, arrB);
          }
          if (isNaN(corr)) corr = 0;
        } catch(e) { corr = 0; }
      }
      
      matrix.push([i, j, Number(corr.toFixed(2))]);
    }
  }
  return { numericColumns, matrix };
}

module.exports = { analyzeData, generateCorrelationMatrix };
