"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { cn } from "@/lib/utils";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// ISO 3166-1 numeric codes (zero-padded to 3 digits, matching world-atlas strings)
const LATAM_IDS = new Set([
  "484", // México
  "320", // Guatemala
  "084", // Belice
  "340", // Honduras
  "222", // El Salvador
  "558", // Nicaragua
  "188", // Costa Rica
  "591", // Panamá
  "192", // Cuba
  "214", // República Dominicana
  "630", // Puerto Rico
  "170", // Colombia
  "862", // Venezuela
  "328", // Guyana
  "254", // Guayana Francesa
  "218", // Ecuador
  "604", // Perú
  "076", // Brasil
  "068", // Bolivia
  "152", // Chile
  "032", // Argentina
  "858", // Uruguay
  "600", // Paraguay
]);

// The 6 active markets
const ACTIVE_IDS = new Set(["484", "076", "032", "170", "152", "604"]);

interface MarkerData {
  id: string;
  coords: [number, number]; // [longitude, latitude]
  label: string;
  regulator: string;
  platform: string;
  stablecoin: string;
}

const MARKERS: MarkerData[] = [
  { id: "484", coords: [-102, 23],  label: "México",    regulator: "CNBV", platform: "Arkangeles",   stablecoin: "MXNB" },
  { id: "170", coords: [-74, 4],    label: "Colombia",  regulator: "SFC",  platform: "a2censo",      stablecoin: "COPW" },
  { id: "076", coords: [-52, -14],  label: "Brasil",    regulator: "CVM",  platform: "BEE4",         stablecoin: "BRZ"  },
  { id: "604", coords: [-76, -10],  label: "Perú",      regulator: "SMV",  platform: "Crowdium",     stablecoin: "PENW" },
  { id: "152", coords: [-71, -35],  label: "Chile",     regulator: "CMF",  platform: "Broota",       stablecoin: "CLPW" },
  { id: "032", coords: [-65, -34],  label: "Argentina", regulator: "CNV",  platform: "100 Ventures", stablecoin: "ARSW" },
];

export function LatamMap({ className }: { className?: string }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const active = MARKERS.find((m) => m.id === hovered);

  return (
    <div className={cn("relative", className)}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [-70, -15], scale: 280 }}
        width={400}
        height={500}
        style={{ width: "100%", maxWidth: "360px" }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }: { geographies: any[] }) =>
            geographies
              .filter((geo: any) => LATAM_IDS.has(String(geo.id)))
              .map((geo: any) => {
                const isActive = ACTIVE_IDS.has(String(geo.id));
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => isActive && setHovered(String(geo.id))}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      default: {
                        fill: isActive
                          ? "hsl(156 60% 15% / 0.25)"
                          : "hsl(44 22% 78%)",
                        stroke: "hsl(44 22% 68%)",
                        strokeWidth: 0.6,
                        outline: "none",
                      },
                      hover: {
                        fill: isActive
                          ? "hsl(156 60% 15% / 0.45)"
                          : "hsl(44 22% 78%)",
                        stroke: "hsl(44 22% 68%)",
                        strokeWidth: 0.6,
                        outline: "none",
                        cursor: isActive ? "pointer" : "default",
                      },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
          }
        </Geographies>

        {MARKERS.map((m) => (
          <Marker
            key={m.id}
            coordinates={m.coords}
            onMouseEnter={() => setHovered(m.id)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Outer pulse ring */}
            <circle
              r={hovered === m.id ? 14 : 10}
              fill="hsl(28 58% 41%)"
              fillOpacity={0.15}
              style={{ transition: "r 150ms ease" }}
            />
            {/* Inner dot */}
            <circle
              r={hovered === m.id ? 7 : 5}
              fill="hsl(28 58% 41%)"
              fillOpacity={hovered === m.id ? 1 : 0.8}
              style={{ transition: "r 150ms ease" }}
            />
            {/* Label */}
            <text
              textAnchor="middle"
              y={-14}
              style={{
                fontSize: "8px",
                fontFamily: "var(--font-inter)",
                fontWeight: 600,
                fill: "hsl(24 25% 9%)",
                pointerEvents: "none",
                opacity: hovered === m.id ? 1 : 0,
                transition: "opacity 150ms ease",
              }}
            >
              {m.label}
            </text>
          </Marker>
        ))}
      </ComposableMap>

      {/* Tooltip */}
      {active && (
        <div className="absolute left-full top-1/2 ml-4 -translate-y-1/2 w-52 rounded-lg border border-border bg-surface-elevated shadow-sm p-3 pointer-events-none z-10">
          <p className="font-display text-sm font-semibold text-foreground mb-2">
            {active.label}
          </p>
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
