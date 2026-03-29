# InDex

**InDex** (Interactive Dataset Explorer) is a powerful web-based application designed to help data professionals, researchers, and enthusiasts quickly analyze, visualize, and assess the quality of their datasets.

## Features

- 📁 **CSV File Upload**: Seamlessly upload and parse your datasets.
- 📊 **Data Summary**: Get an immediate overview of your data, including row/column counts, missing values, and column data types.
- 🔍 **Data Preview**: Browse through your data in an interactive and paginated table.
- 🛡️ **Data Quality Assessment**: 
  - Automatically detect and highlight outlier values.
  - Identify and manage duplicate rows in your dataset.
- 📈 **Interactive Visualizations**: Generate rich, interactive charts based on your data columns (histograms, scatter plots, etc.) using ECharts.
- 💾 **Export Capabilities**: Export cleaned data or generate downloadable reports (PDF, PNG) containing your visualizations.

## Technology Stack

### Frontend
- **React** (via Vite)
- **ECharts** (for Interactive Visualizations)
- **Lucide React** (Icons)
- **jsPDF & html2canvas** (for Exporting features)

### Backend
- **Node.js & Express** 
- **Multer** (File uploading framework)
- **PapaParse** (Fast CSV processing)
- **simple-statistics** (Backend mathematical calculations)

## Getting Started

### Prerequisites

You need [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository (or download the source code).
2. Install dependencies for both the client and the server from the root directory:

```bash
npm install --prefix client
npm install --prefix server
npm install
```

### Running the Application Locally

You can run both the server and the frontend client concurrently with a single command from the root folder:

```bash
npm run dev
```

By default:
- The backend server will run on `http://localhost:3001`
- The frontend Vite app will run on `http://localhost:5173`

Open `http://localhost:5173` in your browser to start exploring your datasets.

## Contributing

Contributions, issues, and feature requests are welcome!

## License

This project is open-source and available under the ISC License.
