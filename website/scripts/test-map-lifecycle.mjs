import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { Window } from "happy-dom";
import { createServer } from "vite";

// Exercise the React loading/error transitions without pretending to render GL.
const window = new Window({ url: "http://localhost/#/campus" });
// Production loads campus CSS first, then MapLibre CSS on demand. MapLibre
// adds .maplibregl-map { position: relative; overflow: hidden }, which must
// never override the sized, absolutely positioned campus map host.
for (const file of [
  "../src/campus.css",
  "../node_modules/maplibre-gl/dist/maplibre-gl.css",
]) {
  const style = window.document.createElement("style");
  style.textContent = readFileSync(new URL(file, import.meta.url), "utf8");
  window.document.head.append(style);
}
for (const key of [
  "window",
  "document",
  "navigator",
  "HTMLElement",
  "HTMLDialogElement",
  "Node",
  "Event",
  "MouseEvent",
]) {
  Object.defineProperty(globalThis, key, {
    configurable: true,
    value: window[key],
  });
}
Object.defineProperty(window, "WebGL2RenderingContext", {
  configurable: true,
  value: class {},
});
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const data = readFileSync(
  new URL("../public/campus/qatar-university.geojson", import.meta.url),
  "utf8",
);
const originalFetch = globalThis.fetch;
globalThis.fetch = async () => new Response(data, { status: 200 });
const errors = [];
const originalError = console.error;
console.error = (...args) => errors.push(args.join(" "));

class TestMap {
  static instances = [];
  constructor(options) {
    this.options = options;
    this.events = new Map();
    this.sources = new Map();
    this.removed = false;
    options.container.classList.add("maplibregl-map");
    this.canvas = document.createElement("canvas");
    options.container.append(this.canvas);
    for (const id of Object.keys(options.style.sources))
      this.sources.set(id, { setData() {} });
    TestMap.instances.push(this);
  }
  on(type, layerOrCallback, callback) {
    if (!this.events.has(type)) this.events.set(type, []);
    this.events.get(type).push(callback || layerOrCallback);
    return this;
  }
  emit(type, event = {}) {
    for (const fn of this.events.get(type) || []) fn(event);
  }
  addControl() {
    return this;
  }
  getCanvas() {
    return this.canvas;
  }
  getSource(id) {
    return this.sources.get(id);
  }
  easeTo() {
    return this;
  }
  setLayoutProperty() {
    return this;
  }
  setPaintProperty() {
    return this;
  }
  setLight() {
    return this;
  }
  setFilter() {
    return this;
  }
  resize() {
    return this;
  }
  remove() {
    this.removed = true;
    this.canvas.remove();
  }
}
class TestMarker {
  constructor(options) {
    this.element = options.element;
  }
  setLngLat() {
    return this;
  }
  addTo(map) {
    map.options.container.append(this.element);
    return this;
  }
  getElement() {
    return this.element;
  }
  remove() {
    this.element.remove();
  }
}
globalThis.__qubeMapTestRuntime = {
  Map: TestMap,
  Marker: TestMarker,
  AttributionControl: class {},
  ScaleControl: class {},
};
const server = await createServer({
  server: { middlewareMode: true, hmr: false },
  appType: "custom",
  plugins: [
    {
      name: "map-runtime-test-double",
      enforce: "pre",
      resolveId(id) {
        if (id === "./mapRuntime") return "\0qube-test-runtime";
      },
      load(id) {
        if (id === "\0qube-test-runtime")
          return "export const maplibre=globalThis.__qubeMapTestRuntime;";
      },
    },
  ],
});
const React = await import("react");
const { createRoot } = await import("react-dom/client");
const { default: CampusMap } = await server.ssrLoadModule("/src/CampusMap.tsx");
const host = document.createElement("div");
document.body.append(host);
let root = createRoot(host);
async function action(work) {
  await React.act(async () => {
    work();
    await new Promise((resolve) => setTimeout(resolve, 20));
  });
}
async function mount() {
  await action(() =>
    root.render(
      React.createElement(
        React.StrictMode,
        null,
        React.createElement(CampusMap),
      ),
    ),
  );
  for (let i = 0; i < 30 && !TestMap.instances.some((m) => !m.removed); i++)
    await action(() => {});
  const map = TestMap.instances.find((m) => !m.removed);
  assert.ok(map, "Map runtime should initialize");
  return map;
}
async function reset() {
  await action(() => root.unmount());
  root = createRoot(host);
  TestMap.instances = [];
}
try {
  let map = await mount();
  const mapLayout = window.getComputedStyle(map.options.container);
  assert.equal(
    mapLayout.position,
    "absolute",
    "Lazy MapLibre CSS must not collapse the map container",
  );
  assert.equal(
    mapLayout.height,
    "100%",
    "The map must fill the stage height after MapLibre styles load",
  );
  assert.equal(
    mapLayout.width,
    "100%",
    "The map must fill the stage width after MapLibre styles load",
  );
  console.log(
    "✓ Production stylesheet order preserves a full-size map container",
  );
  assert.ok(map.options.style.sources.campus.data.features.length > 1000);
  assert.ok(map.options.style.sources.containers.data.features.length > 0);
  assert.ok(
    document.querySelector(".campus-fallback"),
    "The preview must remain visible while the actual map loads",
  );
  await action(() => map.emit("load"));
  assert.equal(
    document.querySelector(".campus-fallback"),
    null,
    "A fully loaded campus replaces the preview",
  );
  assert.equal(document.querySelectorAll(".hub-pin").length, 13);
  await action(() =>
    map.emit("error", { error: new Error("Worker failed to start") }),
  );
  assert.ok(
    document.querySelector(".campus-fallback"),
    "A worker error must restore the map preview",
  );
  assert.ok(document.querySelectorAll(".campus-fallback path").length > 1000);
  console.log(
    "✓ Preview remains visible until the full campus loads and returns after a worker failure",
  );
  await reset();
  map = await mount();
  await action(() =>
    map.emit("error", { error: new Error("Source could not load") }),
  );
  await action(() => map.emit("load"));
  assert.ok(
    document.querySelector(".campus-fallback"),
    "A late load event must not hide the fallback after startup failed",
  );
  console.log(
    "✓ Startup errors and late load events cannot leave an empty canvas",
  );
  await reset();
  map = await mount();
  await action(() => map.emit("load"));
  await action(() =>
    map.emit("error", {
      sourceId: "streets",
      error: new Error("Optional street tile failed"),
    }),
  );
  assert.equal(
    document.querySelector(".campus-fallback"),
    null,
    "Optional street errors must not hide the campus",
  );
  await action(() =>
    map
      .getCanvas()
      .dispatchEvent(
        new window.Event("webglcontextlost", { cancelable: true }),
      ),
  );
  assert.ok(
    document.querySelector(".campus-fallback"),
    "Graphics context loss must restore the preview",
  );
  console.log(
    "✓ Optional street failures preserve the campus and graphics context loss restores the preview",
  );
  assert.deepEqual(errors, [], "No React errors should be logged");
} finally {
  await React.act(() => root.unmount());
  await server.close();
  await window.happyDOM.close();
  globalThis.fetch = originalFetch;
  console.error = originalError;
  delete globalThis.__qubeMapTestRuntime;
}
