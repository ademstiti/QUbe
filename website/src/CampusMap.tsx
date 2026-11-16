import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Box,
  Check,
  ChevronRight,
  Compass,
  ExternalLink,
  GraduationCap,
  Info,
  Layers3,
  MapPin,
  Maximize,
  Minus,
  Plus,
  RotateCcw,
  RotateCw,
  Search,
  TrainFront,
  X,
  Sun,
  Moon,
  Play,
  Pause,
} from "lucide-react";
import type { Map as LibreMap, Marker, FilterSpecification } from "maplibre-gl";
import type { FeatureCollection } from "geojson";
import {
  CAMPUS_BOUNDS,
  CAMPUS_CENTER,
  CAMPUS_SOURCES,
  HUBS,
  type Hub,
} from "./campus";
import { createCampusStyle } from "./campusScene";
import "./campus.css";
const HubStudio = lazy(() => import("./HubStudio"));

const DATA_URL = `${import.meta.env.BASE_URL}campus/qatar-university.geojson`;
const reducedMotion = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
function mapMotion() {
  return { duration: reducedMotion() ? 0 : 950 };
}
function googleLink(hub: Hub) {
  return `https://www.google.com/maps/search/?api=1&query=${hub.landmark[1]},${hub.landmark[0]}`;
}

function CampusFallback({
  data,
  selected,
  select,
  visible,
  loading,
}: {
  data: FeatureCollection | null;
  selected: string;
  select: (id: string) => void;
  visible: string[];
  loading: boolean;
}) {
  const project = (point: number[]) => [
    (point[0] - 51.478) * 57000,
    (25.384 - point[1]) * 60000,
  ];
  return (
    <div className="campus-fallback">
      <svg
        viewBox="0 0 1060 950"
        role="img"
        aria-label="Top-down campus map. Select a numbered proposed QUbe hub, or use the college list."
      >
        <rect width="1060" height="950" fill="#eeeade" />
        {data?.features
          .filter((f) => f.geometry.type === "Polygon")
          .map((f, i) => {
            if (f.geometry.type !== "Polygon") return null;
            const ring = f.geometry.coordinates[0];
            const d =
              ring
                .map((c, j) => `${j ? "L" : "M"}${project(c).join(" ")}`)
                .join(" ") + "Z";
            return (
              <path
                key={i}
                d={d}
                fill={f.properties?.kind === "building" ? "#d4cbb7" : "#dce2cc"}
                stroke={f.properties?.kind === "building" ? "#bbb39e" : "none"}
                strokeWidth=".7"
              />
            );
          })}
        {data?.features
          .filter(
            (f) =>
              f.geometry.type === "LineString" && f.properties?.kind === "road",
          )
          .map((f, i) =>
            f.geometry.type === "LineString" ? (
              <path
                key={i}
                d={f.geometry.coordinates
                  .map((c, j) => `${j ? "L" : "M"}${project(c).join(" ")}`)
                  .join(" ")}
                fill="none"
                stroke="#fffdf5"
                strokeWidth={
                  ["footway", "path", "cycleway"].includes(
                    f.properties?.subtype,
                  )
                    ? 2
                    : 6
                }
              />
            ) : null,
          )}
        {HUBS.filter((h) => visible.includes(h.id)).map((h) => {
          const [x, y] = project(h.coordinates);
          return (
            <g key={h.id} transform={`translate(${x} ${y})`}>
              <circle
                r={h.id === selected ? 20 : 15}
                fill={h.id === selected ? "#174e3b" : "#fbfcfa"}
                stroke="#174e3b"
                strokeWidth="2"
              />
              <text
                textAnchor="middle"
                dy="4"
                fontSize="12"
                fontFamily="sans-serif"
                fill={h.id === selected ? "#fff" : "#174e3b"}
              >
                {h.number}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="fallback-notice">
        <Layers3 size={17} />
        <span>
          {loading
            ? "Preparing your campus view…"
            : "2D campus view · 3D needs WebGL support in your browser."}
        </span>
      </div>
      <div
        className="fallback-location-buttons"
        aria-label="Select a proposed location on the 2D map"
      >
        {HUBS.filter((h) => visible.includes(h.id)).map((h) => (
          <button
            key={h.id}
            onClick={() => select(h.id)}
            aria-pressed={h.id === selected}
            aria-label={`Select ${h.college}`}
          >
            {h.number}
          </button>
        ))}
      </div>
      <a
        className="fallback-attribution"
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noopener noreferrer"
      >
        © OpenStreetMap contributors
      </a>
    </div>
  );
}

export default function CampusMap() {
  const [selected, setSelected] = useState("metro"),
    [query, setQuery] = useState(""),
    [category, setCategory] = useState("All");
  const [view, setView] = useState<"3d" | "2d">("3d"),
    [streets, setStreets] = useState(false),
    [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");
  const [data, setData] = useState<FeatureCollection | null>(null),
    [dataError, setDataError] = useState(false),
    [sourcesOpen, setSourcesOpen] = useState(false);
  const mapRef = useRef<LibreMap | null>(null),
    host = useRef<HTMLDivElement>(null),
    markers = useRef<Map<string, Marker>>(new Map());
  const cameraInitialized = useRef(false);
  const state = useRef({ selected, view, streets });
  state.current = { selected, view, streets };
  const filtered = useMemo(
    () =>
      HUBS.filter(
        (h) =>
          (category === "All" || h.group === category) &&
          `${h.college} ${h.name} ${h.area}`
            .toLowerCase()
            .includes(query.trim().toLowerCase()),
      ),
    [query, category],
  );
  const visible = filtered.map((h) => h.id),
    visibleKey = visible.join(",");
  const active = HUBS.find((h) => h.id === selected)!;
  const [retry, setRetry] = useState(0);
  const [studioOpen, setStudioOpen] = useState(false),
    [evening, setEvening] = useState(false),
    [tour, setTour] = useState(false);
  function choose(id: string) {
    if (id === state.current.selected) {
      const hub = HUBS.find((h) => h.id === id)!;
      mapRef.current?.easeTo({
        center: hub.coordinates,
        zoom: 18.7,
        pitch: state.current.view === "3d" ? 58 : 0,
        ...mapMotion(),
      });
    }
    setSelected(id);
  }

  useEffect(() => {
    let disposed = false;
    const abort = new AbortController();
    let cleanupResize: (() => void) | undefined;
    let failed = false;
    let ready = false;
    let startupTimer: ReturnType<typeof setTimeout> | undefined;
    const showFallback = () => {
      if (disposed) return;
      failed = true;
      if (startupTimer) clearTimeout(startupTimer);
      setStatus("fallback");
    };
    setStatus("loading");
    setDataError(false);
    cameraInitialized.current = false;
    let dataLoaded = false;
    const render = async () => {
      try {
        const response = await fetch(DATA_URL, { signal: abort.signal });
        if (!response.ok) throw new Error("Campus data unavailable");
        const geometry = (await response.json()) as FeatureCollection;
        if (disposed) return;
        setData(geometry);
        dataLoaded = true;
        if (!window.WebGL2RenderingContext) {
          setStatus("fallback");
          return;
        }
        startupTimer = setTimeout(showFallback, 15000);
        const { maplibre: ml } = await import("./mapRuntime");
        if (disposed || !host.current) return;
        const map = new ml.Map({
          container: host.current,
          // Load the real sources as part of the initial style. An empty style
          // can fire `load` before any campus geometry has reached the worker.
          style: createCampusStyle(geometry),
          pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
          center: CAMPUS_CENTER,
          zoom: 15.65,
          pitch: 50,
          bearing: -24,
          maxPitch: 72,
          minZoom: 14,
          maxZoom: 21,
          maxBounds: [
            [51.47, 25.358],
            [51.506, 25.393],
          ],
          canvasContextAttributes: { antialias: true },
          attributionControl: false,
        });
        mapRef.current = map;
        map.addControl(
          new ml.AttributionControl({
            compact: true,
            customAttribution:
              '<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap contributors</a> · Building heights illustrative',
          }),
          "bottom-right",
        );
        map.addControl(
          new ml.ScaleControl({ maxWidth: 95, unit: "metric" }),
          "bottom-left",
        );
        const resize = () => map.resize();
        window.addEventListener("resize", resize);
        cleanupResize = () => window.removeEventListener("resize", resize);
        const onLost = (e: Event) => {
          e.preventDefault();
          showFallback();
        };
        map.getCanvas().addEventListener("webglcontextlost", onLost);
        map.on("load", () => {
          if (disposed || failed) return;
          map.resize();
          for (const hub of HUBS) {
            const element = document.createElement("button");
            element.className = "hub-pin";
            element.type = "button";
            element.setAttribute(
              "aria-label",
              `Select proposed QUbe near ${hub.college}`,
            );
            element.setAttribute(
              "aria-pressed",
              String(hub.id === state.current.selected),
            );
            const num = document.createElement("span");
            num.className = "pin-number";
            num.textContent = hub.number;
            const label = document.createElement("span");
            label.className = "pin-label";
            label.textContent =
              hub.id === "metro"
                ? "Metro"
                : hub.college
                    .replace("College of ", "")
                    .replace(" and ", " & ");
            element.append(num, label);
            element.addEventListener("click", () => choose(hub.id));
            const marker = new ml.Marker({
              element,
              anchor: "bottom",
              offset: [0, -8],
            })
              .setLngLat(hub.coordinates)
              .addTo(map);
            markers.current.set(hub.id, marker);
          }
          map.on("click", "containers-3d", (e) => {
            const id = e.features?.[0]?.properties?.hubId;
            if (typeof id === "string") setSelected(id);
          });
          map.on(
            "mouseenter",
            "containers-3d",
            () => (map.getCanvas().style.cursor = "pointer"),
          );
          map.on(
            "mouseleave",
            "containers-3d",
            () => (map.getCanvas().style.cursor = ""),
          );
          map.setLayoutProperty(
            "street-map",
            "visibility",
            state.current.streets ? "visible" : "none",
          );
          ready = true;
          if (startupTimer) clearTimeout(startupTimer);
          setStatus("ready");
        });
        map.on("error", (e) => {
          // Optional street tiles must not hide a working local campus scene.
          if ("sourceId" in e && e.sourceId === "streets") return;
          if (!ready || /WebGL|worker|context/i.test(e.error.message))
            showFallback();
        });
      } catch {
        if (disposed) return;
        if (!dataLoaded) setDataError(true);
        showFallback();
      }
    };
    void render();
    return () => {
      disposed = true;
      abort.abort();
      if (startupTimer) clearTimeout(startupTimer);
      cleanupResize?.();
      for (const m of markers.current.values()) m.remove();
      markers.current.clear();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [retry]);

  useEffect(() => {
    if (filtered.length && !filtered.some((h) => h.id === selected))
      setSelected(filtered[0].id);
  }, [visibleKey, selected]);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || status !== "ready") return;
    if (cameraInitialized.current)
      map.easeTo({
        center: active.coordinates,
        zoom: 18.7,
        pitch: view === "3d" ? 58 : 0,
        bearing: view === "3d" ? -24 : 0,
        ...mapMotion(),
      });
    cameraInitialized.current = true;
    const source = map.getSource("selected-area") as
      import("maplibre-gl").GeoJSONSource | undefined;
    source?.setData({
      type: "Feature",
      properties: {},
      geometry: { type: "Point", coordinates: active.coordinates },
    });
    for (const [id, marker] of markers.current) {
      marker.getElement().classList.toggle("is-selected", id === selected);
      marker.getElement().setAttribute("aria-pressed", String(id === selected));
    }
  }, [selected, status]);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || status !== "ready") return;
    map.easeTo({
      pitch: view === "3d" ? 58 : 0,
      bearing: view === "3d" ? -24 : 0,
      ...mapMotion(),
    });
    for (const layer of ["buildings-3d", "containers-3d"])
      map.setLayoutProperty(
        layer,
        "visibility",
        view === "3d" ? "visible" : "none",
      );
  }, [view, status]);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || status !== "ready") return;
    map.setLayoutProperty(
      "street-map",
      "visibility",
      streets ? "visible" : "none",
    );
    map.setPaintProperty("land", "fill-opacity", streets ? 0.25 : 0.8);
    for (const [id, m] of markers.current)
      m.getElement().style.display = visible.includes(id) ? "" : "none";
    const match: FilterSpecification = [
      "in",
      ["get", "hubId"],
      ["literal", visible],
    ];
    map.setFilter(
      "containers-3d",
      match as import("maplibre-gl").FilterSpecification,
    );
    map.setFilter("container-footprints", [
      "all",
      match,
      ["in", ["get", "part"], ["literal", ["container", "deck"]]],
    ] as import("maplibre-gl").FilterSpecification);
  }, [visibleKey, streets, status]);

  function overview() {
    mapRef.current?.fitBounds(CAMPUS_BOUNDS, {
      padding: 55,
      pitch: view === "3d" ? 45 : 0,
      bearing: view === "3d" ? -24 : 0,
      ...mapMotion(),
    });
  }
  function inspect() {
    setTour(false);
    setStudioOpen(true);
    document
      .querySelector(".campus-map-stage")
      ?.scrollIntoView({
        behavior: reducedMotion() ? "instant" : "smooth",
        block: "center",
      });
  }
  function next() {
    const index = filtered.findIndex((h) => h.id === selected);
    if (filtered.length)
      setSelected(filtered[(index + 1) % filtered.length].id);
  }
  useEffect(() => {
    if (!tour || status !== "ready" || filtered.length < 2) return;
    const timer = setInterval(
      () =>
        setSelected((current) => {
          const index = filtered.findIndex((h) => h.id === current);
          return filtered[(index + 1) % filtered.length].id;
        }),
      6500,
    );
    return () => clearInterval(timer);
  }, [tour, visibleKey, status]);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || status !== "ready") return;
    map.setLight({
      anchor: "map",
      color: evening ? "#c7daec" : "#fff1d5",
      intensity: evening ? 0.3 : 0.55,
      position: [1.5, evening ? 300 : 220, evening ? 70 : 40],
    });
    map.setPaintProperty(
      "ground",
      "background-color",
      evening ? "#33473c" : "#eeeade",
    );
    map.setPaintProperty(
      "buildings-3d",
      "fill-extrusion-color",
      evening ? "#708375" : "#dfd6c1",
    );
    map.setPaintProperty(
      "land",
      "fill-opacity",
      evening ? 0.3 : streets ? 0.25 : 0.8,
    );
  }, [evening, status, streets]);
  return (
    <main className="campus-page container page-main">
      <a href="#/home" className="back-link">
        <ArrowLeft size={16} />
        Back to QUbe
      </a>
      <div className="campus-heading">
        <div>
          <p className="eyebrow">
            <span />A little closer to your day
          </p>
          <h1>
            Your campus.
            <br />A little more room<span>.</span>
          </h1>
          <p>
            Imagine a QUbe between your classes. Explore proposed container hubs
            near the metro and across Qatar University.
          </p>
        </div>
        <div className="campus-stat">
          <Box size={23} strokeWidth={1.5} />
          <strong>13</strong>
          <span>
            proposed stops
            <br />
            12 colleges + the metro
          </span>
        </div>
      </div>
      <div className="campus-proposal-note">
        <Info size={17} />
        <p>
          <strong>A future campus concept.</strong> All QUbe containers are
          illustrative proposals. No plots, university approval, or on-campus
          services are confirmed.
        </p>
      </div>
      <div className="campus-shell">
        <aside
          className="campus-sidebar"
          aria-label="Find a proposed campus hub"
        >
          <div className="campus-sidebar-top">
            <span className="campus-list-title">
              Find your corner of campus <Compass size={17} />
            </span>
            <label className="campus-search">
              <span className="sr-only">Search colleges and proposed hubs</span>
              <Search size={17} />
              <input
                type="search"
                value={query}
                placeholder="Find your college…"
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button
                  aria-label="Clear campus search"
                  onClick={() => setQuery("")}
                >
                  <X size={15} />
                </button>
              )}
            </label>
            <div
              className="campus-filter"
              role="group"
              aria-label="Filter campus hubs"
            >
              {["All", "Metro", "Colleges", "Health"].map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  aria-pressed={category === c}
                  className={category === c ? "selected" : ""}
                >
                  {c}
                </button>
              ))}
            </div>
            <p className="campus-result-count" aria-live="polite">
              {filtered.length} proposed{" "}
              {filtered.length === 1 ? "stop" : "stops"} · Select to look closer
            </p>
          </div>
          <div className="campus-hub-list">
            {filtered.map((h) => (
              <button
                className={`campus-hub ${h.id === selected ? "selected" : ""}`}
                key={h.id}
                aria-pressed={h.id === selected}
                onClick={() => choose(h.id)}
              >
                <span className="hub-number">{h.number}</span>
                <span>
                  <strong>{h.college}</strong>
                  <small>{h.name}</small>
                </span>
                {h.id === selected ? (
                  <Check size={16} />
                ) : (
                  <ChevronRight size={15} />
                )}
              </button>
            ))}
            {!filtered.length && (
              <div className="campus-no-results">
                <Search size={24} />
                <strong>No corner found just yet.</strong>
                <p>Try another college name or show all proposed stops.</p>
                <button
                  onClick={() => {
                    setQuery("");
                    setCategory("All");
                  }}
                >
                  Show all stops <ArrowRight size={15} />
                </button>
              </div>
            )}
          </div>
        </aside>
        <div className="campus-map-column">
          <div className="campus-map-stage">
            <div
              ref={host}
              className="campus-webgl"
              role="region"
              aria-label="Interactive 3D Qatar University map with proposed QUbe container hubs"
            />
            {status !== "ready" && (
              <CampusFallback
                data={data}
                selected={selected}
                select={choose}
                visible={visible}
                loading={status === "loading"}
              />
            )}
            {studioOpen && (
              <Suspense
                fallback={
                  <div className="studio-loading">
                    Preparing the architecture studio…
                  </div>
                }
              >
                <HubStudio hub={active} onClose={() => setStudioOpen(false)} />
              </Suspense>
            )}
            <div className="campus-map-top" inert={studioOpen}>
              <div className="campus-map-badge">
                <span />
                QU CAMPUS <span className="campus-badge-separator">/</span>{" "}
                PROPOSED QUbe NETWORK
              </div>
              <div
                className="campus-view-toggle"
                role="group"
                aria-label="Map perspective"
              >
                <button
                  aria-pressed={view === "3d"}
                  disabled={status !== "ready"}
                  onClick={() => setView("3d")}
                  className={view === "3d" ? "selected" : ""}
                >
                  <Box size={14} />
                  3D
                </button>
                <button
                  aria-pressed={view === "2d"}
                  disabled={status !== "ready"}
                  onClick={() => setView("2d")}
                  className={view === "2d" ? "selected" : ""}
                >
                  2D
                </button>
              </div>
            </div>
            <div className="campus-map-tools" inert={studioOpen}>
              <button
                aria-label="Zoom in on campus"
                disabled={status !== "ready"}
                onClick={() => mapRef.current?.zoomIn(mapMotion())}
              >
                <Plus size={19} />
              </button>
              <button
                aria-label="Zoom out on campus"
                disabled={status !== "ready"}
                onClick={() => mapRef.current?.zoomOut(mapMotion())}
              >
                <Minus size={19} />
              </button>
              <span />
              <button
                aria-label="Rotate map left"
                disabled={status !== "ready"}
                onClick={() =>
                  mapRef.current?.easeTo({
                    bearing: (mapRef.current?.getBearing() || 0) - 30,
                    ...mapMotion(),
                  })
                }
              >
                <RotateCcw size={17} />
              </button>
              <button
                aria-label="Rotate map right"
                disabled={status !== "ready"}
                onClick={() =>
                  mapRef.current?.easeTo({
                    bearing: (mapRef.current?.getBearing() || 0) + 30,
                    ...mapMotion(),
                  })
                }
              >
                <RotateCw size={17} />
              </button>
              <span />
              <button
                aria-label="Show all campus hubs"
                disabled={status !== "ready"}
                onClick={overview}
              >
                <Maximize size={17} />
              </button>
            </div>
            <div className="campus-map-bottom" inert={studioOpen}>
              <button
                className={`street-toggle ${streets ? "selected" : ""}`}
                aria-pressed={streets}
                disabled={status !== "ready"}
                onClick={() => setStreets(!streets)}
              >
                <Layers3 size={15} />
                {streets ? "Campus + streets" : "Add street map"}
              </button>
              <span className="campus-drag-hint">
                Drag to explore · Right-drag to rotate
              </span>
            </div>
            <div className="campus-experience-bar" inert={studioOpen}>
              <button className="campus-studio-launch" onClick={inspect}>
                <Box size={16} />
                <span>
                  Architecture studio<small>Explore the hub in detail</small>
                </span>
                <ArrowUpRight size={16} />
              </button>
              <div className="campus-experience-controls">
                <button
                  disabled={status !== "ready"}
                  aria-pressed={evening}
                  onClick={() => setEvening(!evening)}
                >
                  {evening ? <Moon size={15} /> : <Sun size={15} />}
                  <span>{evening ? "Evening" : "Daylight"}</span>
                </button>
                <button
                  disabled={status !== "ready" || filtered.length < 2}
                  aria-pressed={tour}
                  onClick={() => {
                    if (!tour) {
                      next();
                      setView("3d");
                    }
                    setTour(!tour);
                  }}
                >
                  {tour ? <Pause size={14} /> : <Play size={14} />}
                  <span>{tour ? "Pause tour" : "Tour campus"}</span>
                </button>
              </div>
            </div>
            {status === "fallback" && dataError && (
              <div className="campus-data-error">
                <p>
                  The campus outline couldn’t load. You can still explore every
                  proposal in the list.
                </p>
                <button onClick={() => setRetry(retry + 1)}>
                  Try loading again
                </button>
              </div>
            )}
          </div>
          <div className="campus-legend">
            <span>
              <i className="legend-proposed" />
              Proposed QUbe container
            </span>
            <span>
              <i className="legend-building" />
              Mapped campus building
            </span>
            <button
              onClick={() => setSourcesOpen(!sourcesOpen)}
              aria-expanded={sourcesOpen}
            >
              About this map <Info size={13} />
            </button>
          </div>
        </div>
      </div>
      <section
        className="campus-selected"
        aria-live="polite"
        aria-label="Selected proposed hub"
      >
        <div className="selected-hub-main">
          <span className="selected-hub-icon">
            {active.id === "metro" ? (
              <TrainFront size={27} />
            ) : (
              <GraduationCap size={29} />
            )}
          </span>
          <div>
            <span className="campus-proposed-tag">
              PROPOSED STOP {active.number} <span>·</span>{" "}
              {active.anchor === "mapped"
                ? "MAPPED LANDMARK NEARBY"
                : "APPROXIMATE COLLEGE AREA"}
            </span>
            <h2>
              {active.name}
              <span>.</span>
            </h2>
            <p className="selected-college">
              <MapPin size={14} />
              {active.college}
            </p>
            <p>{active.description}</p>
          </div>
        </div>
        <div className="selected-hub-actions">
          <button
            className="button"
            disabled={status !== "ready"}
            onClick={inspect}
          >
            Inspect the 3D containers <Box size={17} />
          </button>
          <div>
            <a
              href={googleLink(active)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Nearby landmark in Google Maps <ExternalLink size={13} />
            </a>
            <button onClick={next} disabled={filtered.length < 2}>
              Next stop <ArrowRight size={15} />
            </button>
          </div>
        </div>
        <div className="selected-hub-note">
          <Info size={14} />
          <p>
            {active.note} Models use standard container proportions;
            architecture and building heights are illustrative.
          </p>
        </div>
      </section>
      {sourcesOpen && (
        <section className="campus-sources">
          <h2>Real campus context. An imagined QUbe network.</h2>
          <p>
            The base uses an OpenStreetMap snapshot downloaded on 16 November
            2026. College names and building codes were checked against Qatar
            University’s published directories. Mapped landmarks and approximate
            college areas are labelled separately. Container footprints are
            proposed nearby and have not been surveyed for access, utilities,
            land ownership, or permissions. This is a campus concept, not a
            navigation or construction plan.
          </p>
          <div>
            {CAMPUS_SOURCES.map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.label}
                <ArrowUpRight size={14} />
              </a>
            ))}
          </div>
          <p>
            Map geometry © OpenStreetMap contributors, available under the{" "}
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Database License
            </a>
            . Building heights are approximate; map data may be incomplete or
            outdated.
          </p>
        </section>
      )}
      <div className="campus-booking-link">
        <div>
          <strong>Found a little inspiration?</strong>
          <p>
            Try a demo reservation at the original sample hub. These proposed
            campus stops aren’t separate bookable locations.
          </p>
        </div>
        <a className="button button-secondary" href="#/spaces">
          Explore demo spaces <ArrowUpRight size={17} />
        </a>
      </div>
    </main>
  );
}
