# Hackathon Submission: Aigarth DataLabel (Q-Label)

**Project Name:** Aigarth DataLabel
**Tagline:** The Scale AI of Web3 – A Human-Verification Layer for Aigarth.

## 💡 The Problem
AI companies spend billions on data labeling (Scale AI), but centralized services are expensive and slow.
Qubic's "Useful Proof-of-Work" (Aigarth) needs massive amounts of clean data to train its neural networks. There is currently no decentralized way to incentivize the global workforce to provide this attention at scale.

## 🚀 The Solution
We are building the **Human-Verification Layer for Aigarth**.
3.  **Result**: High-quality data that rivals centralized alternatives.

## 🏆 Competitive Advantage (Why Qubic?)
| Competitor | Flaw | Qubic Edge |
| :--- | :--- | :--- |
| **Scale AI** | **Expensive**: Huge corporate overhead. | **90% Cheaper**: Decentralized workforce. |
| **Human Protocol** | **Gas Fees**: Polygon/ETH fees kill micro-tasks. | **Zero Gas**: Pay $0.001 instantly. |
| **Hive** | **Closed Garden**: Hard for devs to access. | **Open**: Aigarth Native Protocol. |

## 💰 Business Model: The "Channels"
*   **Tier 1 (Public Crowd)**: Low Pay. Tasks: "Cat vs Dog", "Offensive Text". Worker: Anyone.
*   **Tier 2 (Expert Crowd)**: High Pay. Tasks: "Fracture vs Normal". Worker: **Verified Medical Students** (via Qubic ID/SBT).

## 🔮 Future Roadmap (Nostromo Launch)
*   **Phase 2**: Replace simulated payouts with real Qubic Smart Contract (C++) calls.
*   **Phase 3**: Launch on Nostromo to raise funds for the "Aigarth Data Trust"—a DAO that validates dataset quality before training.

## 🧠 Smart Contract Architecture (Proposed C++)
Since Qubic Smart Contracts use C++ and run on bare metal, our protocol `Q-Label` is designed as follows:
1.  **`struct Task`**: Compresses image hash and options into a 64-byte struct for efficiency.
2.  **`function SubmitLabel()`**: Accepts `[task_id, answer_index]` from worker. Verification happens via **Quorum Consensus** (3 workers must match).
3.  **`function Payout()`**: Triggered automatically when consensus is reached. Uses `transfer()` to send QUs from the Contract Treasury to the Worker ID.
4.  **Zero-Fee Logic**: We utilize Qubic's feeless nature to allow micro-transactions (100 QU) without gas overhead.

**Links:**
*   [Demo Video URL]
*   [GitHub Repo URL]
