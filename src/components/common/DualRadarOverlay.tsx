import React from 'react';

interface CandidateSkillData {
  candidateName: string;
  color: string; // e.g. '#006a63' or '#1e3a8a'
  skills: { name: string; score: number }[];
}

interface DualRadarOverlayProps {
  candidatesData: CandidateSkillData[];
  size?: number;
}

export const DualRadarOverlay: React.FC<DualRadarOverlayProps> = ({ candidatesData, size = 300 }) => {
  const center = size / 2;
  const radius = (size / 2) * 0.72;

  // Combine all skill names across candidates
  const allSkillNames = Array.from(
    new Set(candidatesData.flatMap((c) => c.skills.map((s) => s.name)))
  );
  const count = Math.max(allSkillNames.length, 3);

  const getCoordinates = (index: number, valRatio: number) => {
    const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
    const r = radius * valRatio;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const rings = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Grid Rings */}
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
        {allSkillNames.map((_, i) => {
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

        {/* Render Overlapping Candidate Polygons */}
        {candidatesData.map((cand, candIdx) => {
          const points = allSkillNames
            .map((skillName, i) => {
              const matchedSkill = cand.skills.find((s) => s.name === skillName);
              const score = matchedSkill ? matchedSkill.score : 30;
              const pt = getCoordinates(i, Math.min(Math.max(score / 100, 0.15), 1.0));
              return `${pt.x},${pt.y}`;
            })
            .join(' ');

          return (
            <polygon
              key={candIdx}
              points={points}
              fill={cand.color}
              fillOpacity={0.25}
              stroke={cand.color}
              strokeWidth="2.5"
              className="transition-all duration-500"
            />
          );
        })}

        {/* Axis Labels */}
        {allSkillNames.map((name, i) => {
          const labelPt = getCoordinates(i, 1.24);
          return (
            <text
              key={i}
              x={labelPt.x}
              y={labelPt.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-slate-700 text-[10px] font-bold tracking-tight"
            >
              {name.length > 18 ? `${name.substring(0, 16)}...` : name}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs font-bold">
        {candidatesData.map((c, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }}></span>
            <span className="text-slate-800">{c.candidateName}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
