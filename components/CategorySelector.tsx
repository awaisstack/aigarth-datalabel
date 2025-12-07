"use client";

import { Category } from "@/lib/qubic";
import { motion } from "framer-motion";

interface Props {
    selected: Category;
    onSelect: (c: Category) => void;
}

const CATEGORIES: Category[] = ["Medical AI", "Autonomous Driving", "Content Moderation"];

export default function CategorySelector({ selected, onSelect }: Props) {
    return (
        <div className="flex justify-center gap-4 mb-8 overflow-x-auto no-scrollbar py-4 px-4 sticky top-0 z-40 bg-gradient-to-b from-black to-transparent backdrop-blur-[2px]">
            {CATEGORIES.map((cat, i) => (
                <motion.button
                    key={cat}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => onSelect(cat)}
                    className={`
            relative px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border
            ${selected === cat
                            ? "bg-purple-600/20 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                            : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20"
                        }
          `}
                >
                    {selected === cat && (
                        <span className="absolute inset-0 rounded-full bg-purple-500/20 blur-md -z-10" />
                    )}
                    {cat}
                </motion.button>
            ))}
        </div>
    );
}
