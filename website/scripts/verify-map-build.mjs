import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";

const assets = new URL("../dist/assets/", import.meta.url);
const files = readdirSync(assets);
const worker = files.find((name) => /^maplibre-gl-worker-.*\.js$/.test(name));
assert.ok(
  worker,
  "Production must emit the MapLibre worker asset; a missing worker makes the campus map disappear",
);
assert.ok(
  statSync(new URL(worker, assets)).size > 10000,
  "The map worker must be a bundled JavaScript asset",
);
const chunks = files.filter((name) => name.endsWith(".js") && name !== worker);
assert.ok(
  chunks.some((name) =>
    readFileSync(new URL(name, assets), "utf8").includes(worker),
  ),
  "A production JavaScript chunk must reference the emitted worker URL",
);
console.log(
  `✓ Map worker bundled and referenced: ${fileURLToPath(new URL(worker, assets))}`,
);
