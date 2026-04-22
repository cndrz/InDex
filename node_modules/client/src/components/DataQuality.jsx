import React from 'react';
import ReactECharts from 'echarts-for-react';

const DataQuality = ({ data }) => {
  const { missingByColumn, duplicates, totalOutliers } = data.dataQuality;

  const missingChartOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value', name: 'Missing Values' },
    yAxis: { type: 'category', data: missingByColumn.map(m => m.name) },
    series: [
      {
        name: 'Missing Row Count',
        type: 'bar',
        data: missingByColumn.map(m => ({
            value: m.missing,
            itemStyle: { color: m.missing > 0 ? '#f85149' : '#2ea043' }
        }))
      }
    ]
  };

  return (
    <div>
      <h2 style={{ marginBottom: "24px" }}>Data Quality Report</h2>
      
      <div className="summary-cards" style={{marginBottom: "32px"}}>
         <div className="stat-card glass-panel" style={{borderLeft: duplicates > 0 ? "4px solid var(--accent-color)" : "4px solid var(--success-color)", background: 'rgba(255,255,255,0.02)'}}>
            <span className="stat-title">Duplicate Rows</span>
            <span className="stat-value">{duplicates.toLocaleString()}</span>
         </div>
         <div className="stat-card glass-panel" style={{borderLeft: totalOutliers > 0 ? "4px solid var(--danger-color)" : "4px solid var(--success-color)", background: 'rgba(255,255,255,0.02)'}}>
            <span className="stat-title">Outlier Potential</span>
            <span className="stat-value">{totalOutliers.toLocaleString()}</span>
            <span style={{fontSize: "0.85rem", color: "var(--text-muted)"}}>Rows with &gt; 3 StdDev values</span>
         </div>
      </div>

      <div className="glass-panel" style={{padding: "24px", background: 'rgba(255,255,255,0.01)'}}>
        <h3 style={{marginBottom: "16px"}}>Missing Values Profile</h3>
        <ReactECharts option={missingChartOption} style={{height: `${Math.max(400, missingByColumn.length * 30)}px`, width: '100%'}} theme="dark" opts={{ renderer: 'svg' }} />
      </div>
    </div>
  );
};

export default DataQuality;
