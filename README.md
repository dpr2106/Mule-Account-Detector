# Sentinel AI: Anti-Money Laundering & Mule Account Detection

Sentinel AI is a real-time transaction monitoring system designed to detect, track, and prevent money laundering via mule accounts. It leverages a trained AI model to analyze continuous streams of banking transactions and identifies suspicious behavior based on transaction velocity, geographical anomalies, and risk scoring.

## 🚀 Key Features

*   **Real-Time AI Detection**: Ingests live transaction streams and flags potential mule accounts instantly.
*   **Global Threat Map**: A 3D interactive globe visualization that maps the geographical origin and destination of suspicious transactions.
*   **Layering / Money Trail Prediction**: Automatically predicts how illicit funds are being funneled (Offshore, Crypto, Shell Corporations) to break the paper trail.
*   **Live Analytics Dashboard**: Tracks total volume scanned, active threats, and total fraud prevented in real-time.
*   **Instant Audio Alerts**: Sci-fi audio notifications alert compliance officers the moment a critical threat is detected.

## 💻 Tech Stack

**Frontend:**
*   Next.js 14 (App Router)
*   React & TypeScript
*   Tailwind CSS (v4)
*   React Globe.GL (for 3D WebGL visualizations)

**Backend:**
*   Python 3 & FastAPI
*   Scikit-Learn (AI Model Training & Inference)
*   Pandas (Data Processing)
*   Uvicorn (ASGI Server)

## 🛠️ Local Setup Instructions

### 1. Start the Python Backend
The backend runs the AI model and the real-time transaction simulator.

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py
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
*Developed for the Hackathon 2026. Note: For security and compliance reasons, source code files are restricted and not published directly to this public repository.*
