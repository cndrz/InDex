import React from 'react';

const ExportPanel = ({ data }) => {
  const exportCsv = () => {
    import('papaparse').then((Papa) => {
       const csv = Papa.unparse(data.previewData);
       const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
       const link = document.createElement("a");
       const url = URL.createObjectURL(blob);
       link.setAttribute("href", url);
       link.setAttribute("download", "cleaned_dataset_preview.csv");
       link.style.visibility = 'hidden';
       document.body.appendChild(link);
       link.click();
       document.body.removeChild(link);
    });
  };

  const exportPdf = () => {
     window.print();
  };

  return (
    <div className="glass-panel" style={{marginTop: '24px', display: 'flex', gap: '16px', alignItems: 'center'}}>
       <h3 style={{margin: 0, marginRight: 'auto'}}>Export Options</h3>
       <button className="btn" onClick={exportCsv}>⬇ Download Top 100 Rows</button>
       <button className="btn btn-secondary" onClick={exportPdf}>🖨 Print / Save as PDF</button>
    </div>
  );
};

export default ExportPanel;
