import * as maplibre from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import "maplibre-gl/dist/maplibre-gl.css";

// MapLibre 6's default sibling worker URL is not emitted by Vite. This query
// bundles a self-contained, hashed worker asset and gives MapLibre its URL.
maplibre.setWorkerUrl(workerUrl);

export { maplibre };
