import type { CSSProperties } from "react";

const PARTICLE_COLORS = ["#00d4ff", "#00ff88", "#8b5cf6"] as const;

function wave(seed: number, index: number, frequency: number) {
  return (Math.sin(seed + index * frequency) + 1) / 2;
}

export function createSeries(
  length: number,
  seed: number,
  min: number,
  max: number,
  precision = 1,
) {
  const span = max - min;

  return Array.from({ length }, (_, index) => {
    const primary = wave(seed, index, 0.73);
    const secondary = wave(seed * 1.37, index, 0.19);
    const tertiary = wave(seed * 0.61, index, 1.11);
    const value = min + span * (primary * 0.55 + secondary * 0.3 + tertiary * 0.15);

    return precision === 0 ? Math.round(value) : Number(value.toFixed(precision));
  });
}

export function createParticleStyles(count: number): CSSProperties[] {
  return Array.from({ length: count }, (_, index) => {
    const size = 1 + (index % 3);
    const left = Math.round(wave(index * 0.91, index, 0.57) * 1000) / 10;
    const duration = 8 + (index % 12);
    const delay = Math.round(wave(index * 1.31, index, 0.23) * 800) / 100;

    return {
      width: `${size}px`,
      height: `${size}px`,
      background: PARTICLE_COLORS[index % PARTICLE_COLORS.length],
      left: `${left}%`,
      bottom: "-10px",
      opacity: 0,
      animation: `float ${duration}s linear ${delay}s infinite`,
    };
  });
}
