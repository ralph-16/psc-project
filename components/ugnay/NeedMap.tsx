"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import "leaflet/dist/leaflet.css";
import { GeoJSON, MapContainer, TileLayer, Tooltip, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { Feature, FeatureCollection } from "geojson";
import { MapPin } from "lucide-react";
import { SeverityDot } from "./StatusBadge";
import {
  SEVERITY_ACTION,
  campaigns,
  type Severity,
} from "@/lib/mock/campaigns";

type MuniProps = {
  municipality: string;
  province: string;
  lat: number;
  lon: number;
};

const SEVERITIES: Severity[] = ["Critical", "High", "Elevated", "Moderate"];

const SEVERITY_RANK: Record<Severity, number> = {
  Critical: 0,
  High: 1,
  Elevated: 2,
  Moderate: 3,
};

const SEVERITY_COLOR: Record<Severity, string> = {
  Critical: "#c8102e",
  High: "#d97706",
  Elevated: "#b57e12",
  Moderate: "#0b4a9c",
};

/** Active (mappable) campaigns grouped by municipality name. */
function useCampaignsByMuni() {
  return useMemo(() => {
    const map = new Map<string, typeof campaigns>();
    for (const c of campaigns) {
      if (c.status === "Closed" || c.status === "Draft") continue;
      const list = map.get(c.municipality) ?? [];
      list.push(c);
      map.set(c.municipality, list);
    }
    return map;
  }, []);
}

function worstSeverity(list: typeof campaigns): Severity {
  let worst: Severity = "Moderate";
  for (const c of list) {
    if (SEVERITY_RANK[c.severity] < SEVERITY_RANK[worst]) worst = c.severity;
  }
  return worst;
}

function FitBounds({ geo }: { geo: FeatureCollection | null }) {
  const map = useMap();
  useEffect(() => {
    if (!geo || geo.features.length === 0) return;
    const bounds = L.geoJSON(geo as never).getBounds();
    if (bounds.isValid()) map.fitBounds(bounds.pad(0.25));
  }, [geo, map]);
  return null;
}

/** Draggable satellite need map with municipality-level tracing. */
export default function NeedMap() {
  const [geo, setGeo] = useState<FeatureCollection | null>(null);
  const [error, setError] = useState<string | null>(null);
  const byMuni = useCampaignsByMuni();

  useEffect(() => {
    let cancelled = false;
    fetch("/geo/municipalities.geojson")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: FeatureCollection) => {
        if (!cancelled) setGeo(data);
      })
      .catch(() => {
        if (!cancelled)
          setError("Map boundaries failed to load. See campaigns instead.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="ugnay-card p-4 sm:p-5">
      <h3 className="font-display text-base font-bold text-[#1a2333]">
        Needs map — Region 3 watch areas
      </h3>
      <p className="text-sm text-[#6b7280]">
        Satellite view. Drag to explore, use +/− to zoom.
      </p>

      <div className="mt-3 overflow-hidden rounded-[12px]">
        {error ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center gap-2 bg-[#eef1f5] p-6 text-center">
            <p className="text-sm font-semibold text-[#1a2333]">{error}</p>
            <Link
              href="/campaigns"
              className="font-semibold text-[#084989] hover:underline"
            >
              View all campaigns
            </Link>
          </div>
        ) : !geo ? (
          <div
            aria-label="Loading map"
            className="h-[380px] w-full animate-pulse bg-[#eef1f5] sm:h-[480px]"
          />
        ) : (
          <MapContainer
            center={[15.0, 120.82]}
            zoom={9}
            scrollWheelZoom={false}
            doubleClickZoom={false}
            dragging
            touchZoom
            zoomControl
            minZoom={8}
            maxZoom={16}
            maxBounds={[
              [13.4, 119.4],
              [16.6, 122.1],
            ]}
            maxBoundsViscosity={1.0}
            className="z-0 h-[380px] w-full sm:h-[480px]"
          >
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Imagery &copy; Esri, Maxar, Earthstar Geographics"
            />
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
              attribution="Places &copy; Esri | Boundaries &copy; OpenStreetMap contributors (ODbL)"
            />
            <FitBounds geo={geo} />
            {geo.features.map((f, i) => {
              const feature = f as Feature;
              const props = (feature.properties ?? {}) as Partial<MuniProps>;
              const muni = props.municipality ?? `Area ${i + 1}`;
              const list = byMuni.get(muni) ?? [];
              // Unmapped polygons (none expected) still render, neutral style.
              const severity = list.length > 0 ? worstSeverity(list) : null;
              const color = severity ? SEVERITY_COLOR[severity] : "#6b7280";
              const key = `${muni}-${props.province ?? i}`;
              return (
                <GeoJSON
                  key={key}
                  data={feature}
                  style={() => ({
                    color,
                    weight: 2.5,
                    opacity: 1,
                    fillColor: color,
                    fillOpacity: list.length > 0 ? 0.42 : 0.15,
                  })}
                >
                  <Tooltip
                    permanent
                    direction="center"
                    className="municipality-label"
                    opacity={1}
                  >
                    {muni}
                  </Tooltip>
                  <Popup>
                    <div className="min-w-[200px]">
                      <p className="text-sm font-bold text-[#1a2333]">
                        {muni}
                        {props.province ? `, ${props.province}` : ""}
                      </p>
                      {severity ? (
                        <p className="mt-0.5 text-xs font-semibold" style={{ color }}>
                          {severity} — {SEVERITY_ACTION[severity]}
                        </p>
                      ) : (
                        <p className="mt-0.5 text-xs text-[#6b7280]">Monitoring</p>
                      )}
                      {list.length > 0 ? (
                        <ul className="mt-2 space-y-1.5">
                          {list.map((c) => (
                            <li key={c.id} className="text-[13px]">
                              <Link
                                href={`/campaigns/${c.slug}`}
                                className="font-semibold text-[#084989] hover:underline"
                              >
                                {c.title}
                              </Link>
                              <span className="block text-xs text-[#6b7280]">
                                {c.families.toLocaleString("en-PH")} households ·{" "}
                                {c.progress}% secured
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-1 text-xs text-[#6b7280]">
                          No active campaign here right now.
                        </p>
                      )}
                    </div>
                  </Popup>
                </GeoJSON>
              );
            })}
          </MapContainer>
        )}
      </div>

      <div
        aria-label="Demand severity legend"
        className="mt-3 rounded-[12px] border border-[#e5e7eb] bg-white px-4 py-3.5"
      >
        <p className="text-[13px] font-semibold text-[#1a2333]">Demand severity</p>
        <ul className="mt-1.5 grid gap-x-6 sm:grid-cols-2">
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
          Tap a traced municipality to see its campaigns
        </p>
        <p className="mt-1 text-[11.5px] leading-snug text-[#6b7280]">
          Satellite: Esri World Imagery (Maxar, Earthstar Geographics). Municipality
          boundaries: © OpenStreetMap contributors (ODbL) via Nominatim.
        </p>
      </div>
    </div>
  );
}
