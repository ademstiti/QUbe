import assert from "node:assert/strict";
import * as THREE from "three";
import { Window } from "happy-dom";
import { createServer } from "vite";
import { buildHubArchitecture } from "../src/hubArchitecture.ts";

const model = buildHubArchitecture();
model.group.updateMatrixWorld(true);
const bounds = new THREE.Box3().setFromObject(model.group);
const size = bounds.getSize(new THREE.Vector3());
assert.ok(
  size.x > 20 &&
    size.x < 32 &&
    size.y > 6 &&
    size.y < 10 &&
    size.z > 15 &&
    size.z < 25,
  "Model dimensions should stay within a credible container courtyard",
);
let meshes = 0,
  vertices = 0;
model.group.traverse((object) => {
  if (!object.isMesh) return;
  meshes++;
  const position = object.geometry.attributes.position;
  vertices += position.count;
  for (let i = 0; i < position.array.length; i++)
    assert.ok(
      Number.isFinite(position.array[i]),
      "Model vertices must be finite",
    );
});
assert.ok(
  meshes < 70,
  "Merged materials should keep the detailed model inexpensive to draw",
);
assert.ok(
  vertices > 10000,
  "Detailed architecture should include interiors and landscape geometry",
);
for (const zone of Object.values(model.zones))
  assert.ok(
    zone.children.length,
    "Every architectural zone must contain geometry",
  );
assert.equal(model.materials.glass.transparent, true);
assert.equal(model.group.userData.containerCount, 3);
const ray = new THREE.Raycaster(
  new THREE.Vector3(0, 16, 0),
  new THREE.Vector3(0, -1, 0),
);
assert.ok(ray.intersectObject(model.group, true).length > 0);
console.log(
  `✓ Architecture geometry: ${meshes} merged meshes, ${vertices} finite vertices, seven zones, and valid container proportions`,
);
model.dispose();

const window = new Window({ url: "http://localhost/#/campus" });
for (const key of [
  "window",
  "document",
  "navigator",
  "HTMLElement",
  "Node",
  "Event",
  "MouseEvent",
])
  Object.defineProperty(globalThis, key, {
    configurable: true,
    value: window[key],
  });
Object.defineProperty(window, "WebGL2RenderingContext", {
  configurable: true,
  value: class {},
});
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const calls = [];
let disposed = false,
  closed = false;
globalThis.__qubeStudioTest = {
  startHubStudio(host, onReady) {
    const canvas = document.createElement("canvas");
    host.append(canvas);
    setTimeout(onReady, 0);
    return {
      setEvening: (v) => calls.push(["evening", v]),
      setCutaway: (v) => calls.push(["cutaway", v]),
      setOrbit: (v) => calls.push(["orbit", v]),
      preset: (v) => calls.push(["preset", v]),
      zoom: (v) => calls.push(["zoom", v]),
      dispose() {
        disposed = true;
        canvas.remove();
      },
    };
  },
};
const server = await createServer({
  server: { middlewareMode: true, hmr: false },
  appType: "custom",
  plugins: [
    {
      name: "studio-runtime-test-double",
      enforce: "pre",
      resolveId(id) {
        if (id === "./hubStudioRuntime") return "\0qube-studio-test-runtime";
      },
      load(id) {
        if (id === "\0qube-studio-test-runtime")
          return "export const startHubStudio=globalThis.__qubeStudioTest.startHubStudio;";
      },
    },
  ],
});
const React = await import("react");
const { createRoot } = await import("react-dom/client");
const { default: HubStudio } = await server.ssrLoadModule("/src/HubStudio.tsx");
const { HUBS } = await server.ssrLoadModule("/src/campus.ts");
const element = document.createElement("div");
document.body.append(element);
const root = createRoot(element);
async function action(work) {
  await React.act(async () => {
    work();
    await new Promise((r) => setTimeout(r, 20));
  });
}
function button(label) {
  const value = [...element.querySelectorAll("button")].find(
    (b) =>
      b.textContent.trim() === label || b.getAttribute("aria-label") === label,
  );
  assert.ok(value, `Missing studio control: ${label}`);
  return value;
}
try {
  await action(() =>
    root.render(
      React.createElement(HubStudio, {
        hub: HUBS[0],
        onClose: () => (closed = true),
      }),
    ),
  );
  for (let i = 0; i < 40 && button("Evening").disabled; i++)
    await action(() => {});
  assert.equal(button("Evening").disabled, false);
  assert.ok(
    element.querySelector("dialog.hub-studio[open]"),
    "Architecture should open in its own screen-filling modal",
  );
  assert.equal(document.body.style.overflow, "hidden");
  await action(() => button("Evening").click());
  assert.ok(calls.some(([key, v]) => key === "evening" && v === true));
  await action(() => button("Open roof").click());
  assert.ok(calls.some(([key, v]) => key === "cutaway" && v === true));
  assert.ok(button("Close roof"));
  await action(() => button("Auto orbit").click());
  assert.ok(calls.some(([key, v]) => key === "orbit" && v === true));
  await action(() => button("Front view").click());
  assert.ok(calls.some(([key, v]) => key === "preset" && v === "front"));
  await action(() => button("Top view").click());
  assert.ok(calls.some(([key, v]) => key === "preset" && v === "top"));
  await action(() => button("Full site").click());
  assert.ok(calls.some(([key, v]) => key === "preset" && v === "site"));
  await action(() => button("Zoom in on the architecture").click());
  assert.ok(calls.some(([key, v]) => key === "zoom" && v < 1));
  await action(() => button("Back to campus").click());
  assert.equal(closed, true);
  await action(() => root.unmount());
  assert.equal(disposed, true);
  assert.notEqual(document.body.style.overflow, "hidden");
  console.log(
    "✓ Studio lighting, cutaway, orbit, camera angles, zoom, close, and GPU cleanup controls are wired correctly",
  );
} finally {
  if (!disposed) await React.act(() => root.unmount());
  await server.close();
  await window.happyDOM.close();
  delete globalThis.__qubeStudioTest;
}
