# Design Handoff: Aigarth DataLabel

**Current Status**: Functional MVP with "Developer Art" (Tailwind/CSS).
**Goal**: Transform into a World-Class, "Sci-Fi/High-Tech" Product.

## 🎨 Brand Identity
*   **Name**: Aigarth DataLabel
*   **Vibe**: Cyberpunk, Neural Network, "The Matrix meets Apple", Deep Space.
*   **Core Palette**:
    *   **Background**: Deep Black/Blue Void (`bg-gray-950` / Deep Gradients).
    *   **Primary**: Neon Cyan (`text-cyan-400`) - Represents Intelligence/AI.
    *   **Secondary**: Electric Purple (`text-purple-500`) - Represents the Qubic Network.
    *   **Status Indicators**: Green (Verified), Red (Honey Pot Failed), Amber (Warning).

## 📱 User Flows & UI Components

### 1. Landing / Access Point
*   **Audience**: Global workforce (Gig workers).
*   **Current Elements**:
    *   **Hero**: Large "Aigarth DataLabel" Title with Glow effect.
    *   **Wallet Input**: A central Input field for the 55-60 char Qubic ID.
        *   *Designer Note*: Needs to feel like entering a "Secure Terminal" or "Access Key".
    *   **Value Props**: 3 Cards showing "Consensus", "Zero Gas", "Aigarth Native".
        *   *Designer Note*: These look generic right now. Needs custom iconography or 3D elements.

### 2. The Labeling Interface (Worker View)
This is the core "Workstation". It needs to feel sticky and gamified.
*   **Container**: Currently a "GlassCard" (translucent blur). Needs refinement (better frost effect).
*   **HUD Elements**:
    *   **Reputation Score**: Top right. Needs to look like a vital life-bar.
    *   **Session ID**: Low opacity technical text.
*   **Task Area**:
    *   **Image**: 16:9 Aspect Ratio. Needs "Scanning" effects or overlays to sell the AI vibe.
    *   **Controls**: Big, thumb-friendly buttons for "Option A" vs "Option B".
*   **Feedback**:
    *   **Success**: +100 QU (Green Flash). Needs a satisfying "dopamine hit" animation.
    *   **Failure**: "HONEY POT FAILED" (Red glitch effect). Needs to feel penalizing.

### 3. Company Portal (Funder View)
*   **Audience**: AI Startups / Enterprise.
*   **Vibe**: Professional Dashboard, "Command Center".
*   **Key Actions**:
    *   **Select Category**: Tabs for "Medical", "Driving", "Moderation".
    *   **Funding Wallet**: Displays the Smart Contract Address. Needs to look like a high-value crypto vault.
    *   **Actions**: "Add Funds" (Wallet Connect) and "Upload Data" (Aigarth Uplink).

## 🛠️ Technical Constraints
*   **Framework**: Next.js 15 (React).
*   **Styling**: Tailwind CSS (Utility classes).
*   **Animation**: Framer Motion (we can implement complex animations if you design them).
*   **Assets**: SVG Icons preferred.

## 🚀 The Request to Designer
>"Take the current functional wireframes and make them look premium. Focus on **Typography** (Inter/Rajdhani?), **Micro-interactions** (glows, borders), and **Visual Hierarchy**. The app should feel like a piece of alien technology that humans use to train machines."
