import assert from "node:assert/strict";
import { Window } from "happy-dom";
import { createServer } from "vite";
import { readFileSync } from "node:fs";
import { validateStyleMin } from "@maplibre/maplibre-gl-style-spec";

// A DOM integration check, without launching or controlling a browser.
const window = new Window({ url: "http://localhost/#/home" });
for (const key of [
  "window",
  "document",
  "navigator",
  "localStorage",
  "HTMLElement",
  "HTMLDialogElement",
  "Node",
  "Event",
  "MouseEvent",
  "getComputedStyle",
]) {
  Object.defineProperty(globalThis, key, {
    configurable: true,
    value:
      key === "getComputedStyle"
        ? window.getComputedStyle.bind(window)
        : window[key],
  });
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const errors = [];
const originalError = console.error;
console.error = (...args) => {
  errors.push(args.join(" "));
  originalError(...args);
};
const server = await createServer({
  server: { middlewareMode: true, hmr: false },
  appType: "custom",
});
const React = await import("react");
const { createRoot } = await import("react-dom/client");
const { default: App } = await server.ssrLoadModule("/src/App.tsx");
const { STORE_KEY, qatarToday } = await server.ssrLoadModule("/src/booking.ts");
const { HUBS, containerModels } = await server.ssrLoadModule("/src/campus.ts");
const { campusBaseStyle, addCampusLayers, createCampusStyle } =
  await server.ssrLoadModule("/src/campusScene.ts");
const campusData = JSON.parse(
  readFileSync(
    new URL("../public/campus/qatar-university.geojson", import.meta.url),
    "utf8",
  ),
);
const originalFetch = globalThis.fetch;
globalThis.fetch = async (url, options) =>
  typeof url === "string" && url.endsWith("campus/qatar-university.geojson")
    ? new Response(JSON.stringify(campusData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    : originalFetch(url, options);
const visitDate = qatarToday(new Date(Date.now() + 86400000));
const rootElement = document.createElement("div");
document.body.append(rootElement);
let root = createRoot(rootElement);
const flush = () => new Promise((resolve) => setTimeout(resolve, 20));
const text = () => rootElement.textContent;
async function action(fn) {
  await React.act(async () => {
    fn();
    await flush();
  });
}
async function route(path) {
  await action(() => {
    window.location.hash = `/${path}`;
  });
}
function button(label) {
  const match = [...document.querySelectorAll("button")].find(
    (b) => b.textContent.trim() === label,
  );
  assert.ok(match, `Missing button: ${label}`);
  return match;
}
function saved() {
  return JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
}
try {
  const scene = structuredClone(campusBaseStyle);
  addCampusLayers(
    {
      addSource(id, source) {
        scene.sources[id] = source;
      },
      addLayer(layer) {
        scene.layers.push(layer);
      },
    },
    campusData,
  );
  assert.deepEqual(
    validateStyleMin(scene).map((error) => error.message),
    [],
    "The 3D map style must pass MapLibre's schema and expression validation",
  );
  const initialScene = createCampusStyle(campusData);
  assert.deepEqual(
    initialScene,
    scene,
    "The initial map style must already contain campus sources and 3D layers before its load event",
  );
  assert.equal(HUBS.length, 13);
  assert.equal(HUBS.filter((h) => h.id !== "metro").length, 12);
  assert.equal(new Set(HUBS.map((h) => h.college)).size, 13);
  assert.ok(campusData.features.length > 1000);
  const models = containerModels();
  for (const hub of HUBS) {
    const parts = models.features.filter((f) => f.properties.hubId === hub.id);
    assert.equal(
      parts.filter((f) => f.properties.part === "container").length,
      3,
    );
    for (const part of parts) {
      assert.ok(part.properties.height > part.properties.base);
      assert.deepEqual(
        part.geometry.coordinates[0][0],
        part.geometry.coordinates[0].at(-1),
      );
    }
  }
  console.log(
    "✓ Campus scene validates with real map geometry, all 12 colleges, metro, and 13 complete 3D container clusters",
  );
  await action(() => root.render(React.createElement(App)));
  assert.match(text(), /Make the most/);
  assert.equal(document.querySelectorAll(".need-tile").length, 4);
  console.log("✓ Home renders four needs and original architecture");
  await route("spaces");
  assert.equal(document.querySelectorAll(".space-card").length, 4);
  await action(() => button("Group").click());
  assert.equal(document.querySelectorAll(".space-card").length, 1);
  assert.match(
    document.querySelector(".space-card").textContent,
    /Group Study Room/,
  );
  console.log("✓ Category filters change the listing");
  await route("spaces/group");
  await action(() => {
    const date = document.querySelector("input[type=date]");
    // Select React's controlled input through its native setter.
    Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value",
    ).set.call(date, visitDate);
    date.dispatchEvent(new window.Event("input", { bubbles: true }));
    date.dispatchEvent(new window.Event("change", { bubbles: true }));
  });
  await action(() => {
    const duration = document.querySelector('select[aria-label="Duration"]');
    duration.value = "120";
    duration.dispatchEvent(new window.Event("change", { bubbles: true }));
  });
  assert.match(document.querySelector(".booking-total").textContent, /QAR 50/);
  for (let i = 0; i < 3; i++)
    await action(() =>
      document.querySelector('button[aria-label="One more person"]').click(),
    );
  assert.equal(document.querySelector(".stepper output").textContent, "4");
  assert.equal(
    document.querySelector('button[aria-label="One more person"]').disabled,
    true,
  );
  console.log("✓ Duration changes total and party size stops at four");
  await action(() => button("Reserve This Space").click());
  assert.ok(document.querySelector("dialog[open]"));
  await action(() =>
    document
      .querySelector("dialog form")
      .dispatchEvent(
        new window.Event("submit", { bubbles: true, cancelable: true }),
      ),
  );
  assert.equal(saved().length, 1);
  assert.equal(saved()[0].unit, "GROUP-01");
  assert.equal(saved()[0].price, 50);
  assert.equal(saved()[0].partySize, 4);
  assert.equal(saved()[0].date, visitDate);
  assert.match(text(), /You’ve made room for you/);
  assert.ok(
    document
      .querySelector(".pass-reference")
      .textContent.includes(saved()[0].reference),
  );
  console.log("✓ Review form saves a confirmed booking and opens its pass");
  await route("bookings");
  assert.equal(document.querySelectorAll(".booking-card").length, 1);
  await action(() => root.unmount());
  root = createRoot(rootElement);
  await action(() => root.render(React.createElement(App)));
  assert.equal(document.querySelectorAll(".booking-card").length, 1);
  assert.match(text(), /QAR 50/);
  console.log("✓ My Bookings survives an application reload");
  await route(`pass/${saved()[0].id}`);
  assert.match(text(), /GROUP-01/);
  assert.ok(document.querySelector(".pass-qr"));
  console.log("✓ Saved pass can be reopened by its route");
  await route("bookings");
  await action(() => button("Cancel Booking").click());
  assert.match(
    document.querySelector("dialog").textContent,
    /A change of plans/,
  );
  await action(() =>
    [...document.querySelectorAll("dialog button")]
      .find((b) => b.textContent === "Cancel Booking")
      .click(),
  );
  assert.equal(saved()[0].status, "cancelled");
  assert.equal(document.querySelectorAll(".booking-card").length, 0);
  await action(() =>
    [...document.querySelectorAll(".bookings-tabs button")]
      .find((b) => b.textContent.startsWith("Cancelled"))
      .click(),
  );
  assert.equal(document.querySelectorAll(".booking-card").length, 1);
  console.log(
    "✓ Cancellation confirmation persists and moves booking to history",
  );
  for (const category of ["rest", "focus", "shower"]) {
    await route(`spaces/${category}`);
    assert.equal(button("Reserve This Space").disabled, false);
    await action(() => button("Reserve This Space").click());
    await action(() =>
      document
        .querySelector("dialog form")
        .dispatchEvent(
          new window.Event("submit", { bubbles: true, cancelable: true }),
        ),
    );
    assert.equal(saved().at(-1).category, category);
    assert.equal(saved().at(-1).price, category === "rest" ? 15 : 10);
    assert.match(text(), /You’ve made room for you/);
  }
  console.log(
    "✓ All four space types complete reservations with correct prices",
  );
  const savedBeforeMap = localStorage.getItem(STORE_KEY);
  await route("campus");
  for (
    let attempt = 0;
    attempt < 40 && !document.querySelector(".campus-hub");
    attempt++
  )
    await action(() => {});
  assert.equal(document.querySelectorAll(".campus-hub").length, 13);
  assert.match(
    document.querySelector(".campus-proposal-note").textContent,
    /illustrative proposals/,
  );
  assert.match(
    document.querySelector(".fallback-notice").textContent,
    /2D campus view/,
  );
  await action(() =>
    [...document.querySelectorAll(".campus-hub")]
      .find((b) => b.textContent.includes("College of Engineering"))
      .click(),
  );
  assert.match(
    document.querySelector(".campus-selected").textContent,
    /The Ideas Yard/,
  );
  assert.ok(
    document
      .querySelector('.campus-selected a[target="_blank"]')
      .href.includes("25.379"),
  );
  await action(() =>
    [...document.querySelectorAll(".campus-filter button")]
      .find((b) => b.textContent === "Health")
      .click(),
  );
  assert.equal(document.querySelectorAll(".campus-hub").length, 5);
  await action(() => button("About this map").click());
  assert.ok(document.querySelector('.campus-sources a[href*="openstreetmap"]'));
  await action(() => {
    const search = document.querySelector(".campus-search input");
    Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value",
    ).set.call(search, "no-college-matches-this");
    search.dispatchEvent(new window.Event("input", { bubbles: true }));
  });
  assert.ok(document.querySelector(".campus-no-results"));
  await action(() => button("Show all stops").click());
  assert.equal(document.querySelectorAll(".campus-hub").length, 13);
  assert.equal(localStorage.getItem(STORE_KEY), savedBeforeMap);
  console.log(
    "✓ Campus navigation, selection, filters, search empty state, sources, Google Maps link, and 2D fallback work without changing bookings",
  );
  assert.deepEqual(errors, [], "No React errors should be logged");
  console.log("Journey passed without React errors.");
} finally {
  await React.act(() => root.unmount());
  await server.close();
  await window.happyDOM.close();
  console.error = originalError;
  globalThis.fetch = originalFetch;
}
