# Vespa AI: Intelligent Mule Account Detection 🛡️

Vespa AI is a real-time financial intelligence platform designed to detect, track, and prevent money mule networks using advanced Machine Learning (XGBoost) and AI-driven behavioral analysis.

## 🚀 The Problem
Money laundering through "mule accounts" costs the global economy billions annually. Traditional rule-based systems generate massive false positives and fail to catch sophisticated layering techniques where funds are split across multiple offshore and crypto accounts in seconds.

## 💡 Our Solution
Vespa AI acts as an AI-powered co-pilot for Financial Intelligence Units (FIUs) and compliance teams. It ingests live transaction feeds and analyzes thousands of behavioral features in milliseconds.

### Key Features
- **Real-Time Risk Scoring**: Powered by a trained XGBoost ensemble model evaluating 3,900+ data points per transaction.
- **Role-Based Access Control (RBAC)**: Secure portal for L1 Analysts and L2 Investigators.
- **Network Graphing**: Visualizes the flow of funds to uncover hidden mule rings and "Master Mules."
- **Global Threat Map**: Geospatial mapping of high-risk offshore transfers.
- **Automated SAR Generation**: One-click generation of Suspicious Activity Reports (PDF) for regulatory submission.
- **Live CISA Integration**: Pulls real-time cybersecurity advisories to cross-reference threats.

## 🏗️ Architecture
- **Frontend**: Next.js (React), Tailwind CSS, Three.js (Threat Globe), Recharts
- **Backend**: FastAPI (Python), Pandas, Scikit-Learn, XGBoost
- **AI/ML Engine**: XGBoost Classifier trained on anonymized historical banking datasets.

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+

### Running the Backend
```bash
cd backend
pip install -r requirements.txt # (uvicorn, fastapi, xgboost, pandas, scikit-learn)
python main.py
```
*The backend runs on `http://localhost:8000`*

### Running the Frontend
```bash
cd frontend
npm install
npm run dev
```
*The dashboard runs on `http://localhost:3000`*

## 🔒 Security & RBAC
Access to the Vespa AI dashboard requires authorization. The system supports multiple clearance levels to ensure data privacy and compliance with banking regulations.

---
*Built with ❤️ for the Mule Account Hackathon*
