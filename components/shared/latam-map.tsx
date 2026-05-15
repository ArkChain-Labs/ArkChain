"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface CountryMarker {
  id: string;
  cx: number;
  cy: number;
  label: string;
  regulator: string;
  platform: string;
  stablecoin: string;
}

const markers: CountryMarker[] = [
  { id: "MX", cx: 120, cy: 128, label: "México", regulator: "CNBV", platform: "Arkangeles", stablecoin: "MXNB" },
  { id: "CO", cx: 175, cy: 230, label: "Colombia", regulator: "SFC", platform: "a2censo", stablecoin: "COPW" },
  { id: "BR", cx: 260, cy: 265, label: "Brasil", regulator: "CVM", platform: "BEE4", stablecoin: "BRZ" },
  { id: "PE", cx: 180, cy: 310, label: "Perú", regulator: "SMV", platform: "Crowdium", stablecoin: "PENW" },
  { id: "CL", cx: 200, cy: 390, label: "Chile", regulator: "CMF", platform: "Broota", stablecoin: "CLPW" },
  { id: "AR", cx: 220, cy: 420, label: "Argentina", regulator: "CNV", platform: "100 Ventures", stablecoin: "ARSW" },
];

export function LatamMap({ className }: { className?: string }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const active = markers.find((m) => m.id === hovered);

  return (
    <div className={cn("relative inline-flex", className)}>
      <svg
        viewBox="0 0 380 520"
        className="w-full max-w-xs"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Mexico */}
        <path
          d="M60 80 L200 80 L210 110 L185 125 L190 145 L160 158 L130 150 L100 158 L75 140 L55 115 Z"
          fill="hsl(156,60%,15%)" fillOpacity="0.15" stroke="hsl(156,60%,15%)" strokeWidth="1.2"
        />
        {/* Central America (simplified) */}
        <path
          d="M145 160 L175 158 L182 180 L165 192 L148 185 Z"
          fill="hsl(156,60%,15%)" fillOpacity="0.08" stroke="hsl(156,60%,15%)" strokeWidth="0.8"
        />
        {/* Colombia */}
        <path
          d="M145 195 L210 195 L220 225 L205 248 L175 252 L150 235 L138 215 Z"
          fill="hsl(156,60%,15%)" fillOpacity="0.15" stroke="hsl(156,60%,15%)" strokeWidth="1.2"
        />
        {/* Venezuela/Guianas (simplified) */}
        <path
          d="M210 195 L290 200 L295 230 L260 235 L220 225 Z"
          fill="hsl(156,60%,15%)" fillOpacity="0.06" stroke="hsl(156,60%,15%)" strokeWidth="0.6"
        />
        {/* Peru */}
        <path
          d="M143 250 L200 252 L205 310 L185 335 L155 330 L138 300 L130 270 Z"
          fill="hsl(156,60%,15%)" fillOpacity="0.15" stroke="hsl(156,60%,15%)" strokeWidth="1.2"
        />
        {/* Brazil */}
        <path
          d="M202 230 L295 232 L330 260 L335 320 L305 370 L265 385 L230 370 L200 350 L188 310 L200 270 Z"
          fill="hsl(156,60%,15%)" fillOpacity="0.15" stroke="hsl(156,60%,15%)" strokeWidth="1.2"
        />
        {/* Bolivia/Paraguay */}
        <path
          d="M185 335 L230 335 L245 370 L225 385 L195 378 L180 360 Z"
          fill="hsl(156,60%,15%)" fillOpacity="0.08" stroke="hsl(156,60%,15%)" strokeWidth="0.8"
        />
        {/* Chile */}
        <path
          d="M155 335 L190 340 L195 420 L185 460 L165 462 L150 440 L148 400 L152 360 Z"
          fill="hsl(156,60%,15%)" fillOpacity="0.15" stroke="hsl(156,60%,15%)" strokeWidth="1.2"
        />
        {/* Argentina */}
        <path
          d="M190 345 L265 350 L270 410 L255 450 L230 465 L200 460 L185 440 L185 400 Z"
          fill="hsl(156,60%,15%)" fillOpacity="0.15" stroke="hsl(156,60%,15%)" strokeWidth="1.2"
        />

        {/* Markers */}
        {markers.map((m) => (
          <g
            key={m.id}
            onMouseEnter={() => setHovered(m.id)}
            onMouseLeave={() => setHovered(null)}
            className="cursor-pointer"
          >
            <circle
              cx={m.cx}
              cy={m.cy}
              r={hovered === m.id ? 9 : 6}
              fill="hsl(28,58%,41%)"
              opacity={hovered === m.id ? 1 : 0.75}
              className="transition-all duration-150"
            />
            <circle
              cx={m.cx}
              cy={m.cy}
              r={hovered === m.id ? 14 : 10}
              fill="hsl(28,58%,41%)"
              opacity={0.15}
              className="transition-all duration-150"
            />
            <text
              x={m.cx + 12}
              y={m.cy + 4}
              fill="hsl(24,25%,9%)"
              fontSize="9"
              fontFamily="var(--font-inter)"
              fontWeight="500"
            >
              {m.id}
            </text>
          </g>
        ))}
      </svg>

      {/* Tooltip */}
      {active && (
        <div className="absolute left-full top-1/2 ml-4 -translate-y-1/2 w-52 rounded-lg border border-border bg-surface-elevated shadow-sm p-3 pointer-events-none z-10">
          <p className="font-display text-sm font-semibold text-foreground mb-2">{active.label}</p>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-foreground-subtle">Regulador</span>
              <span className="font-medium text-foreground">{active.regulator}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-subtle">Plataforma</span>
              <span className="font-medium text-foreground">{active.platform}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-subtle">Stablecoin</span>
              <span className="font-mono text-accent">{active.stablecoin}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
