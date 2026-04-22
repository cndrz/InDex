import React, { useState } from 'react';

const DataTable = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState(null);
  const [hiddenCols, setHiddenCols] = useState({});
  
  const columns = Object.keys(data.columnStats);
  const visibleColumns = columns.filter(col => !hiddenCols[col]);
  
  let rows = [...data.previewData];
  
  if (searchTerm) {
    const lower = searchTerm.toLowerCase();
    rows = rows.filter(r => 
       visibleColumns.some(col => String(r[col]).toLowerCase().includes(lower))
    );
  }
  
  if (sortConfig !== null) {
      rows.sort((a, b) => {
         const valA = a[sortConfig.key] ?? '';
         const valB = b[sortConfig.key] ?? '';
         if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
         if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
         return 0;
      });
  }

  const handleSort = (key) => {
     let direction = 'asc';
     if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
     }
     setSortConfig({ key, direction });
  };
  
  const toggleCol = (col) => {
      setHiddenCols(prev => ({ ...prev, [col]: !prev[col] }));
  };

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '1rem'}}>
         <h2>Data Preview <span style={{fontSize: '1rem', color: 'var(--text-muted)'}}>(Top 100 rows)</span></h2>
         
         <div style={{display: 'flex', gap: '10px'}}>
             <input 
               type="text" 
               placeholder="Search table..." 
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               style={{
                 padding: '8px 12px',
                 borderRadius: '6px',
                 background: 'rgba(255,255,255,0.05)',
                 border: '1px solid var(--panel-border)',
                 color: 'var(--text-main)',
                 outline: 'none',
                 minWidth: '250px'
               }}
             />
             <div className="dropdown" style={{position: 'relative', display: 'inline-block'}}>
                <button className="btn btn-secondary">Toggle Columns</button>
                <div className="dropdown-content glass-panel" style={{position: 'absolute', right: 0, top: '40px', zIndex: 10, display: 'none', flexDirection: 'column', gap: '8px', minWidth: '200px', maxHeight: '300px', overflowY: 'auto'}}>
                   {columns.map(col => (
                       <label key={col} style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem'}}>
                           <input type="checkbox" checked={!hiddenCols[col]} onChange={() => toggleCol(col)} /> {col}
                       </label>
                   ))}
                </div>
             </div>
         </div>
      </div>
      
      <div className="table-wrapper glass-panel" style={{padding: 0, overflow: 'hidden'}}>
         <div style={{overflowX: 'auto', maxHeight: '500px', overflowY: 'auto'}}>
            <table>
              <thead style={{position: 'sticky', top: 0, background: '#1c2128', zIndex: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.2)'}}>
                 <tr>
                   {visibleColumns.map(col => (
                     <th key={col} onClick={() => handleSort(col)} style={{cursor: 'pointer', whiteSpace: 'nowrap'}}>
                        {col} <span style={{color: 'var(--accent-color)'}}>{sortConfig?.key === col ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</span>
                     </th>
                   ))}
                 </tr>
              </thead>
              <tbody>
                 {rows.map((row, i) => (
                    <tr key={i}>
                      {visibleColumns.map(col => (
                         <td key={col} style={{whiteSpace: 'nowrap'}}>{row[col] !== null && row[col] !== undefined ? String(row[col]) : <span style={{color: 'var(--text-muted)'}}>null</span>}</td>
                      ))}
                    </tr>
                 ))}
                 {rows.length === 0 && (
                    <tr><td colSpan={visibleColumns.length} style={{textAlign: 'center'}}>No matching records found.</td></tr>
                 )}
              </tbody>
            </table>
         </div>
      </div>
      
      <style>{`
         .dropdown:hover .dropdown-content {
             display: flex !important;
         }
      `}</style>
    </div>
  );
};
export default DataTable;
