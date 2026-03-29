import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import DataSummary from './components/DataSummary';
import DataTable from './components/DataTable';
import Visualizations from './components/Visualizations';
import DataQuality from './components/DataQuality';
import ExportPanel from './components/ExportPanel';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');

  const handleUpload = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('dataset', file);
    try {
      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const json = await response.json();
      setData(json);
      setActiveTab('summary');
    } catch(err) {
      alert("Error uploading file: " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="title">Dataset Explorer</h1>
        {data && <button className="btn btn-secondary" onClick={() => setData(null)}>New Upload</button>}
      </header>

      {!data && <FileUpload onUpload={handleUpload} loading={loading} />}
      
      {data && (
        <div className="dashboard-grid">
           <div className="tabs">
              <button className={`tab ${activeTab === 'summary' ? 'active' : ''}`} onClick={() => setActiveTab('summary')}>Summary</button>
              <button className={`tab ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>Data Preview</button>
              <button className={`tab ${activeTab === 'quality' ? 'active' : ''}`} onClick={() => setActiveTab('quality')}>Data Quality</button>
              <button className={`tab ${activeTab === 'visualizations' ? 'active' : ''}`} onClick={() => setActiveTab('visualizations')}>Visualizations</button>
           </div>
           
           <div className="glass-panel">
               {activeTab === 'summary' && <DataSummary data={data} />}
               {activeTab === 'preview' && <DataTable data={data} />}
               {activeTab === 'quality' && <DataQuality data={data} />}
               {activeTab === 'visualizations' && <Visualizations data={data} />}
           </div>
           
           <ExportPanel data={data} />
        </div>
      )}
    </div>
  );
}

export default App;
