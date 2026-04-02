"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "@/lib/mapbox";
import { sampleTaxiRoute } from "./routes";

export default function TaxiMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (!mapboxgl.accessToken) return;
    if (mapInstanceRef.current) return;

    mapInstanceRef.current = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/navigation-day-v1",
      center: [-6.2592, 53.3461],
      zoom: 15.5,
    });

    mapInstanceRef.current.on("load", () => {
      mapInstanceRef.current?.addSource("taxi-shortcut", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: sampleTaxiRoute.coordinates,
          },
        },
      });

      mapInstanceRef.current?.addLayer({
        id: "taxi-shortcut-line",
        type: "line",
        source: "taxi-shortcut",
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "#3b82f6",
          "line-width": 8,
          "line-opacity": 0.9,
        },
      });

      mapInstanceRef.current?.on("click", (e) => {
        console.log("clicked", [e.lngLat.lng, e.lngLat.lat]);
      });
    });

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return (
      <div className="flex h-full items-center justify-center text-center text-sm text-white/60">
        Add NEXT_PUBLIC_MAPBOX_TOKEN to show the map
      </div>
    );
  }

  return <div ref={mapRef} className="h-full w-full" />;
}