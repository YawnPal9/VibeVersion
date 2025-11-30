/*  Used figma to implement glassy button element effect to my Connect button on my site to enhance UX*/
/*
import React from "react";
import ReactDOM from "react-dom/client";
import { GlassyButton } from "./glassy button.tsx"; // if your code is modular

function handleConnect() {
  alert("Connected!");
}

ReactDOM.createRoot(document.getElementById("glassy-button-container")).render(
  <GlassyButton onClick={handleConnect}>Connect</GlassyButton>
);
interface GlassyButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function GlassyButton({ children, onClick, className = "" }: GlassyButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative
        px-8 py-4
        bg-[#FF69B4]/30                  /* hot-pink glass 
        backdrop-blur-xl
        border border-[#FF69B4]/40
        rounded-2xl
        shadow-lg shadow-[#FF69B4]/20
        transition-all duration-300
        hover:bg-[#FF69B4]/40
        hover:border-[#FF69B4]/70
        hover:shadow-[#FF69B4]/40 hover:shadow-xl
        hover:scale-105
        active:scale-95
        group
        overflow-hidden
        ${className}
      `}
    >
      {/* Soft gradient surface }
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 via-white/10 to-transparent pointer-events-none" />

      {/* Shine sweep }
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

      {/* Flying cursor orbit animation }
      <div className="
          absolute pointer-events-none
          h-6 w-6
          rounded-full
          bg-[#FF69B4]/80
          blur-[4px]
          animate-[orbit_2.2s_linear_infinite]
        " />

      {/* Button text }
      <span className="relative z-10 text-white font-semibold drop-shadow-sm">
        {children}
      </span>

      {/* Keyframes }
      <style>{`
        @keyframes orbit {
          0%   { transform: rotate(0deg) translateX(60px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(60px) rotate(-360deg); }
        }
      `}</style>
    </button>
  );
}
-->*/
<script type="text/babel">
function GlassyButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        height: "40px",          // same as input
        minWidth: "80px",        // roughly same as original submit
        padding: "0 12px",       // smaller padding to match original spacing
        borderRadius: "5px",
        border: "2px solid rgba(255,255,255,0.3)",
        background: "teal",
        color: "white",
        fontSize: "16px",
        fontWeight: "bold",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 12px rgba(0,128,128,0.5)",
        transition: "all 0.3s ease"
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "scale(1.05)";
        e.currentTarget.style.boxShadow = "0 0 20px rgba(0,128,128,0.7)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,128,128,0.5)";
      }}
    >
      {children}
      <span
        style={{
          position: "absolute",
          top: "-6px",
          left: "-6px",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: "white",
          opacity: 0.7,
          animation: "fly 2s linear infinite"
        }}
      />
      <style>{`
        @keyframes fly {
          0% { transform: translate(0,0); opacity:0.7; }
          25% { transform: translate(120%,50%); opacity:0.3; }
          50% { transform: translate(100%,120%); opacity:0.7; }
          75% { transform: translate(-50%,100%); opacity:0.3; }
          100% { transform: translate(0,0); opacity:0.7; }
        }
      `}</style>
    </button>
  );
}

function App() {
  const handleSubmit = () => { alert("Connected!"); };
  return <GlassyButton onClick={handleSubmit}>Connect</GlassyButton>;
}

ReactDOM.createRoot(document.getElementById("glassy-button-container")).render(<App />);
</script>
