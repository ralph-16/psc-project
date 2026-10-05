import { MapPin } from "lucide-react";
import { SeverityDot } from "./StatusBadge";
import type { Severity } from "@/lib/mock/campaigns";
import { SEVERITY_ACTION } from "@/lib/mock/campaigns";

interface MapArea {
  name: string;
  severity: Severity;
  /** blob path within a 400x300 viewBox */
  d: string;
  /** label position */
  x: number;
  y: number;
}

const SEVERITIES: Severity[] = ["Critical", "High", "Elevated", "Moderate"];

/** Stylized placeholder map of monitored Bulacan municipalities. Not geographic. */
const AREAS: MapArea[] = [
  { name: "Hagonoy", severity: "Critical", d: "M40,90 C70,40 150,45 175,85 C200,125 165,190 110,195 C60,200 20,150 40,90 Z", x: 80, y: 125 },
  { name: "Calumpit", severity: "High", d: "M190,60 C240,45 300,60 305,105 C310,150 260,175 220,160 C185,147 165,95 190,60 Z", x: 238, y: 115 },
  { name: "Bulakan", severity: "Elevated", d: "M120,205 C160,195 210,200 225,230 C240,262 195,290 150,285 C110,280 85,230 120,205 Z", x: 158, y: 248 },
  { name: "Santa Maria", severity: "Moderate", d: "M250,190 C290,175 345,185 350,220 C355,255 315,280 275,270 C240,262 225,210 250,190 Z", x: 292, y: 232 },
];

const BLOB_FILL: Record<Severity, string> = {
  Critical: "rgb(200 16 46 / 0.18)",
  High: "rgb(217 119 6 / 0.20)",
  Elevated: "rgb(246 172 33 / 0.25)",
  Moderate: "rgb(11 74 156 / 0.15)",
};

const BLOB_STROKE: Record<Severity, string> = {
  Critical: "#c8102e",
  High: "#d97706",
  Elevated: "#b57e12",
  Moderate: "#0b4a9c",
};

export default function NeedMapPlaceholder() {
  return (
    <div className="ugnay-card p-4 sm:p-5">
      <h3 className="font-display text-base font-bold text-[#1a2333]">
        Needs map — Bulacan watch areas
      </h3>
      <p className="text-sm text-[#6b7280]">Simplified view, not to scale.</p>
      <div className="relative mt-3 overflow-hidden rounded-[12px]">
        <svg
          viewBox="0 0 400 300"
          role="img"
          aria-label="Placeholder map of Hagonoy, Calumpit, Bulakan and Santa Maria"
          className="block h-64 w-full sm:h-80"
          preserveAspectRatio="xMidYMid slice"
        >
          <rect x="0" y="0" width="400" height="300" fill="#eef1f5" />
          {AREAS.map((area) => (
            <g key={area.name}>
              <path
                d={area.d}
                fill={BLOB_FILL[area.severity]}
                stroke={BLOB_STROKE[area.severity]}
                strokeWidth="2"
                strokeDasharray="6 4"
              />
              <text
                x={area.x}
                y={area.y}
                textAnchor="middle"
                fontSize="13"
                fontWeight="700"
                fill="#1a2333"
                fontFamily="Public Sans, sans-serif"
              >
                {area.name}
              </text>
            </g>
          ))}
        </svg>
        <div
          aria-label="Demand severity legend"
          className="absolute bottom-3 left-3 w-[210px] rounded-[12px] border border-[#e5e7eb] bg-white px-4 py-3.5"
        >
          <p className="text-[13px] font-semibold text-[#1a2333]">Demand severity</p>
          <ul className="mt-1.5">
            {SEVERITIES.map((severity) => (
              <li
                key={severity}
                className="flex items-center gap-2 py-1 text-[13px] text-[#1a2333]"
              >
                <SeverityDot severity={severity} className="size-2.5" />
                <span>{severity}</span>
                <span className="ml-auto text-xs text-[#6b7280]">
                  {SEVERITY_ACTION[severity]}
                </span>
              </li>
            ))}
          </ul>
          <div className="my-1.5 h-px bg-[#e5e7eb]" />
          <p className="flex items-center gap-2 text-[12.5px] text-[#6b7280]">
            <MapPin className="size-3 shrink-0" aria-hidden />
            Evacuation / staging point
          </p>
        </div>
      </div>
    </div>
  );
}
