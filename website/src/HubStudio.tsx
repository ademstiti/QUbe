import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Box,
  ChevronDown,
  Eye,
  Layers3,
  Maximize,
  Minus,
  Moon,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Sun,
  X,
} from "lucide-react";
import type { Hub } from "./campus";
import type { StudioController, StudioPreset } from "./hubStudioRuntime";
import { HubArt } from "./Artwork";
import "./hubStudio.css";

export default function HubStudio({
  hub,
  onClose,
}: {
  hub: Hub;
  onClose: () => void;
}) {
  const host = useRef<HTMLDivElement>(null),
    shell = useRef<HTMLDivElement>(null),
    controller = useRef<StudioController | null>(null);
  const [ready, setReady] = useState(false),
    [failed, setFailed] = useState(false),
    [evening, setEvening] = useState(false),
    [cutaway, setCutaway] = useState(false),
    [orbit, setOrbit] = useState(false),
    [preset, setPreset] = useState<StudioPreset>("perspective");
  useEffect(() => {
    let disposed = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const failure = () => {
      if (!disposed) {
        setFailed(true);
        setReady(false);
      }
    };
    const start = async () => {
      try {
        if (!window.WebGL2RenderingContext) {
          failure();
          return;
        }
        timer = setTimeout(failure, 18000);
        const { startHubStudio } = await import("./hubStudioRuntime");
        if (disposed || !host.current) return;
        controller.current = startHubStudio(
          host.current,
          () => {
            if (!disposed) {
              clearTimeout(timer);
              setReady(true);
              setFailed(false);
            }
          },
          failure,
        );
      } catch {
        failure();
      }
    };
    void start();
    return () => {
      disposed = true;
      clearTimeout(timer);
      controller.current?.dispose();
      controller.current = null;
    };
  }, []);
  useEffect(() => {
    controller.current?.setEvening(evening);
  }, [evening, ready]);
  useEffect(() => {
    controller.current?.setCutaway(cutaway);
  }, [cutaway, ready]);
  useEffect(() => {
    controller.current?.setOrbit(orbit);
  }, [orbit, ready]);
  function camera(value: StudioPreset) {
    setPreset(value);
    controller.current?.preset(value);
  }
  return (
    <div ref={shell} className={`hub-studio ${evening ? "is-evening" : ""}`}>
      <div ref={host} className="hub-studio-host" />
      {!ready && (
        <div className="hub-studio-placeholder">
          <HubArt />
          <span>
            {failed
              ? "This browser couldn’t start the architecture viewer. The campus map is still available."
              : "Preparing your little corner of campus…"}
          </span>
        </div>
      )}
      <div className="studio-top">
        <button className="studio-back" onClick={onClose}>
          <ArrowLeft size={16} />
          Back to campus
        </button>
        <span className="studio-mode-label">
          <Box size={13} />
          QUbe ARCHITECTURE STUDIO
        </span>
        <div className="studio-window-actions">
          {document.fullscreenEnabled && (
            <button
              className="studio-close"
              aria-label="Toggle fullscreen architecture view"
              onClick={() => {
                if (document.fullscreenElement) void document.exitFullscreen();
                else void shell.current?.requestFullscreen().catch(() => {});
              }}
            >
              <Maximize size={17} />
            </button>
          )}
          <button
            className="studio-close"
            aria-label="Close architecture studio"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
      </div>
      <div className="studio-title">
        <span>PROPOSED STOP {hub.number} · ARCHITECTURAL CONCEPT</span>
        <h2>
          A little room.
          <br />A better day<span>.</span>
        </h2>
        <p>
          {hub.name}
          <span> / </span>
          {hub.college}
        </p>
      </div>
      <div
        className="studio-environment"
        role="group"
        aria-label="Architecture lighting"
      >
        <button
          disabled={!ready}
          aria-pressed={!evening}
          className={!evening ? "selected" : ""}
          onClick={() => setEvening(false)}
        >
          <Sun size={15} />
          Daylight
        </button>
        <button
          disabled={!ready}
          aria-pressed={evening}
          className={evening ? "selected" : ""}
          onClick={() => setEvening(true)}
        >
          <Moon size={15} />
          Evening
        </button>
      </div>
      <div className="studio-tools">
        <button
          disabled={!ready}
          onClick={() => controller.current?.zoom(0.83)}
          aria-label="Zoom in on the architecture"
        >
          <Plus size={18} />
        </button>
        <button
          disabled={!ready}
          onClick={() => controller.current?.zoom(1.2)}
          aria-label="Zoom out from the architecture"
        >
          <Minus size={18} />
        </button>
        <span />
        <button
          disabled={!ready}
          onClick={() => camera("perspective")}
          aria-label="Reset architecture camera"
        >
          <RotateCcw size={17} />
        </button>
      </div>
      <div className="studio-bottom">
        <div className="studio-camera-bar">
          <div role="group" aria-label="Architecture camera angle">
            {(["perspective", "front", "top"] as StudioPreset[]).map((view) => (
              <button
                disabled={!ready}
                aria-pressed={preset === view}
                className={preset === view ? "selected" : ""}
                key={view}
                onClick={() => camera(view)}
              >
                {view === "perspective"
                  ? "Perspective"
                  : view === "front"
                    ? "Front view"
                    : "Top view"}
              </button>
            ))}
          </div>
          <span />
          <button
            disabled={!ready}
            className={cutaway ? "active" : ""}
            aria-pressed={cutaway}
            onClick={() => setCutaway(!cutaway)}
          >
            <Layers3 size={15} />
            {cutaway ? "Close roof" : "Open roof"}
          </button>
          <button
            disabled={!ready}
            className={orbit ? "active" : ""}
            aria-pressed={orbit}
            onClick={() => setOrbit(!orbit)}
          >
            {orbit ? <Pause size={14} /> : <Play size={14} />}
            <span>{orbit ? "Pause orbit" : "Auto orbit"}</span>
          </button>
        </div>
        <p className="studio-gesture">
          Drag to orbit · Scroll or pinch to zoom · Right-drag to pan
        </p>
      </div>
      <div className="studio-footnote">
        <span>3 repurposed modules · Planted courtyard · Shaded terrace</span>
        <span>
          Illustrative architecture. No facility or sustainability features
          confirmed.
        </span>
      </div>
    </div>
  );
}
