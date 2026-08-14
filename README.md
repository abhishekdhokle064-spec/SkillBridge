# 🌐 SkillBridge • Cluster-Based Institutional Collaboration & Skill Platform

> **Bridging Skills. Connecting Institutions. Empowering Futures.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-Fast%20Bundler-646CFF.svg)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-API%20Server-000000.svg)](https://expressjs.com/)

---

## 📌 Problem Statement

Educational institutions frequently operate in isolation, resulting in underutilized training resources and limited industry exposure. **SkillBridge** develops a cluster-based platform enabling institutions to share high-cost infrastructure, expert faculty, internships, and corporate employment opportunities.

### Expected Outcomes & ROI
- **Better Resource Utilization**: Multi-institution scheduling boosts lab asset utilization by 4.2x (from 22% to 92%).
- **Avoided CapEx Duplication**: ₹7.16 Crores saved across member institutions.
- **Improved Skill Development**: Equal access to Tier-1 cleanrooms, 5G SDRs, and supercomputing clusters for Tier-2/3 scholars.
- **Stronger Industry Collaboration**: Direct talent pipelines with companies like TCS, Bosch, and Persistent.
- **Verifiable Cluster Credentials**: Cryptographically verifiable certificates with tamper-proof validation.

---

## ✨ Core Features

1. **🔬 Shared Resource & Lab Management**:
   - Live catalog of shared facilities across laboratories, classrooms, and hardware testbeds.
   - 1-click slot booking, authorized entry pass generation, and approval workflows.
   - "+ Add / Register Lab Facility" modal with quick-fill presets and visual image pickers.
2. **👨‍🏫 Faculty & Trainer Exchange**:
   - Cross-campus masterclass broadcasting with simulated WebRTC studio.
   - Direct faculty mentorship requests and skill rating analytics.
3. **💼 Centralized Internship Portal**:
   - 12+ live corporate internships across Technology, Manufacturing, DeepTech Research, and Government Space.
   - 1-click application submission with instant status tracking.
4. **🏢 Pooled Placement Drives**:
   - Consortium campus recruitment drives (TCS Digital, Bosch Mobility, Persistent AI).
   - Candidate evaluation pipeline across technical and executive rounds with offer management.
5. **🏆 Verifiable Certification Tracking**:
   - Public certificate verification engine with unique verification codes and verifiable skills ledger.
6. **📊 Cluster Analytics & ROI Dashboard**:
   - Utilization bar charts, inter-college MOU matrix, and CapEx savings breakdown.
7. **⚡ Hackathon Demo Pitch Mode**:
   - Floating quick-switch toolbar supporting 1-click evaluator journeys:
     - 🎓 *Student Scholar (Rahul Sharma)*
     - 🏛️ *Institution Admin (Dr. Mehra)*
     - 👩‍🔬 *Expert Trainer (Prof. Ananya Sen)*
     - 💼 *Corporate Recruiter (Pooja Verma)*

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Lucide Icons, Canvas Confetti, Responsive Vanilla CSS Design System
- **Backend**: Node.js, Express 5 REST API, Morgan Logging, CORS
- **Database**: Persistent JSON Transactional Store with ACID Atomic File Operations & Offline Local Storage Engine Fallback
- **Tooling**: Concurrently, dotenv

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/<YOUR_USERNAME>/skillbridge.git
cd skillbridge

# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 2. Start the Development Server
```bash
# Runs backend on port 5000 and frontend on port 3000 concurrently
npm run dev
```

Open your browser at **[http://localhost:3000](http://localhost:3000)**.

---

## 📂 Project Structure

```
skillbridge/
├── client/                     # Frontend React + Vite SPA
│   ├── public/                 # Favicon & assets
│   ├── src/
│   │   ├── components/         # SkillBridgeLogo, Navbar, Sidebar, AuthModal, HackathonDemoBar
│   │   ├── context/            # AppContext.jsx global state
│   │   ├── pages/              # Dashboard, Resources, Trainings, Internships, Placements, Settings, etc.
│   │   ├── services/           # api.js with fail-safe offline engine
│   │   ├── App.jsx             # Main router & layout
│   │   └── index.css           # Responsive design system
│   ├── index.html
│   └── vite.config.js          # Port 3000 + Proxy to Backend
├── server/                     # Backend Express REST API
│   ├── data/                   # JSON transactional database
│   ├── routes/                 # auth, resources, trainers, internships, certifications, placements, analytics
│   ├── db.js                   # Persistent database manager
│   ├── seed.js                 # Rich demo seed dataset
│   ├── test.js                 # Automated API test suite
│   └── index.js                # Express app entry point
├── package.json
└── README.md
```

---

## 🧪 Testing the API

Run the automated endpoint test suite:
```bash
node server/test.js
```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
