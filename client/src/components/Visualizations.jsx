import React from 'react';
import ReactECharts from 'echarts-for-react';

const Visualizations = ({ data }) => {
  const { columnStats, correlationMatrix } = data;
  const numCols = Object.keys(columnStats).filter(c => columnStats[c].type === 'number');
  const catCols = Object.keys(columnStats).filter(c => columnStats[c].type === 'string' || columnStats[c].type === 'boolean');

  const heatmapOption = {
     tooltip: { position: 'top' },
     grid: { height: '60%', top: '5%' },
     xAxis: { type: 'category', data: correlationMatrix.numericColumns, splitArea: { show: true }, axisLabel: { interval: 0, rotate: 30 } },
     yAxis: { type: 'category', data: correlationMatrix.numericColumns, splitArea: { show: true } },
     visualMap: { min: -1, max: 1, calculable: true, orient: 'horizontal', left: 'center', top: '85%', inRange: { color: ['#f85149', '#161b22', '#58a6ff'] } },
     series: [{
         name: 'Correlation',
         type: 'heatmap',
         data: correlationMatrix.matrix,
         label: { show: true, fontSize: 10 },
         emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
     }]
  };

  return (
    <div>
        <h2 style={{marginBottom: "24px"}}>Visual Analytics</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px'}}>
           <div className="glass-panel" style={{height: '600px', gridColumn: '1 / -1'}}>
               <h3 style={{marginBottom: "16px"}}>Correlation Matrix (Numeric Features)</h3>
               {numCols.length > 1 ? (
                   <ReactECharts option={heatmapOption} style={{height: '100%', width: '100%'}} theme="dark" opts={{ renderer: 'svg' }} />
               ) : (
                   <div style={{display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                      <p style={{color: 'var(--text-muted)'}}>Not enough numeric columns to generate Matrix.</p>
                   </div>
               )}
           </div>

           {numCols.slice(0, 6).map(col => {
                const hist = columnStats[col].histogram;
                if (!hist) return null;
                const opt = {
                    tooltip: { trigger: 'axis', axisPointer: {type: 'shadow'} },
                    xAxis: { type: 'category', data: hist.map(h => `${h.binStart}-${h.binEnd}`), axisLabel: { fontSize: 10, rotate: 25 } },
                    yAxis: { type: 'value' },
                    series: [{ type: 'bar', data: hist.map(h => h.count), itemStyle: { color: '#a371f7' } }]
                };
                return (
                    <div key={`hist-${col}`} className="glass-panel" style={{height: '350px'}}>
                        <h4 style={{marginBottom: "8px"}}>Distribution: <span style={{color: 'var(--accent-color)'}}>{col}</span></h4>
                        <ReactECharts option={opt} style={{height: 'calc(100% - 30px)', width: '100%'}} theme="dark" opts={{ renderer: 'svg' }} />
                    </div>
                );
           })}

           {catCols.slice(0, 6).map(col => {
                const vals = columnStats[col].valueCounts;
                if (!vals || vals.length === 0) return null;
                const opt = {
                    tooltip: { trigger: 'item' },
                    series: [{
                        type: 'pie',
                        radius: ['40%', '70%'],
                        itemStyle: { borderRadius: 10, borderColor: '#0d1117', borderWidth: 2 },
                        data: vals.map(v => ({ name: String(v.val).slice(0,15), value: v.count }))
                    }]
                };
                return (
                    <div key={`pie-${col}`} className="glass-panel" style={{height: '350px'}}>
                        <h4 style={{marginBottom: "8px"}}>Categories: <span style={{color: 'var(--accent-color)'}}>{col}</span></h4>
                        <ReactECharts option={opt} style={{height: 'calc(100% - 30px)', width: '100%'}} theme="dark" opts={{ renderer: 'svg' }} />
                    </div>
                );
           })}
        </div>
    </div>
  );
};
export default Visualizations;
