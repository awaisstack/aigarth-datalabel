# 🧠 Aigarth DataLabel

> **Decentralized AI Training Data Marketplace on Qubic**  
> Zero fees. Instant payments. Cryptographic proof of work.

[![Qubic Hackathon](https://img.shields.io/badge/Qubic-Hackathon%202024-cyan)](https://qubic.org)
[![Track](https://img.shields.io/badge/Track-Experimental%20%231-purple)](https://github.com/qubic/qubic-hackathon)

---

## 🎯 The Problem

AI models need massive amounts of labeled training data. Current solutions fail:

| Platform | Problem |
|----------|---------|
| **Scale AI** | Enterprise-only, expensive, no worker payments |
| **Amazon MTurk** | 20-40% platform fees |
| **Ethereum dApps** | $5+ gas per transaction destroys micropayments |
| **Solana dApps** | Still has fees, complex wallet UX |

**For a $0.10 labeling task on Ethereum, gas fees could cost $5. That's a 5000% fee.**

---

## 🚀 The Solution: Aigarth DataLabel

A **feeless, Click-to-Earn marketplace** that crowdsources labeled data for AI training using Qubic's instant consensus.

### Why Qubic?

| Feature | Qubic | Ethereum | Solana |
|---------|-------|----------|--------|
| **Transaction Fee** | **$0** | $2-50 | $0.02 |
| **Finality** | **~3 sec** | 15 min | 12 sec |
| **Wallet Popups** | **None** | Every tx | Every tx |
| **AI Integration** | **Aigarth Native** | None | None |

---

## ⚡ Key Features

### 1. Zero-Friction UX
No MetaMask popups. Workers paste their 60-character Qubic ID and start earning immediately.

### 2. Feeless Micropayments
100% of earnings go to workers. No gas. No platform cut.

### 3. Cryptographic Proof of Work
Every label submission generates a **Blockchain Proof** - an immutable transaction hash verifiable on QForge.

### 4. Real Blockchain Integration
- Live connection to `testnet-rpc.qubicdev.com`
- Real treasury with 15B QU balance
- Actual transaction broadcasts

---

## 🎮 Quick Demo

### Live Link
https://aigarth-datalabel-hacks.vercel.app/

### Test Locally
```bash
git clone https://github.com/your-repo/q-label-app
cd q-label-app
npm install
npm run dev
# Open http://localhost:3000
```

### Demo Flow
1. **Enter any 60-character Qubic ID** (e.g., `AAAAAA...` 60 A's work for testing)
2. **Select a category** (Medical AI, Autonomous Driving, Content Moderation)
3. **Label tasks** → Earn 100 QU per correct label
4. **Click "Claim Now"** → See real blockchain transaction
5. **"Copy Blockchain Proof"** → Cryptographic evidence of the on-chain transaction

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14, React, TypeScript |
| **Styling** | Tailwind CSS, Framer Motion |
| **3D** | Three.js (R3F) |
| **Blockchain** | @qubic-lib/qubic-ts-library |
| **RPC** | testnet-rpc.qubicdev.com |

---

## 📋 What is "Blockchain Proof"?

When a worker claims earnings, we broadcast a real transaction to the Qubic testnet. The **Copy Blockchain Proof** button copies:

```json
{
  "timestamp": "2024-12-07T18:00:00.000Z",
  "sourceId": "TREASURY_ID...",
  "destinationId": "WORKER_ID...",
  "amount": 100,
  "targetTick": 38652607,
  "transactionId": "abc123...",
  "rpcSource": "QUBICDEV_TESTNET",
  "status": "BROADCAST_SUCCESS"
}
```

This is **cryptographic proof** that work was done and payment was issued. Verifiable forever.

---

## 🔮 Future Vision: Aigarth + Neuraxon

This platform is designed to feed training data directly into **Aigarth**, Qubic's native AI:

1. **Trinary Logic Data** - Labels optimized for Aigarth's -1/0/+1 architecture
2. **Neuraxon Integration** - Direct pipeline to AI training infrastructure
3. **Consensus Validation** - Multiple workers verify each label for quality
4. **Company Pools** - Enterprises fund task pools, workers drain them through labor

---

## 📁 Project Structure

```
q-label-app/
├── app/                    # Next.js 14 App Router
│   ├── api/rpc/           # RPC proxy endpoints
│   └── page.tsx           # Main entry
├── components/
│   ├── landing-page.tsx   # Hero + Login
│   ├── LabelingInterface.tsx  # Worker task UI
│   ├── CompanyPortal.tsx  # Company dashboard
│   ├── Earnings.tsx       # Claim + TX display
│   └── NetworkStatusPanel.tsx  # Live RPC status
├── lib/
│   ├── qubic.ts          # Blockchain helpers
│   └── config.ts         # Demo mode toggle
└── README.md
```

---

## 🏆 Hackathon Submission

**Project:** Aigarth DataLabel  
**Track:** Experimental #1  
**Team:** Enlighteners

### What Makes This Different?

Unlike other hackathon submissions focused on monitoring or alerts, we built a **complete application** with real user value:

- Workers earn real (testnet) QU
- Real blockchain transactions
- Production-ready UI/UX
- Direct path to Aigarth integration

---

## 📜 License

MIT License - Built for the Qubic Hackathon 2024
