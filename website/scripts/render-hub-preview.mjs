import { Window } from "happy-dom";
import { writeFileSync } from "node:fs";
import * as THREE from "three";
import { SVGRenderer } from "three/addons/renderers/SVGRenderer.js";
import { Resvg } from "@resvg/resvg-js";
import { buildHubArchitecture } from "../src/hubArchitecture.ts";

// Software architectural preview for checking geometry and composition. This
// does not substitute for a WebGL browser check of lighting and interaction.
const window = new Window();
globalThis.document = window.document;
globalThis.window = window;
const model = buildHubArchitecture();
const scene = new THREE.Scene();
scene.background = new THREE.Color("#e8e9df");
scene.add(model.group);
scene.add(new THREE.AmbientLight("#ffffff", 0.65));
const light = new THREE.DirectionalLight("#fff4dc", 0.8);
light.position.set(-18, 27, 16);
scene.add(light);
const camera = new THREE.PerspectiveCamera(36, 1.4, 0.1, 180);
camera.position.set(27, 20, 30);
camera.lookAt(0, 2, 0);
const renderer = new SVGRenderer();
renderer.setSize(1400, 1000);
renderer.setQuality("high");
renderer.domElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
for (const cutaway of [false, true]) {
  model.zones.roof.visible = !cutaway;
  model.zones.solar.visible = !cutaway;
  renderer.render(scene, camera);
  const svg = renderer.domElement.outerHTML;
  const path = `/tmp/qube-hub-${cutaway ? "cutaway" : "perspective"}.png`;
  writeFileSync(
    path,
    new Resvg(svg, { background: "#e8e9df" }).render().asPng(),
  );
  console.log(path);
}
model.dispose();
await window.happyDOM.close();
