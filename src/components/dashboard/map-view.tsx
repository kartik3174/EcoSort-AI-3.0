"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import { MapReport } from "@/lib/data";

const categoryColors: Record<string, string> = {
    Plastic: "#10b981",
    Organic: "#f59e0b",
    Glass: "#3b82f6",
    Electronic: "#8b5cf6",
    Hazardous: "#ef4444",
};

function createCustomIcon(category: string, severity: string) {
    const color = categoryColors[category] || "#10b981";
    const size = severity === "Critical" ? 16 : severity === "High" ? 14 : 12;
    const pulse = severity === "Critical" || severity === "High";

    return L.divIcon({
        className: "custom-marker",
        html: `
      <div style="position:relative;display:flex;align-items:center;justify-content:center;">
        ${pulse ? `<div style="position:absolute;width:${size * 2.5}px;height:${size * 2.5}px;border-radius:50%;background:${color};opacity:0.15;animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;"></div>` : ""}
        <div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,0.3);box-shadow:0 0 10px ${color}50;"></div>
      </div>
    `,
        iconSize: [size * 3, size * 3],
        iconAnchor: [size * 1.5, size * 1.5],
    });
}

export default function MapView({
    reports,
    showHeatmap,
}: {
    reports: MapReport[];
    showHeatmap: boolean;
}) {
    const mapRef = useRef<L.Map | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        if (mapRef.current) {
            mapRef.current.remove();
        }

        const map = L.map(containerRef.current, {
            center: [13.02, 80.22],
            zoom: 12,
            zoomControl: false,
        });

        L.control.zoom({ position: "bottomright" }).addTo(map);

        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>',
            maxZoom: 19,
        }).addTo(map);

        // Add markers
        reports.forEach((report) => {
            const marker = L.marker([report.lat, report.lng], {
                icon: createCustomIcon(report.category, report.severity),
            });

            marker.bindPopup(`
        <div style="min-width:200px;font-family:Inter,sans-serif;">
          <div style="font-size:13px;font-weight:600;color:#fff;margin-bottom:6px;">${report.location}</div>
          <div style="display:flex;gap:6px;margin-bottom:8px;">
            <span style="font-size:10px;padding:2px 8px;border-radius:9999px;background:${categoryColors[report.category]}20;color:${categoryColors[report.category]};border:1px solid ${categoryColors[report.category]}30;">${report.category}</span>
            <span style="font-size:10px;padding:2px 8px;border-radius:9999px;background:rgba(255,255,255,0.05);color:rgba(255,255,255,0.6);">${report.severity}</span>
          </div>
          <p style="font-size:11px;color:rgba(255,255,255,0.5);margin:0 0 6px 0;">${report.description}</p>
          <div style="font-size:10px;color:rgba(255,255,255,0.3);">Reported by ${report.reporter} • ${report.date}</div>
        </div>
      `, {
                className: "dark-popup",
            });

            marker.addTo(map);
        });

        // Heatmap circles simulation
        if (showHeatmap) {
            reports.forEach((report) => {
                const radius = report.severity === "Critical" ? 800 : report.severity === "High" ? 600 : 400;
                const color = categoryColors[report.category];
                L.circle([report.lat, report.lng], {
                    radius,
                    fillColor: color,
                    fillOpacity: 0.08,
                    stroke: false,
                }).addTo(map);
            });
        }

        mapRef.current = map;

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [reports, showHeatmap]);

    return (
        <>
            <style jsx global>{`
        .dark-popup .leaflet-popup-content-wrapper {
          background: hsl(220, 20%, 10%) !important;
          border: 1px solid rgba(255,255,255,0.08) !important;
          border-radius: 12px !important;
          box-shadow: 0 25px 50px rgba(0,0,0,0.5) !important;
        }
        .dark-popup .leaflet-popup-tip {
          background: hsl(220, 20%, 10%) !important;
        }
        .dark-popup .leaflet-popup-close-button {
          color: rgba(255,255,255,0.3) !important;
        }
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
            <div ref={containerRef} className="w-full h-full" />
        </>
    );
}
