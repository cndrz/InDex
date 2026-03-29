import React from 'react';

const DataSummary = ({ data }) => {
  const { rowCount, columnCount } = data.summary;
  
  return (
    <div>
      <h2 style={{ marginBottom: "24px" }}>Dataset Overview</h2>
      <div className="summary-cards">
         <div className="stat-card glass-panel" style={{background: 'rgba(255,255,255,0.02)'}}>
            <span className="stat-title">Total Rows</span>
            <span className="stat-value">{rowCount.toLocaleString()}</span>
         </div>
         <div className="stat-card glass-panel" style={{background: 'rgba(255,255,255,0.02)'}}>
            <span className="stat-title">Total Columns</span>
            <span className="stat-value">{columnCount.toLocaleString()}</span>
         </div>
         <div className="stat-card glass-panel" style={{background: 'rgba(255,255,255,0.02)'}}>
            <span className="stat-title">Duplicate Rows</span>
            <span className="stat-value" style={{color: data.dataQuality.duplicates > 0 ? "var(--accent-color)" : "var(--text-main)"}}>{data.dataQuality.duplicates.toLocaleString()}</span>
         </div>
         <div className="stat-card glass-panel" style={{background: 'rgba(255,255,255,0.02)'}}>
            <span className="stat-title">Outlier Rows</span>
            <span className="stat-value" style={{color: data.dataQuality.totalOutliers > 0 ? "var(--danger-color)" : "var(--text-main)"}}>{data.dataQuality.totalOutliers.toLocaleString()}</span>
         </div>
      </div>

      <h3 style={{ marginTop: "32px", marginBottom: "16px" }}>Column Breakdown</h3>
      <div className="table-wrapper glass-panel" style={{padding: 0, overflow: 'hidden'}}>
         <div style={{overflowX: 'auto'}}>
             <table>
               <thead>
                 <tr>
                   <th>Column Name</th>
                   <th>Inferred Type</th>
                   <th>Total Non-Null</th>
                   <th>Missing (Nulls)</th>
                   <th>Unique Values</th>
                 </tr>
               </thead>
               <tbody>
                 {Object.entries(data.columnStats).map(([colName, stats]) => (
                    <tr key={colName}>
                      <td style={{fontWeight: 600, color: "var(--accent-color)"}}>{colName}</td>
                      <td style={{textTransform: 'capitalize'}}>{stats.type}</td>
                      <td>{stats.totalNonNull.toLocaleString()}</td>
                      <td style={{color: stats.nullCount > 0 ? "var(--danger-color)" : "inherit", fontWeight: stats.nullCount > 0 ? 600 : 400}}>{stats.nullCount.toLocaleString()}</td>
                      <td>{stats.uniqueCount.toLocaleString()}</td>
                    </tr>
                 ))}
               </tbody>
             </table>
         </div>
      </div>
    </div>
  );
};

export default DataSummary;
