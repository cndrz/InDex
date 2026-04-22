import React, { useCallback, useState } from 'react';
import { UploadCloud } from 'lucide-react';

const FileUpload = ({ onUpload, loading }) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        onUpload(file);
      } else {
        alert("Please upload a CSV file only.");
      }
    }
  }, [onUpload]);

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files[0]);
    }
  };

  if (loading) {
     return (
        <div className="glass-panel" style={{ textAlign: "center", padding: "4rem" }}>
           <span className="loader"></span>
           <h2 style={{marginTop: "1rem"}}>Crunching Data...</h2>
           <p className="upload-subtext">Calculating statistics, drawing heatmaps...</p>
        </div>
     );
  }

  return (
    <div 
      className={`upload-zone ${isDragActive ? 'active' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-upload').click()}
    >
      <input 
        id="file-upload" 
        type="file" 
        accept=".csv" 
        style={{ display: 'none' }} 
        onChange={handleChange} 
      />
      <UploadCloud size={64} className="upload-icon" />
      <h3 className="upload-text">Drag & Drop your CSV here</h3>
      <p className="upload-subtext">or click to browse files (Up to 50MB)</p>
    </div>
  );
};

export default FileUpload;
