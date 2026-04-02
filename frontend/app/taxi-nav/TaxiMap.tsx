"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "@/lib/mapbox";

type CaptureRow = {
  id: string;
  name: string | null;
  point_count: number;
  distance_meters: number | null;
  created_at: string;
  route: {
    type: "Feature";
    geometry: {
      type: "LineString";
      coordinates: [number, number][];
    };
    properties: Record<string, never>;
  } | null;
};

const LIVE_SOURCE_ID = "live-capture-route";
const LIVE_LAYER_ID = "live-capture-route-line";
const SAVED_SOURCE_ID = "saved-capture-route";
const SAVED_LAYER_ID = "saved-capture-route-line";

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

function fitMapToCoordinates(map: mapboxgl.Map, coordinates: [number, number][]) {
  if (coordinates.length === 0) return;

  const bounds = new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]);

  for (const coordinate of coordinates) {
    bounds.extend(coordinate);
  }

  map.fitBounds(bounds, {
    padding: 50,
    duration: 800,
  });
}

export default function TaxiMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const startedAtRef = useRef<string | null>(null);
  const currentMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const followMeRef = useRef(true);

  const [gpsError, setGpsError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedPoints, setRecordedPoints] = useState<[number, number][]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [captures, setCaptures] = useState<CaptureRow[]>([]);
  const [isLoadingCaptures, setIsLoadingCaptures] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedCaptureId, setSelectedCaptureId] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [followMe, setFollowMe] = useState(true);

  function setFollowMeState(value: boolean) {
    followMeRef.current = value;
    setFollowMe(value);
  }

  async function loadCaptures() {
    setIsLoadingCaptures(true);

    try {
      const res = await fetch("/api/taxi-route-captures");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load captures.");
      }

      setCaptures(data);
    } catch (error) {
      console.error("Failed to load captures", error);
    } finally {
      setIsLoadingCaptures(false);
    }
  }

  async function deleteCapture(id: string) {
    setDeletingId(id);

    try {
      const res = await fetch(`/api/taxi-route-captures?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete capture.");
      }

      setCaptures((prev) => prev.filter((capture) => capture.id !== id));

      if (selectedCaptureId === id) {
        setSelectedCaptureId(null);

        const map = mapInstanceRef.current;
        if (map) {
          const savedSource = map.getSource(SAVED_SOURCE_ID) as
            | mapboxgl.GeoJSONSource
            | undefined;

          if (savedSource) {
            savedSource.setData(makeLineFeature([]));
          }
        }
      }
    } catch (error) {
      console.error("Failed to delete capture", error);
    } finally {
      setDeletingId(null);
    }
  }

  function showSavedCapture(capture: CaptureRow) {
    if (!capture.route) return;

    const coordinates = capture.route.geometry.coordinates;
    const map = mapInstanceRef.current;
    if (!map) return;

    const savedSource = map.getSource(SAVED_SOURCE_ID) as
      | mapboxgl.GeoJSONSource
      | undefined;

    if (!savedSource) return;

    savedSource.setData(makeLineFeature(coordinates));
    setSelectedCaptureId(capture.id);
    setFollowMeState(false);

    if (coordinates.length > 0) {
      fitMapToCoordinates(map, coordinates);
    }
  }

  function ensureLiveMarker(point: [number, number]) {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (currentMarkerRef.current) {
      currentMarkerRef.current.setLngLat(point);
      return;
    }

    currentMarkerRef.current = new mapboxgl.Marker({ color: "#ffffff" })
      .setLngLat(point)
      .setPopup(new mapboxgl.Popup().setText("You are here"))
      .addTo(map);
  }

  function centerOnPoint(point: [number, number], zoom = 16.5) {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.easeTo({
      center: point,
      zoom,
      duration: 700,
    });
  }

  function locateMe() {
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported on this device.");
      return;
    }

    setGpsError(null);
    setIsLocating(true);
    setFollowMeState(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const point: [number, number] = [
          position.coords.longitude,
          position.coords.latitude,
        ];

        ensureLiveMarker(point);
        centerOnPoint(point);
        setIsLocating(false);
      },
      (error) => {
        setGpsError(error.message || "Unable to get current location.");
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );
  }

  useEffect(() => {
    loadCaptures();
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    if (!mapboxgl.accessToken) return;
    if (mapInstanceRef.current) return;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/navigation-day-v1",
      center: [-6.2603, 53.3498],
      zoom: 11.5,
    });

    mapInstanceRef.current = map;

    map.on("dragstart", () => {
      if (watchIdRef.current !== null) {
        setFollowMeState(false);
      }
    });

    map.on("load", () => {
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

      map.addSource(SAVED_SOURCE_ID, {
        type: "geojson",
        data: makeLineFeature([]),
      });

      map.addLayer({
        id: SAVED_LAYER_ID,
        type: "line",
        source: SAVED_SOURCE_ID,
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "#f59e0b",
          "line-width": 6,
          "line-opacity": 0.95,
        },
      });
    });

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }

      currentMarkerRef.current?.remove();
      currentMarkerRef.current = null;

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

    const map = mapInstanceRef.current;
    if (map) {
      const savedSource = map.getSource(SAVED_SOURCE_ID) as
        | mapboxgl.GeoJSONSource
        | undefined;

      if (savedSource) {
        savedSource.setData(makeLineFeature([]));
      }
    }

    setSelectedCaptureId(null);
    setGpsError(null);
    setRecordedPoints([]);
    setFollowMeState(true);
    setIsRecording(true);
    startedAtRef.current = new Date().toISOString();

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const point: [number, number] = [
          position.coords.longitude,
          position.coords.latitude,
        ];

        ensureLiveMarker(point);

        if (followMeRef.current) {
          centerOnPoint(point, 17);
        }

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

      await loadCaptures();
      setRecordedPoints([]);
      console.log("saved route capture", result.capture);
    } catch (error) {
      setGpsError(error instanceof Error ? error.message : "Failed to save route.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="relative h-full w-full">
      <div className="h-[60vh] w-full">
        <div ref={mapRef} className="h-full w-full" />
      </div>

      <div className="absolute left-3 right-3 top-3 z-10 grid grid-cols-3 gap-2">
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

        <button
          onClick={locateMe}
          disabled={isLocating}
          className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black disabled:opacity-50"
        >
          {isLocating ? "Locating..." : "My Location"}
        </button>
      </div>

      {isRecording ? (
        <div className="absolute right-3 top-20 z-10 rounded-lg bg-black/70 px-3 py-2 text-xs text-white">
          {followMe ? "Following you" : "Follow paused"}
        </div>
      ) : null}

      {gpsError ? (
        <div className="absolute bottom-[41vh] left-3 right-3 z-10 rounded-lg bg-black/70 px-3 py-2 text-sm text-red-300">
          {gpsError}
        </div>
      ) : null}

      <div className="bg-slate-950 px-3 py-4 text-white">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Saved captures</h2>
          <button
            onClick={loadCaptures}
            disabled={isLoadingCaptures}
            className="rounded-lg border border-white/20 px-3 py-1 text-xs disabled:opacity-50"
          >
            {isLoadingCaptures ? "Loading..." : "Refresh"}
          </button>
        </div>

        <div className="space-y-2">
          {captures.length === 0 ? (
            <div className="rounded-xl bg-white/5 px-3 py-3 text-sm text-white/70">
              No saved captures yet
            </div>
          ) : (
            captures.map((capture) => (
              <div
                key={capture.id}
                onClick={() => showSavedCapture(capture)}
                className={`rounded-xl px-3 py-3 text-sm cursor-pointer ${
                  selectedCaptureId === capture.id
                    ? "bg-amber-500/20 ring-1 ring-amber-400/50"
                    : "bg-white/5"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">
                      {capture.name || "Unnamed capture"}
                    </div>
                    <div className="mt-1 text-white/70">
                      Points: {capture.point_count}
                    </div>
                    <div className="text-white/70">
                      Distance:{" "}
                      {capture.distance_meters != null
                        ? `${Math.round(capture.distance_meters)} m`
                        : "—"}
                    </div>
                    <div className="text-white/50">
                      {new Date(capture.created_at).toLocaleString()}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      deleteCapture(capture.id);
                    }}
                    disabled={deletingId === capture.id}
                    className="rounded-lg border border-red-400/40 px-3 py-1 text-xs text-red-300 disabled:opacity-50"
                  >
                    {deletingId === capture.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}