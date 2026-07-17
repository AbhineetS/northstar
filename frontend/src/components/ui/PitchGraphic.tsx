'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const PitchGraphic = () => {
  return (
    <motion.div 
      className="relative w-full max-w-[600px] aspect-[4/3] mx-auto flex items-center justify-center"
      initial={{ y: 0 }}
      animate={{ y: [-4, 4, -4] }}
      transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
    >
      {/* Soft Drop Shadow under the pitch */}
      <div className="absolute top-[60%] left-1/2 -translate-x-1/2 w-[80%] h-[30%] bg-black/10 blur-2xl rounded-[100%]" />

      <motion.div 
        className="relative w-full h-full"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <svg 
          viewBox="0 0 800 600" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
          style={{ transform: "rotateX(55deg) rotateZ(-40deg)", transformStyle: "preserve-3d" }}
        >
          {/* Pitch Base */}
          <rect x="100" y="50" width="600" height="400" rx="4" fill="#203d2b" />
          
          {/* Pitch Base Outline/Thickness Simulation */}
          <rect x="99" y="49" width="602" height="402" rx="4.5" stroke="#182e20" strokeWidth="2" />
          
          {/* Field Markings */}
          <g stroke="#ffffff" strokeWidth="2" opacity="0.8">
            {/* Outer Boundary */}
            <rect x="120" y="70" width="560" height="360" fill="none" />
            
            {/* Halfway Line */}
            <line x1="400" y1="70" x2="400" y2="430" />
            
            {/* Center Circle */}
            <circle cx="400" cy="250" r="40" fill="none" />
            
            {/* Center Spot */}
            <circle cx="400" cy="250" r="3" fill="#ffffff" />
            
            {/* Penalty Areas */}
            <rect x="120" y="150" width="80" height="200" fill="none" />
            <rect x="600" y="150" width="80" height="200" fill="none" />
            
            {/* Goal Areas */}
            <rect x="120" y="200" width="30" height="100" fill="none" />
            <rect x="650" y="200" width="30" height="100" fill="none" />
            
            {/* Penalty Arcs */}
            <path d="M200 210 Q240 250 200 290" fill="none" />
            <path d="M600 210 Q560 250 600 290" fill="none" />
            
            {/* Corner Arcs */}
            <path d="M130 70 A 10 10 0 0 0 120 80" fill="none" />
            <path d="M120 420 A 10 10 0 0 0 130 430" fill="none" />
            <path d="M670 70 A 10 10 0 0 1 680 80" fill="none" />
            <path d="M680 420 A 10 10 0 0 1 670 430" fill="none" />
          </g>
          
          {/* Glowing Player Markers */}
          <g>
            {/* Player 1 */}
            <circle cx="300" cy="280" r="6" fill="#D93844">
              <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0.6;1" dur="2s" repeatCount="indefinite" />
            </circle>
            
            {/* Player 2 */}
            <circle cx="480" cy="180" r="6" fill="#235B9A">
              <animate attributeName="r" values="6;8;6" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0.6;1" dur="2.5s" repeatCount="indefinite" />
            </circle>
            
            {/* Player 3 */}
            <circle cx="550" cy="320" r="6" fill="#D93844">
              <animate attributeName="r" values="6;7.5;6" dur="2.2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0.6;1" dur="2.2s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Animated Passing Route (Player 1 -> Player 2) */}
          <path 
            d="M 300 280 Q 400 200 480 180" 
            fill="none" 
            stroke="#ffffff" 
            strokeWidth="3" 
            strokeDasharray="10, 10" 
            opacity="0.9"
          >
            <animate 
              attributeName="stroke-dashoffset" 
              from="40" 
              to="0" 
              dur="1s" 
              repeatCount="indefinite" 
              calcMode="linear"
            />
          </path>
        </svg>
      </motion.div>
    </motion.div>
  );
};
