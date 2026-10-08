"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "leaflet/dist/leaflet.css";
import { GeoJSON, MapContainer, TileLayer, ZoomControl, useMap } from "react-leaflet";
import L from "leaflet";
import type { Feature, FeatureCollection } from "geojson";
import { campaigns, type Severity } from "@/lib/mock/campaigns";

const SEVERITY_COLOR: Record<Severity, string> = {
  Critical: "#c8102e",
  High: "#d97706",
  Elevated: "#b57e12",
  Moderate: "#0b4a9c",
};

const SEVERITY_RANK: Record<Severity, number> = {
  Critical: 0,
  High: 1,
  Elevated: 2,
  Moderate: 3,
};

/** Hero framing: the Bulacan/Pampanga cluster (users can pan to the rest). */
const FOCUS = ["Hagonoy", "Calumpit", "Santa Maria", "San Fernando"];

/** Hagonoy sits just north of its label point; drop its chip below the shape. */
const TIP_DIRECTION: Record<string, "top" | "bottom"> = { Hagonoy: "bottom" };

function chipHtml(municipality: string, severity: Severity) {
  const color = SEVERITY_COLOR[severity];
  return (
    `<span class="hero-chip">` +
    `<span class="hero-chip-dot" style="background:${color}"></span>` +
    `<b>${municipality}</b>` +
    `<span style="color:${color};font-weight:600">${severity}</span>` +
    `</span>`
  );
}

function FitFocus({ geo }: { geo: FeatureCollection | null }) {
  const map = useMap();
  useEffect(() => {
    if (!geo) return;
    const focused: FeatureCollection = {
      ...geo,
      features: geo.features.filter((f) =>
        FOCUS.includes((f as Feature).properties?.municipality),
      ),
    };
    if (focused.features.length === 0) return;
    const bounds = L.geoJSON(focused as never).getBounds();
    if (bounds.isValid()) map.fitBounds(bounds.pad(0.3));
  }, [geo, map]);
  return null;
}

/**
 * Hero satellite preview: live Leaflet map (Esri World Imagery) with the
 * campaign municipalities traced in severity colors. Hover a trace to spotlight
 * it; click (or Enter on keyboard focus) to open that campaign.
 */
export default function HeroLeafletMap() {
  const router = useRouter();
  const [geo, setGeo] = useState<FeatureCollection | null>(null);
  const [failed, setFailed] = useState(false);
  const topRef = useRef<L.GeoJSON | null>(null);

  const byMuni = useMemo(() => {
    const map = new Map<string, typeof campaigns>();
    for (const c of campaigns) {
      if (c.status === "Closed" || c.status === "Draft") continue;
      const list = map.get(c.municipality) ?? [];
      list.push(c);
      map.set(c.municipality, list);
    }
    return map;
  }, []);

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
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (failed) {
    return (
      <div className="mx-5 mt-3 flex min-h-[280px] flex-col items-center justify-center gap-2 rounded-xl border border-[#e5e7eb] bg-[#eef1f5] p-6 text-center">
        <p className="text-sm font-semibold text-[#1a2333]">
          Map preview failed to load. See campaigns instead.
        </p>
        <Link href="/campaigns" className="font-semibold text-[#084989] hover:underline">
          View all campaigns
        </Link>
      </div>
    );
  }

  if (!geo) {
    return (
      <div
        aria-label="Loading map preview"
        className="mx-5 mt-3 h-[280px] w-[calc(100%-2.5rem)] animate-pulse rounded-xl bg-[#eef1f5] sm:h-[300px]"
      />
    );
  }

  const styleFor = (severity: Severity | null): L.PathOptions => ({
    color: severity ? SEVERITY_COLOR[severity] : "#6b7280",
    weight: 2.5,
    opacity: 1,
    fillColor: severity ? SEVERITY_COLOR[severity] : "#6b7280",
    fillOpacity: 0.35,
  });

  const worstOf = (muni: string): Severity | null => {
    const list = byMuni.get(muni);
    if (!list || list.length === 0) return null;
    let worst: Severity = "Moderate";
    for (const c of list) {
      if (SEVERITY_RANK[c.severity] < SEVERITY_RANK[worst]) worst = c.severity;
    }
    return worst;
  };

  return (
    <div className="relative mx-5 mt-3 overflow-hidden rounded-xl border border-[#e5e7eb]">
      <MapContainer
        center={[14.9, 120.85]}
        zoom={10}
        scrollWheelZoom={false}
        dragging
        touchZoom
        zoomControl={false}
        minZoom={8}
        maxZoom={15}
        maxBounds={[
          [13.4, 119.4],
          [16.6, 122.1],
        ]}
        maxBoundsViscosity={1.0}
        className="hero-leaflet z-0 h-[280px] w-full sm:h-[300px]"
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Imagery &copy; Esri, Maxar, Earthstar Geographics"
        />
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          attribution="Places &copy; Esri | Boundaries &copy; OpenStreetMap contributors (ODbL)"
        />
        <ZoomControl position="topright" />
        <FitFocus geo={geo} />
        {/* White casing under each trace — pointer-transparent */}
        <GeoJSON
          data={geo}
          style={() => ({
            color: "#ffffff",
            weight: 5,
            opacity: 0.85,
            fill: false,
          })}
          onEachFeature={(_feature, layer) => {
            layer.on("add", () => {
              (layer as L.Path).getElement()?.classList.add("hero-casing");
            });
          }}
        />
        {/* Severity traces: hover to spotlight, click to open the campaign */}
        <GeoJSON
          ref={topRef}
          data={geo}
          style={(feature) => styleFor(worstOf(feature?.properties?.municipality ?? ""))}
          onEachFeature={(feature, layer) => {
            const muni = (feature.properties?.municipality ?? "") as string;
            const list = byMuni.get(muni) ?? [];
            if (list.length === 0) return;
            const severity = worstOf(muni) ?? "Moderate";
            const direction = TIP_DIRECTION[muni] ?? "top";
            layer.bindTooltip(chipHtml(muni, severity), {
              permanent: true,
              direction,
              offset: direction === "top" ? [0, -10] : [0, 10],
              className: "hero-map-tip",
              opacity: 1,
            });
            layer.on({
              mouseover: (e) => {
                (e.target as L.Path).setStyle({ weight: 4.5, fillOpacity: 0.55 });
              },
              mouseout: (e) => {
                topRef.current?.resetStyle(e.target as L.Path);
              },
              click: () => {
                router.push(`/campaigns/${list[0].slug}`);
              },
            });
          }}
        />
      </MapContainer>

      {/* Floating chrome (visual only; the text legend below stays accessible) */}
      <span
        aria-hidden
        className="absolute top-2 left-3 z-[500] rounded bg-white/90 px-2 py-0.5 text-[10px] font-bold tracking-[0.08em] text-[#6b7280] uppercase"
      >
        Region 3 · Live
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-2 left-2 z-[500] flex items-center gap-2 rounded-lg bg-white/95 px-2.5 py-1.5 shadow-sm"
      >
        <span className="flex items-center gap-1 text-[10px] font-bold text-[#1a2333]">
          <span className="inline-block size-2 rounded-full bg-[#c8102e]" />
          Crit
        </span>
        <span className="flex items-center gap-1 text-[10px] font-bold text-[#1a2333]">
          <span className="inline-block size-2 rounded-full bg-[#d97706]" />
          High
        </span>
        <span className="flex items-center gap-1 text-[10px] font-bold text-[#1a2333]">
          <span className="inline-block size-2 rounded-full bg-[#b57e12]" />
          Elev
        </span>
      </span>
    </div>
  );
}
