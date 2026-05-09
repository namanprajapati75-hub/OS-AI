import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        bg: {
          DEFAULT: "#030712",
          secondary: "#0a0f1e",
          card: "#080d1a",
          elevated: "#0d1424",
        },
        border: {
          DEFAULT: "#1a2340",
          bright: "#2a3560",
          glow: "#3d4f8a",
        },
        accent: {
          orange: "#f97316",
          purple: "#8b5cf6",
          cyan: "#06b6d4",
          pink: "#ec4899",
          green: "#22c55e",
          blue: "#3b82f6",
          emerald: "#10b981",
          indigo: "#6366f1",
        },
        text: {
          primary: "#f1f5f9",
          secondary: "#94a3b8",
          muted: "#475569",
          dim: "#334155",
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "slide-up": "slideUp 0.3s ease-out",
        "fade-in": "fadeIn 0.4s ease-out",
        "terminal-blink": "blink 1s step-end infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        glowPulse: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.02)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      boxShadow: {
        "glow-orange": "0 0 20px rgba(249, 115, 22, 0.3)",
        "glow-purple": "0 0 20px rgba(139, 92, 246, 0.3)",
        "glow-cyan": "0 0 20px rgba(6, 182, 212, 0.3)",
        "glow-sm": "0 0 10px rgba(139, 92, 246, 0.2)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.5)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "glow-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "grid-pattern": "linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid": "60px 60px",
      },
    },
  },
  plugins: [],
};

export default config;
