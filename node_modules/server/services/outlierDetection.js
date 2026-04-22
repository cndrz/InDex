function detectOutliersAndQuality(data, columns, columnStats) {
  const missingByColumn = columns.map(col => ({
    name: col,
    missing: columnStats[col].nullCount
  }));

  let duplicates = 0;
  const hashSet = new Set();
  
  const numericColumns = columns.filter(col => columnStats[col].type === 'number' && columnStats[col].numericStats);
  let totalOutliers = 0;

  data.forEach(row => {
    const str = JSON.stringify(row);
    if (hashSet.has(str)) {
      duplicates++;
    } else {
      hashSet.add(str);
    }

    let isOutlier = false;
    for (const col of numericColumns) {
       const val = Number(row[col]);
       const stats = columnStats[col].numericStats;
       if (!isNaN(val) && stats && stats.stdDev > 0) {
           const zScore = Math.abs((val - stats.mean) / stats.stdDev);
           if (zScore > 3) {
             isOutlier = true;
             break;
           }
       }
    }
    if (isOutlier) totalOutliers++;
  });

  return {
    missingByColumn,
    duplicates,
    totalOutliers,
  };
}

module.exports = { detectOutliersAndQuality };
