import React from 'react';

interface RadarChartProps {
  skills: { name: string; score: number }[]; // score 0 to 100
  size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({ skills, size = 260 }) => {
  const center = size / 2;
  const radius = (size / 2) * 0.72;
  const count = Math.max(skills.length, 3);

  // Helper to calculate coordinates for angle
  const getCoordinates = (index: number, valRatio: number) => {
    const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
    const r = radius * valRatio;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Generate web rings (25%, 50%, 75%, 100%)
  const rings = [0.25, 0.5, 0.75, 1.0];

  const dataPolygonPoints = skills
    .map((s, i) => {
      const pt = getCoordinates(i, Math.min(Math.max(s.score / 100, 0.15), 1.0));
      return `${pt.x},${pt.y}`;
    })
    .join(' ');

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Background Grid Rings */}
        {rings.map((ring, ringIdx) => {
          const ringPoints = Array.from({ length: count })
            .map((_, i) => {
              const pt = getCoordinates(i, ring);
              return `${pt.x},${pt.y}`;
            })
            .join(' ');
          return (
            <polygon
              key={ringIdx}
              points={ringPoints}
              className="stroke-slate-200 fill-none"
              strokeWidth="1"
              strokeDasharray={ring === 1.0 ? undefined : '3 3'}
            />
          );
        })}

        {/* Spoke Axes */}
        {skills.map((_, i) => {
          const outerPt = getCoordinates(i, 1.0);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={outerPt.x}
              y2={outerPt.y}
              className="stroke-slate-200"
              strokeWidth="1"
            />
          );
        })}

        {/* Filled Data Polygon */}
        <polygon
          points={dataPolygonPoints}
          className="fill-teal-500/20 stroke-teal-600 drop-shadow-sm transition-all duration-500"
          strokeWidth="2.5"
        />

        {/* Data points */}
        {skills.map((s, i) => {
          const pt = getCoordinates(i, Math.min(Math.max(s.score / 100, 0.15), 1.0));
          return (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r="4"
              className="fill-teal-700 stroke-white"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Labels */}
        {skills.map((s, i) => {
          const labelPt = getCoordinates(i, 1.22);
          return (
            <text
              key={i}
              x={labelPt.x}
              y={labelPt.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-slate-700 text-[10px] font-semibold tracking-tight"
            >
              {s.name.length > 18 ? `${s.name.substring(0, 16)}...` : s.name}
            </text>
          );
        })}
      </svg>
    </div>
  );
};
