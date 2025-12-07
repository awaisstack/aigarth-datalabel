"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function CursorTrail() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const [isHovering, setIsHovering] = useState(false)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY })
        }

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (target.closest('button, a, input, [role="button"]')) {
                setIsHovering(true)
            } else {
                setIsHovering(false)
            }
        }

        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mouseover", handleMouseOver)

        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("mouseover", handleMouseOver)
        }
    }, [])

    return (
        <div className="fixed inset-0 pointer-events-none z-[60]">
            {/* Inner glow dot - FAST response */}
            <motion.div
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                animate={{
                    x: mousePos.x,
                    y: mousePos.y,
                    scale: isHovering ? 1.5 : 1,
                }}
                transition={{
                    type: "spring",
                    damping: 50,
                    stiffness: 800,
                    mass: 0.1,
                }}
            >
                <motion.div
                    className="w-3 h-3 rounded-full"
                    animate={{
                        backgroundColor: isHovering ? "rgb(168, 85, 247)" : "rgb(34, 211, 238)",
                        boxShadow: isHovering
                            ? "0 0 20px rgba(168, 85, 247, 0.8), 0 0 40px rgba(168, 85, 247, 0.4)"
                            : "0 0 15px rgba(34, 211, 238, 0.6), 0 0 30px rgba(34, 211, 238, 0.3)"
                    }}
                    transition={{ duration: 0.15 }}
                />
            </motion.div>

            {/* Outer ring - slightly delayed for visual effect */}
            <motion.div
                className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                animate={{
                    x: mousePos.x,
                    y: mousePos.y,
                    scale: isHovering ? 1.3 : 1,
                }}
                transition={{
                    type: "spring",
                    damping: 35,
                    stiffness: 400,
                    mass: 0.2,
                }}
            >
                <motion.div
                    className="w-full h-full rounded-full border"
                    animate={{
                        borderColor: isHovering ? "rgba(168, 85, 247, 0.4)" : "rgba(34, 211, 238, 0.3)",
                    }}
                    transition={{ duration: 0.15 }}
                />
            </motion.div>
        </div>
    )
}
