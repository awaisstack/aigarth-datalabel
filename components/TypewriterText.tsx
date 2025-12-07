"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface TypewriterTextProps {
    text: string
    delay?: number
    speed?: number
    className?: string
    onComplete?: () => void
}

export function TypewriterText({
    text,
    delay = 0,
    speed = 50,
    className = "",
    onComplete
}: TypewriterTextProps) {
    const [displayedText, setDisplayedText] = useState("")
    const [showCursor, setShowCursor] = useState(true)
    const [isComplete, setIsComplete] = useState(false)

    useEffect(() => {
        const startTimeout = setTimeout(() => {
            let currentIndex = 0
            const interval = setInterval(() => {
                if (currentIndex < text.length) {
                    setDisplayedText(text.slice(0, currentIndex + 1))
                    currentIndex++
                } else {
                    clearInterval(interval)
                    setIsComplete(true)
                    onComplete?.()
                }
            }, speed)

            return () => clearInterval(interval)
        }, delay)

        return () => clearTimeout(startTimeout)
    }, [text, delay, speed, onComplete])

    // Blinking cursor effect
    useEffect(() => {
        if (!isComplete) {
            const cursorInterval = setInterval(() => {
                setShowCursor(prev => !prev)
            }, 500)
            return () => clearInterval(cursorInterval)
        } else {
            // Hide cursor after completion
            const hideTimeout = setTimeout(() => setShowCursor(false), 1000)
            return () => clearTimeout(hideTimeout)
        }
    }, [isComplete])

    return (
        <motion.span
            className={className}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay / 1000 }}
        >
            {displayedText}
            <span
                className={`inline-block w-[2px] h-[1em] ml-1 bg-primary ${showCursor ? 'opacity-100' : 'opacity-0'}`}
                style={{ verticalAlign: 'baseline' }}
            />
        </motion.span>
    )
}
