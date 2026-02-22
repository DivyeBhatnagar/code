"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { Sparkles, Zap, Rocket, Terminal } from "lucide-react";
import { useEffect, useState } from "react";

const terminalLines = [
  { type: "command", text: "$ codepilot analyze 'Build a real-time chat app'" },
  { type: "output", text: "✓ Analyzing project scope..." },
  { type: "output", text: "✓ Generating MVP roadmap..." },
  { type: "output", text: "✓ Optimizing tech stack..." },
  { type: "success", text: "✓ Ready to build! Estimated time: 8-12 hours" },
];

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentLine, setCurrentLine] = useState(0);
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Terminal typing animation
  useEffect(() => {
    if (currentLine >= terminalLines.length) {
      setTimeout(() => {
        setCurrentLine(0);
        setDisplayedText("");
      }, 3000);
      return;
    }

    const line = terminalLines[currentLine];
    let charIndex = 0;

    const typingInterval = setInterval(() => {
      if (charIndex <= line.text.length) {
        setDisplayedText(line.text.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setCurrentLine((prev) => prev + 1);
          setDisplayedText("");
        }, 800);
      }
    }, 30);

    return () => clearInterval(typingInterval);
  }, [currentLine]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    x.set((mousePosition.x - window.innerWidth / 2) / 50);
    y.set((mousePosition.y - window.innerHeight / 2) / 50);
  }, [mousePosition, x, y]);

  return (
    <section className="relative pt-32 pb-20 px-6 lg:px-8 overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
        >
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">
            CodePilot AI
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Built by hackers, for hackers. We&apos;ve automated the parts of hackathons that slow you down.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
        >
          <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-full hover:shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105">
            Launch App
          </button>
          <button className="w-full sm:w-auto px-8 py-4 border border-gray-300 text-primary font-medium rounded-full hover:border-gray-400 hover:bg-gray-50 transition-all">
            Learn More
          </button>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-6 mb-16 text-sm text-gray-500"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>AI Powered</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-600" />
            <span>Built for Hackathons</span>
          </div>
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-blue-600" />
            <span>Startup Ready</span>
          </div>
        </motion.div>

        {/* 3D Terminal mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            rotateX: useTransform(y, [-50, 50], [2, -2]),
            rotateY: useTransform(x, [-50, 50], [-2, 2]),
            transformStyle: "preserve-3d",
          }}
          className="max-w-5xl mx-auto perspective-1000"
        >
          <div className="relative">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-3xl blur-3xl" />
            
            {/* Main terminal card - Light theme */}
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              {/* Terminal header */}
              <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                  <Terminal className="w-4 h-4" />
                  <span>codepilot-ai</span>
                </div>
              </div>

              {/* Terminal content */}
              <div className="p-8 font-mono text-sm min-h-[280px] bg-gradient-to-br from-gray-50 to-white">
                {terminalLines.slice(0, currentLine).map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`mb-3 ${
                      line.type === "command"
                        ? "text-blue-600 font-semibold"
                        : line.type === "success"
                        ? "text-green-600 font-medium"
                        : "text-gray-600"
                    }`}
                  >
                    {line.text}
                  </motion.div>
                ))}
                
                {currentLine < terminalLines.length && (
                  <div
                    className={`mb-3 ${
                      terminalLines[currentLine].type === "command"
                        ? "text-blue-600 font-semibold"
                        : terminalLines[currentLine].type === "success"
                        ? "text-green-600 font-medium"
                        : "text-gray-600"
                    }`}
                  >
                    {displayedText}
                    <span className="inline-block w-2 h-4 bg-blue-600 ml-1 animate-pulse"></span>
                  </div>
                )}
              </div>

              {/* Floating Tech Stack card */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{ translateZ: 30 }}
                className="absolute -bottom-3 -left-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 shadow-2xl"
              >
                <div className="text-white">
                  <div className="text-xs font-bold mb-2 uppercase tracking-wide">Tech Stack</div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-medium">Next.js</span>
                    <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-medium">Socket.io</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
