"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "@/lib/mapbox";

type RouteRow = {
  id: string;
  name: string;
  coordinates: [number, number][];
  created_at: string;
};

const LIVE_SOURCE_ID = "live-capture-route";
const LIVE_LAYER_ID = "live-capture-route-line";

function makeLineFeature(coordinates: [number, number][]) {
  return {
    type: "Feature" as const,
    geometry: {
      type: "LineString" as const,
      coordinates,
    },
    properties: {},
  };
}

function haversineMeters(a: [number, number], b: [number, number]) {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const [lng1, lat1] = a;
  const [lng2, lat2] = b;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const s1 = Math.sin(dLat / 2);
  const s2 = Math.sin(dLng / 2);

  const value =
    s1 * s1 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * s2 * s2;

  const c = 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
  return R * c;
}

export default function TaxiMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const startedAtRef = useRef<string | null>(null);

  const [gpsError, setGpsError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedPoints, setRecordedPoints] = useState<[number, number][]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;
    if (!mapboxgl.accessToken) return;
    if (mapInstanceRef.current) return;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/navigation-day-v1",
      center: [-6.2592, 53.3461],
      zoom: 15.5,
    });

    mapInstanceRef.current = map;

    map.on("load", async () => {
      try {
        const res = await fetch("/api/taxi-routes");
        const routes: RouteRow[] = await res.json();
        const route = routes[0];

        if (route) {
          map.addSource("taxi-shortcut", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: route.coordinates,
              },
            },
          });

          map.addLayer({
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

          const start = route.coordinates[0];
          const end = route.coordinates[route.coordinates.length - 1];

          new mapboxgl.Marker({ color: "#22c55e" })
            .setLngLat(start)
            .setPopup(new mapboxgl.Popup().setText("Start"))
            .addTo(map);

          new mapboxgl.Marker({ color: "#ef4444" })
            .setLngLat(end)
            .setPopup(new mapboxgl.Popup().setText("Destination"))
            .addTo(map);
        }

        map.addSource(LIVE_SOURCE_ID, {
          type: "geojson",
          data: makeLineFeature([]),
        });

        map.addLayer({
          id: LIVE_LAYER_ID,
          type: "line",
          source: LIVE_SOURCE_ID,
          layout: {
            "line-cap": "round",
            "line-join": "round",
          },
          paint: {
            "line-color": "#22c55e",
            "line-width": 6,
            "line-opacity": 0.9,
          },
        });

        map.on("click", (e) => {
          console.log("clicked", [e.lngLat.lng, e.lngLat.lat]);
        });
      } catch (error) {
        console.error("Failed to load taxi routes", error);
      }
    });

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }

      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const source = map.getSource(LIVE_SOURCE_ID) as
      | mapboxgl.GeoJSONSource
      | undefined;

    if (!source) return;

    source.setData(makeLineFeature(recordedPoints));
  }, [recordedPoints]);

  function startRecording() {
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported on this device.");
      return;
    }

    if (watchIdRef.current !== null) return;

    setGpsError(null);
    setRecordedPoints([]);
    setIsRecording(true);
    startedAtRef.current = new Date().toISOString();

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const point: [number, number] = [
          position.coords.longitude,
          position.coords.latitude,
        ];

        setRecordedPoints((prev) => {
          const last = prev[prev.length - 1];

          if (!last) {
            return [point];
          }

          const moved = haversineMeters(last, point);

          if (moved < 5) {
            return prev;
          }

          return [...prev, point];
        });
      },
      (error) => {
        setGpsError(error.message || "Unable to get location.");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );
  }

  async function stopRecording() {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    setIsRecording(false);

    if (recordedPoints.length < 2) {
      setGpsError("Not enough route points captured to save.");
      return;
    }

    setGpsError(null);
    setIsSaving(true);

    try {
      const endedAt = new Date().toISOString();

      const totalDistanceMeters = recordedPoints.reduce((total, point, index) => {
        if (index === 0) return 0;
        return total + haversineMeters(recordedPoints[index - 1], point);
      }, 0);

      const res = await fetch("/api/taxi-route-captures", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `Dublin capture ${new Date().toLocaleString()}`,
          startedAt: startedAtRef.current ?? new Date().toISOString(),
          endedAt,
          coordinates: recordedPoints,
          distanceMeters: Math.round(totalDistanceMeters),
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to save route.");
      }

      console.log("saved route capture", result.capture);
    } catch (error) {
      setGpsError(error instanceof Error ? error.message : "Failed to save route.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full" />

      <div className="absolute left-3 right-3 top-3 z-10 grid grid-cols-2 gap-2">
        <button
          onClick={startRecording}
          disabled={isRecording || isSaving}
          className="rounded-xl bg-green-500 px-4 py-3 text-sm font-semibold text-black disabled:opacity-50"
        >
          Start
        </button>

        <button
          onClick={stopRecording}
          disabled={!isRecording || isSaving}
          className="rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Stop"}
        </button>
      </div>

      {gpsError ? (
        <div className="absolute bottom-3 left-3 right-3 z-10 rounded-lg bg-black/70 px-3 py-2 text-sm text-red-300">
          {gpsError}
        </div>
      ) : null}
    </div>
  );
}