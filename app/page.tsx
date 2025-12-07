"use client"
// Force Rebuild V3 - Cinematic Minimalism

import { useState, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import LandingPage from "@/components/landing-page"
import { LabelingInterface } from "@/components/LabelingInterface"
import { CompanyPortal } from "@/components/CompanyPortal"
import { ThreeBackground } from "@/components/three-background"
import { CursorTrail } from "@/components/cursor-trail"
import { LoadingScreen } from "@/components/LoadingScreen"
import { NetworkStatusPanel } from "@/components/NetworkStatusPanel"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentView, setCurrentView] = useState<"landing" | "worker" | "company">("landing")
  const [walletId, setWalletId] = useState("")

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false)
  }, [])

  const handleWorkerAccess = (id: string) => {
    setWalletId(id)
    setCurrentView("worker")
  }

  const handleCompanyAccess = () => {
    setCurrentView("company")
  }

  const handleBack = () => {
    setCurrentView("landing")
    setWalletId("")
  }

  return (
    <main className="min-h-screen bg-background overflow-hidden relative">
      {/* Loading Screen */}
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      </AnimatePresence>

      {/* Background & Cursor (always visible after load) */}
      {!isLoading && (
        <>
          <ThreeBackground />
          <CursorTrail />
          <NetworkStatusPanel />
        </>
      )}

      {/* Content Layer (Above Background) */}
      <AnimatePresence mode="wait">
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 w-full h-full"
          >
            {currentView === "landing" && (
              <LandingPage onWorkerAccess={handleWorkerAccess} onCompanyAccess={handleCompanyAccess} />
            )}
            {currentView === "worker" && <LabelingInterface walletId={walletId} onBack={handleBack} />}
            {currentView === "company" && <CompanyPortal onBack={handleBack} />}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

