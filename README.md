# Vespa AI: Anti-Money Laundering & Mule Account Detection

Vespa AI is a real-time transaction monitoring system designed to detect, track, and prevent money laundering via mule accounts. It leverages a trained AI model to analyze continuous streams of banking transactions and identifies suspicious behavior based on transaction velocity, geographical anomalies, and risk scoring.

## 🚀 Key Features

*   **Real-Time AI Detection**: Ingests live transaction streams and flags potential mule accounts instantly.
*   **Global Threat Map & Network Graph**: A 3D interactive globe and network visualizer mapping the geographical origin and destination of suspicious transactions.
*   **Vespa Copilot (AI Investigator)**: An integrated LLM copilot that assists investigators with risk analysis and specific transaction deep-dives.
*   **Investigator "Case Management" Dashboard**: A dedicated action center for investigators to review flagged high-risk cases, freeze accounts, dismiss alerts, or generate reports.
*   **Explainable AI (XAI) Risk Breakdown**: Transparent AI that provides a detailed breakdown of why a transaction was flagged (e.g., Transaction Velocity, Account Age).
*   **Advanced Analytics & Charts**: Comprehensive data visualization highlighting fraud trends, volumes, and targeted institutions over time.
*   **Critical SMS & Email Alerts**: Automated alerting system that instantly dispatches simulated SMS and email notifications to fraud teams for critical threats (>95% risk score).
*   **CSV Data Export**: One-click exporting of live transaction streams and flagged cases for external auditing and compliance reviews.
*   **Layering / Money Trail Prediction**: Automatically predicts how illicit funds are being funneled (Offshore, Crypto, Shell Corporations) to break the paper trail.
*   **Downloadable SAR PDFs**: One-click generation of formal Suspicious Activity Reports (SAR) for flagged mule accounts.
*   **Custom Data Uploads**: Directly upload CSV files to test and process real-time transaction data dynamically, completely bypassing standard simulations.

## 💻 Tech Stack

**Frontend:**
*   Next.js 14 (App Router)
*   React 18 & TypeScript
*   Tailwind CSS (v4)
*   React Globe.GL (for 3D WebGL visualizations)
*   Recharts (for Data Visualizations)

**Backend:**
*   Python 3 & FastAPI
*   Scikit-Learn (AI Model Training & Inference)
*   Pandas (Data Processing)
*   Uvicorn (ASGI Server)
*   Python-Multipart (Data Parsing)

## 🛠️ Local Setup Instructions

### 1. Start the Python Backend
The backend runs the AI model and the real-time transaction simulator.

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```
*The backend API will start on `http://localhost:8000`*

### 2. Start the Next.js Frontend
The frontend connects to the backend API to visualize the data.

```bash
cd frontend
npm install
npm run dev
```
*The dashboard will be available at `http://localhost:3000`*

---
Note: For security and compliance reasons, source code files are restricted and not published directly to the public repository rather being tested and developed in the local system requirements.*
