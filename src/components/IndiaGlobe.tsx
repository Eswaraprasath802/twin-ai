"use client";

import { useEffect, useRef } from "react";

type GeoPoint = [longitude: number, latitude: number];

type IndiaGlobeProps = {
  className?: string;
  showHud?: boolean;
  layers?: {
    terrain?: boolean;
    buildings?: boolean;
    weather?: boolean;
  };
};

const LAND_MASSES: Array<{ points: GeoPoint[]; color: string }> = [
  { points: [[-168, 70], [-150, 72], [-130, 62], [-124, 50], [-118, 42], [-122, 32], [-112, 25], [-101, 20], [-90, 18], [-83, 24], [-81, 33], [-74, 42], [-66, 49], [-72, 58], [-95, 64], [-122, 70]], color: "#179d82" },
  { points: [[-81, 12], [-75, 5], [-72, -7], [-65, -17], [-62, -31], [-58, -43], [-52, -54], [-46, -51], [-40, -35], [-37, -15], [-45, -3], [-55, 6], [-67, 10]], color: "#18a36f" },
  { points: [[-10, 36], [0, 44], [13, 52], [28, 58], [41, 54], [45, 43], [34, 36], [22, 37], [11, 42], [2, 40]], color: "#4ac36f" },
  { points: [[-17, 35], [-6, 36], [8, 33], [18, 23], [24, 10], [29, -5], [23, -22], [15, -34], [5, -35], [-3, -18], [-9, 2], [-16, 19]], color: "#17a782" },
  { points: [[35, 32], [47, 34], [58, 29], [57, 19], [48, 13], [40, 17]], color: "#3bb875" },
  { points: [[46, 54], [65, 60], [91, 61], [113, 54], [132, 50], [147, 55], [157, 48], [148, 36], [130, 31], [113, 24], [94, 29], [77, 35], [61, 38], [49, 41]], color: "#43bd72" },
  { points: [[94, 29], [104, 22], [110, 13], [107, 3], [101, 1], [96, 8], [91, 20]], color: "#24ad75" },
  { points: [[110, -11], [123, -16], [135, -12], [145, -20], [151, -32], [146, -40], [132, -43], [117, -36], [112, -25]], color: "#199878" },
  { points: [[130, 33], [137, 37], [143, 43], [145, 37], [140, 32], [135, 30]], color: "#62d47e" },
  { points: [[-54, 60], [-41, 62], [-30, 70], [-35, 80], [-48, 82], [-58, 73]], color: "#6bc990" },
];

const INDIA_OUTLINE: GeoPoint[] = [
  [68, 23], [69, 25], [70, 27], [72, 28], [73, 31], [75, 32], [77, 35],
  [79, 34], [80, 31], [82, 30], [84, 28], [86, 27], [88, 28], [89, 27],
  [91, 27], [92, 26], [91, 24], [89, 23], [88, 21], [86, 20], [84, 19],
  [83, 17], [82, 16], [81, 13], [80, 10], [78, 8], [77, 9], [76, 12],
  [75, 15], [73, 17], [72, 20], [70, 21],
];

const TERRAIN_RIDGES: GeoPoint[][] = [
  [[73, 30], [76, 31], [79, 30], [82, 29], [85, 28], [88, 27]],
  [[72, 25], [75, 24], [78, 25], [81, 24], [84, 23], [87, 22]],
  [[75, 19], [78, 20], [81, 19], [84, 20]],
];

const CITY_POINTS: Array<[longitude: number, latitude: number, size: number, name: string]> = [
  [77.2, 28.6, 4, "Delhi"], [72.8, 19, 3, "Mumbai"], [77.6, 13, 3, "Bengaluru"],
  [88.4, 22.6, 3, "Kolkata"], [78.5, 17.4, 2, "Hyderabad"], [80.3, 13.1, 2, "Chennai"],
  [85.8, 20.3, 2, "Bhubaneswar"], [73.9, 15.5, 2, "Goa"], [76.8, 30.7, 2, "Chandigarh"],
  [91.7, 26.1, 2, "Guwahati"], [75.8, 26.9, 2, "Jaipur"], [82, 25, 2, "Varanasi"],
];

const WEATHER_CELLS: Array<[longitude: number, latitude: number, radius: number, color: string]> = [
  [73, 19, 20, "rgba(0, 205, 255, 0.42)"], [80, 16, 24, "rgba(38, 130, 255, 0.34)"],
  [87, 23, 17, "rgba(255, 180, 0, 0.42)"], [77, 28, 15, "rgba(255, 104, 58, 0.32)"],
  [90, 20, 18, "rgba(100, 229, 255, 0.34)"],
];

export default function IndiaGlobe({ className = "", showHud = true, layers }: IndiaGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 520;
    const height = 520;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 178;
    let angle = 0;
    let frameId = 0;

    const project = (longitude: number, latitude: number) => {
      const longitudeRadians = ((longitude - 78) * Math.PI) / 180 + angle;
      const latitudeRadians = (latitude * Math.PI) / 180;
      const cosLatitude = Math.cos(latitudeRadians);
      return {
        x: centerX + radius * cosLatitude * Math.sin(longitudeRadians),
        y: centerY - radius * Math.sin(latitudeRadians),
        z: cosLatitude * Math.cos(longitudeRadians),
      };
    };

    const drawPath = (points: GeoPoint[], closePath = false) => {
      const projected = points.map(([longitude, latitude]) => project(longitude, latitude));
      if (projected.some(point => point.z <= 0.02)) return false;

      ctx.beginPath();
      projected.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      if (closePath) ctx.closePath();
      return true;
    };

    const drawGrid = () => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.clip();
      ctx.strokeStyle = "rgba(159, 238, 255, 0.15)";
      ctx.lineWidth = 0.8;

      for (let latitude = -60; latitude <= 60; latitude += 20) {
        ctx.beginPath();
        let drawing = false;
        for (let longitude = -180; longitude <= 180; longitude += 3) {
          const point = project(longitude, latitude);
          if (point.z >= -0.03) {
            if (!drawing) ctx.moveTo(point.x, point.y);
            else ctx.lineTo(point.x, point.y);
            drawing = true;
          } else {
            drawing = false;
          }
        }
        ctx.stroke();
      }

      for (let longitude = -160; longitude <= 160; longitude += 20) {
        ctx.beginPath();
        let drawing = false;
        for (let latitude = -85; latitude <= 85; latitude += 3) {
          const point = project(longitude, latitude);
          if (point.z >= -0.03) {
            if (!drawing) ctx.moveTo(point.x, point.y);
            else ctx.lineTo(point.x, point.y);
            drawing = true;
          } else {
            drawing = false;
          }
        }
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawLandMasses = () => {
      LAND_MASSES.forEach(({ points, color }) => {
        if (!drawPath(points, true)) return;
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.78;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = "rgba(194, 255, 222, 0.42)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      if (drawPath(INDIA_OUTLINE, true)) {
        const land = ctx.createLinearGradient(centerX - 90, centerY - 75, centerX + 100, centerY + 110);
        land.addColorStop(0, "rgba(118, 255, 166, 0.96)");
        land.addColorStop(0.55, "rgba(25, 190, 125, 0.92)");
        land.addColorStop(1, "rgba(8, 125, 178, 0.9)");
        ctx.fillStyle = land;
        ctx.shadowColor = "#00ffad";
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(218, 255, 233, 0.95)";
        ctx.lineWidth = 1.35;
        ctx.stroke();
      }
    };

    const drawTerrain = () => {
      ctx.strokeStyle = "rgba(227, 255, 202, 0.64)";
      ctx.lineWidth = 1;
      TERRAIN_RIDGES.forEach(ridge => {
        if (drawPath(ridge)) ctx.stroke();
      });
    };

    const drawWeather = () => {
      WEATHER_CELLS.forEach(([longitude, latitude, cellRadius, color], index) => {
        const point = project(longitude, latitude);
        if (point.z <= 0.08) return;
        const animatedRadius = cellRadius * point.z * (0.82 + Math.sin(angle * 4 + index) * 0.12);
        const weather = ctx.createRadialGradient(point.x, point.y, 2, point.x, point.y, animatedRadius);
        weather.addColorStop(0, color);
        weather.addColorStop(0.55, color.replace(/0\.\d+\)$/, "0.16)"));
        weather.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = weather;
        ctx.beginPath();
        ctx.arc(point.x, point.y, animatedRadius, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawCitiesAndBuildings = () => {
      CITY_POINTS.forEach(([longitude, latitude, size]) => {
        const point = project(longitude, latitude);
        if (point.z <= 0.1) return;
        const buildingWidth = Math.max(1.5, size * point.z * 0.9);
        const buildingHeight = Math.max(3, size * point.z * 3.3);
        ctx.fillStyle = "rgba(207, 255, 244, 0.9)";
        ctx.shadowColor = "#00ffc6";
        ctx.shadowBlur = 10;
        ctx.fillRect(point.x - buildingWidth / 2, point.y - buildingHeight, buildingWidth, buildingHeight);
        ctx.fillStyle = "#e1fffb";
        ctx.beginPath();
        ctx.arc(point.x, point.y - buildingHeight, buildingWidth * 0.75, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const halo = ctx.createRadialGradient(centerX, centerY, radius - 30, centerX, centerY, radius + 108);
      halo.addColorStop(0, "rgba(0, 212, 255, 0.18)");
      halo.addColorStop(0.55, "rgba(0, 122, 255, 0.08)");
      halo.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, width, height);

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      const ocean = ctx.createRadialGradient(centerX - 74, centerY - 84, 12, centerX, centerY, radius);
      ocean.addColorStop(0, "#3399c6");
      ocean.addColorStop(0.43, "#0d5b90");
      ocean.addColorStop(0.78, "#063056");
      ocean.addColorStop(1, "#01152d");
      ctx.fillStyle = ocean;
      ctx.shadowColor = "rgba(0, 212, 255, 0.62)";
      ctx.shadowBlur = 38;
      ctx.fill();
      ctx.shadowBlur = 0;

      drawGrid();
      drawLandMasses();
      if (layers?.terrain !== false) drawTerrain();
      if (layers?.weather !== false) drawWeather();
      if (layers?.buildings !== false) drawCitiesAndBuildings();

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 3, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(148, 238, 255, 0.72)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      angle += 0.0032;
      frameId = requestAnimationFrame(draw);
    };

    frameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameId);
  }, [layers?.buildings, layers?.terrain, layers?.weather]);

  return (
    <div className={`earth-stage ${className}`.trim()} aria-label="Animated three-dimensional digital twin globe of India" role="img">
      <div className="earth-orbit earth-orbit-primary" />
      <div className="earth-orbit earth-orbit-secondary" />
      <div className="earth-satellite" aria-hidden="true" />
      {showHud && (
        <>
          <div className="earth-hud earth-hud-top"><span className="earth-hud-dot" />LIVE SIGNAL</div>
          <div className="earth-hud earth-hud-bottom">INDIA / 23.6° N</div>
        </>
      )}
      <canvas ref={canvasRef} className="earth-canvas" />
    </div>
  );
}
