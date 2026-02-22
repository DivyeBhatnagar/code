"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

export default function InteractiveDemo() {
  const [isTyping, setIsTyping] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const fullText = "Build a real-time chat app for our hackathon project";

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTyping(true);
      let index = 0;
      const typingInterval = setInterval(() => {
        if (index <= fullText.length) {
          setDisplayText(fullText.slice(0, index));
          index++;
        } else {
          clearInterval(typingInterval);
          setTimeout(() => {
            setIsTyping(false);
            setDisplayText("");
          }, 3000);
        }
      }, 50);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            See It In Action
          </h2>
          <p className="text-xl text-gray-500">
            Watch CodePilot transform your idea into an execution plan
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left: Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span className="font-semibold">Your Idea</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 min-h-[120px]">
              <p className="text-gray-700">
                {displayText}
                {isTyping && <span className="animate-pulse">|</span>}
              </p>
            </div>
          </motion.div>

          {/* Right: Output */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-8 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="font-semibold">AI Analysis</span>
            </div>

            <div className="space-y-4">
              {/* Shimmer loading effect */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <div className="text-xs font-semibold text-blue-600 mb-2">MVP SCOPE</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                      <span className="text-sm">WebSocket connection</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                      <span className="text-sm">Message persistence</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                      <span className="text-sm">User authentication</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <div className="text-xs font-semibold text-indigo-600 mb-2">TECH STACK</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      Next.js
                    </span>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                      Socket.io
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      PostgreSQL
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <div className="text-xs font-semibold text-green-600 mb-2">TIMELINE</div>
                  <div className="text-sm text-gray-700">
                    Estimated: <span className="font-semibold">8-12 hours</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
