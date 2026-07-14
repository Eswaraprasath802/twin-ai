"use client";
/**
 * TWIN AI — Combined Landing Page
 * Shows both Next.js and Flask options
 */
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { createParticleStyles } from "@/lib/deterministic";

const PARTICLE_STYLES = createParticleStyles(40);

function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {PARTICLE_STYLES.map((style, i) => (
        <div key={i} className="absolute rounded-full" style={style} />
      ))}
    </div>
  );
}

function AnimatedEarth() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = 400, h = 400;
    canvas.width = w;
    canvas.height = h;
    const cx = w / 2, cy = h / 2, r = 150;
    let angle = 0;

    const indiaCoords = [
      [77, 28.6], [72.8, 19], [80.2, 13], [88.4, 22.6], [75.8, 26.9],
      [78.5, 17.4], [76.6, 12], [85.8, 20.3], [73.9, 15.5], [82, 25],
    ];

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      const glow = ctx.createRadialGradient(cx, cy, r - 20, cx, cy, r + 60);
      glow.addColorStop(0, "rgba(0,212,255,0.08)");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(cx - 30, cy - 30, 10, cx, cy, r);
      grad.addColorStop(0, "#0a2a4a");
      grad.addColorStop(1, "#020a14");
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.strokeStyle = "rgba(0,212,255,0.06)";
      ctx.lineWidth = 0.5;
      for (let lat = -80; lat <= 80; lat += 20) {
        const y = cy + r * Math.sin((lat * Math.PI) / 180);
        const latR = r * Math.cos((lat * Math.PI) / 180);
        if (latR > 0) {
          ctx.beginPath();
          ctx.ellipse(cx, y, latR, latR * 0.15, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      ctx.fillStyle = "#00ff88";
      ctx.shadowColor = "#00ff88";
      ctx.shadowBlur = 6;
      indiaCoords.forEach(([lon, lat]) => {
        const rotLon = (lon - 78 + angle) * Math.PI / 180;
        const latRad = lat * Math.PI / 180;
        const x = cx + r * Math.cos(latRad) * Math.sin(rotLon);
        const y = cy - r * Math.sin(latRad);
        const z = Math.cos(latRad) * Math.cos(rotLon);
        if (z > 0) {
          ctx.beginPath();
          ctx.arc(x, y, 2 + z * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.shadowBlur = 0;

      ctx.beginPath();
      ctx.arc(cx, cy, r + 2, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0,212,255,0.15)";
      ctx.lineWidth = 2;
      ctx.stroke();

      angle += 0.1;
      frameId = requestAnimationFrame(draw);
    }

    let frameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-80 h-80" />;
}

export default function HomePage() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setLoaded(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] relative overflow-hidden">
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
        }
        @keyframes holoShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .holo-text {
          background: linear-gradient(90deg, #00d4ff, #00ff88, #8b5cf6, #00d4ff);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: holoShimmer 4s linear infinite;
        }
        .grid-bg {
          background-image: linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .glass-card {
          background: linear-gradient(135deg, rgba(15,23,42,0.8), rgba(15,23,42,0.4));
          backdrop-filter: blur(16px);
          border: 1px solid rgba(0,212,255,0.12);
          border-radius: 12px;
        }
        .btn-cyber {
          padding: 12px 28px;
          background: linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,212,255,0.05));
          border: 1px solid rgba(0,212,255,0.3);
          border-radius: 8px;
          color: #00d4ff;
          font-weight: 600;
          transition: all 0.3s;
        }
        .btn-cyber:hover {
          background: linear-gradient(135deg, rgba(0,212,255,0.25), rgba(0,212,255,0.1));
          box-shadow: 0 0 20px rgba(0,212,255,0.2);
        }
        .btn-green {
          background: linear-gradient(135deg, rgba(0,255,136,0.15), rgba(0,255,136,0.05));
          border-color: rgba(0,255,136,0.3);
          color: #00ff88;
        }
        .btn-green:hover {
          background: linear-gradient(135deg, rgba(0,255,136,0.25), rgba(0,255,136,0.1));
          box-shadow: 0 0 20px rgba(0,255,136,0.2);
        }
      `}</style>
      
      <div className="absolute inset-0 grid-bg" />
      <Particles />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#00d4ff] rounded-full blur-[150px] opacity-[0.05]" />

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <div className={`mb-6 transition-all duration-1000 ${loaded ? "opacity-100" : "opacity-0"}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00d4ff]/20 bg-[#00d4ff]/5 text-xs text-[#00d4ff]">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            ISRO + IMD + ICAR Integrated Platform
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 max-w-5xl">
          <div className={`text-center lg:text-left transition-all duration-1000 delay-200 ${loaded ? "opacity-100" : "opacity-0"}`}>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
              <span className="holo-text">TWIN</span>
              <span className="text-slate-300 ml-3">AI</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-md mb-2">
              AI-Powered Digital Twin of India&apos;s Climate
            </p>
            <p className="text-sm text-slate-500 max-w-md mb-8">
              Monitor, predict, simulate & recommend actions for climate,
              agriculture, disaster management and government planning.
            </p>

            <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8">
              <Link href="/dashboard" className="btn-cyber text-sm">
                ◆ Next.js Dashboard
              </Link>
              <Link href="/twin-ai" className="btn-cyber btn-green text-sm">
                🤖 Ask Twin AI
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center lg:text-left">
              {[
                { label: "States", value: "28" },
                { label: "Districts", value: "766" },
                { label: "AI Models", value: "23" },
                { label: "Satellites", value: "14" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-2xl font-bold text-[#00d4ff]">{stat.value}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={`transition-all duration-1000 delay-500 ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
            <AnimatedEarth />
          </div>
        </div>

        <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mt-12 w-full transition-all duration-1000 delay-700 ${loaded ? "opacity-100" : "opacity-0"}`}>
          {[
            { icon: "🌍", title: "3D Digital Twin", desc: "Live 3D India globe visualization" },
            { icon: "🤖", title: "AI Predictions", desc: "ML-powered climate forecasts" },
            { icon: "⚡", title: "Smart Alerts", desc: "AI-generated recommendations" },
            { icon: "🔬", title: "Simulation", desc: "Climate scenario modeling" },
          ].map((f, i) => (
            <div key={i} className="glass-card p-4 text-center">
              <div className="text-2xl mb-2">{f.icon}</div>
              <div className="text-xs font-semibold text-slate-200">{f.title}</div>
              <div className="text-[10px] text-slate-500">{f.desc}</div>
            </div>
          ))}
        </div>

        <div className={`grid grid-cols-3 md:grid-cols-6 gap-2 max-w-3xl mt-8 w-full transition-all duration-1000 delay-1000 ${loaded ? "opacity-100" : "opacity-0"}`}>
          {[
            { icon: "🌡", label: "Climate", href: "/climate" },
            { icon: "🌾", label: "Agriculture", href: "/agriculture" },
            { icon: "🌊", label: "Disaster", href: "/disaster" },
            { icon: "🏛", label: "Government", href: "/government" },
            { icon: "📊", label: "Analytics", href: "/analytics" },
            { icon: "👤", label: "Citizen", href: "/citizen" },
          ].map((m, i) => (
            <Link key={i} href={m.href} className="glass-card p-3 text-center hover:border-[#00d4ff]/30 transition-all group">
              <div className="text-xl group-hover:scale-110 transition-transform">{m.icon}</div>
              <div className="text-[10px] text-slate-400 group-hover:text-[#00d4ff]">{m.label}</div>
            </Link>
          ))}
        </div>

        <div className="mt-12 glass-card p-6 max-w-xl w-full">
          <h3 className="text-sm font-semibold text-slate-300 mb-3 text-center">🐍 Flask Backend Available</h3>
          <p className="text-xs text-slate-500 text-center mb-4">
            This application includes both Next.js and Flask implementations. 
            The Flask version runs on port 5000 with full-featured templates.
          </p>
          <div className="text-center">
            <code className="text-xs bg-slate-800/50 px-3 py-1.5 rounded text-[#00d4ff]">
              python3 flask_app/app.py
            </code>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-slate-600">
          <p>TWIN AI — Digital Twin Platform for India&apos;s Climate Intelligence</p>
          <p className="mt-1">Powered by ISRO • IMD • ICAR • Ministry of Agriculture</p>
        </div>
      </main>
    </div>
  );
}
