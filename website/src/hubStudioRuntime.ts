import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { buildHubArchitecture } from "./hubArchitecture";

export type StudioPreset = "perspective" | "front" | "top";
export type StudioController = {
  setEvening: (value: boolean) => void;
  setCutaway: (value: boolean) => void;
  setOrbit: (value: boolean) => void;
  preset: (value: StudioPreset) => void;
  zoom: (factor: number) => void;
  dispose: () => void;
};
export function startHubStudio(
  host: HTMLElement,
  onReady: () => void,
  onError: () => void,
): StudioController {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.className = "hub-studio-canvas";
  renderer.domElement.setAttribute(
    "aria-label",
    "Interactive 3D QUbe architecture model. Drag to rotate and pinch or scroll to zoom.",
  );
  renderer.domElement.tabIndex = 0;
  host.append(renderer.domElement);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#ececdf");
  scene.fog = new THREE.Fog("#ececdf", 65, 125);
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 180);
  camera.position.set(27, 20, 30);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 2, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.minDistance = 13;
  controls.maxDistance = 65;
  controls.maxPolarAngle = Math.PI * 0.485;
  controls.minPolarAngle = 0.06;
  controls.enablePan = true;
  controls.panSpeed = 0.65;
  controls.autoRotateSpeed = 0.45;
  const model = buildHubArchitecture();
  scene.add(model.group);
  const signCanvas = document.createElement("canvas");
  signCanvas.width = 1024;
  signCanvas.height = 320;
  const signContext = signCanvas.getContext("2d")!;
  signContext.fillStyle = "#174e3b";
  signContext.fillRect(0, 0, 1024, 320);
  signContext.fillStyle = "#f2f1dd";
  signContext.font = "750 180px sans-serif";
  signContext.textAlign = "center";
  signContext.fillText("QUbe.", 512, 208);
  signContext.fillStyle = "#b8cda8";
  signContext.font = "23px sans-serif";
  signContext.fillText("YOUR SPACE BETWEEN CLASSES", 512, 268);
  const signTexture = new THREE.CanvasTexture(signCanvas);
  signTexture.colorSpace = THREE.SRGBColorSpace;
  const signMaterial = new THREE.MeshBasicMaterial({ map: signTexture });
  const signGeometry = new THREE.PlaneGeometry(2.6, 0.8);
  const sign = new THREE.Mesh(signGeometry, signMaterial);
  sign.position.set(-5.5, 2.83, 3.49);
  model.group.add(sign);
  const planeGeometry = new THREE.PlaneGeometry(180, 180);
  const planeMaterial = new THREE.MeshStandardMaterial({
    color: "#e5e5d5",
    roughness: 1,
  });
  const ground = new THREE.Mesh(planeGeometry, planeMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.34;
  ground.receiveShadow = true;
  scene.add(ground);
  const hemi = new THREE.HemisphereLight("#f6f7ee", "#7a8166", 2.1);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight("#fff1da", 3.2);
  sun.position.set(-18, 27, 16);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -23;
  sun.shadow.camera.right = 23;
  sun.shadow.camera.top = 23;
  sun.shadow.camera.bottom = -23;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 90;
  sun.shadow.normalBias = 0.025;
  sun.shadow.bias = -0.00015;
  sun.shadow.radius = 4;
  scene.add(sun);
  const fill = new THREE.DirectionalLight("#dcece6", 0.6);
  fill.position.set(15, 9, -20);
  scene.add(fill);
  const lights: THREE.PointLight[] = [];
  for (const [x, z] of [
    [-3, 2.7],
    [3, 2.7],
    [-3, -2.5],
    [3, -2.5],
    [0, -2.5],
    [0, 0.2],
  ]) {
    const light = new THREE.PointLight("#ffd19b", 0, 8, 2);
    light.position.set(x, z === -2.5 ? 5 : 2.7, z);
    scene.add(light);
    lights.push(light);
  }
  const environment = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environmentTarget = pmrem.fromScene(environment, 0.04);
  scene.environment = environmentTarget.texture;
  scene.environmentIntensity = 0.35;
  environment.dispose();
  pmrem.dispose();
  // A small repeatable grain texture adds tactile detail without image requests.
  const pixels = new Uint8Array(64 * 64 * 4);
  let seed = 71;
  for (let y = 0; y < 64; y++)
    for (let x = 0; x < 64; x++) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      const v = 125 + ((seed >>> 24) % 30) + Math.sin(x * 0.6 + y * 0.07) * 14;
      const i = (y * 64 + x) * 4;
      pixels[i] = pixels[i + 1] = pixels[i + 2] = v;
      pixels[i + 3] = 255;
    }
  const grain = new THREE.DataTexture(pixels, 64, 64, THREE.RGBAFormat);
  grain.wrapS = grain.wrapT = THREE.RepeatWrapping;
  grain.repeat.set(3, 1);
  grain.needsUpdate = true;
  for (const key of ["deck", "timber", "stone"]) {
    model.materials[key].bumpMap = grain;
    model.materials[key].bumpScale = key === "stone" ? 0.015 : 0.035;
  }
  let disposed = false,
    dirty = true,
    orbit = false,
    transition: {
      start: number;
      from: THREE.Vector3;
      to: THREE.Vector3;
      targetFrom: THREE.Vector3;
      targetTo: THREE.Vector3;
    } | null = null;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function resize() {
    dirty = true;
    const width = Math.max(host.clientWidth, 1),
      height = Math.max(host.clientHeight, 1);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.fov =
      camera.aspect < 1.25
        ? THREE.MathUtils.radToDeg(
            2 *
              Math.atan(
                (Math.tan(THREE.MathUtils.degToRad(18)) * 1.25) / camera.aspect,
              ),
          )
        : 36;
    camera.updateProjectionMatrix();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();
  function move(position: THREE.Vector3, target: THREE.Vector3) {
    dirty = true;
    if (reduced) {
      camera.position.copy(position);
      controls.target.copy(target);
      controls.update();
    } else
      transition = {
        start: performance.now(),
        from: camera.position.clone(),
        to: position,
        targetFrom: controls.target.clone(),
        targetTo: target,
      };
  }
  const handleStart = () => {
    transition = null;
  };
  controls.addEventListener("start", handleStart);
  const lost = (e: Event) => {
    e.preventDefault();
    if (!disposed) { renderer.setAnimationLoop(null); onError(); }
  };
  renderer.domElement.addEventListener("webglcontextlost", lost);
  let first = true,
    last = performance.now();
  renderer.setAnimationLoop(() => {
    if (disposed || document.hidden) return;
    const now = performance.now(),
      delta = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (transition) {
      const t = Math.min((now - transition.start) / 1100, 1),
        ease = 1 - Math.pow(1 - t, 3);
      camera.position.lerpVectors(transition.from, transition.to, ease);
      controls.target.lerpVectors(
        transition.targetFrom,
        transition.targetTo,
        ease,
      );
      if (t === 1) transition = null;
    }
    controls.autoRotate = orbit && !transition;
    const changed = controls.update(delta);
    if (changed || transition || controls.autoRotate || dirty || first) {
      renderer.render(scene, camera);
      dirty = false;
    }
    if (first) {
      first = false;
      onReady();
    }
  });
  return {
    setEvening(value) {
      dirty = true;
      const bg = value ? "#23352f" : "#ececdf";
      scene.background = new THREE.Color(bg);
      scene.fog = new THREE.Fog(bg, 65, 125);
      planeMaterial.color.set(value ? "#425044" : "#e5e5d5");
      hemi.intensity = value ? 0.65 : 2.1;
      sun.intensity = value ? 0.6 : 3.2;
      sun.color.set(value ? "#adc9d4" : "#fff1da");
      scene.environmentIntensity = value ? 0.12 : 0.35;
      model.materials.glow.emissiveIntensity = value ? 4 : 0.35;
      lights.forEach((light) => (light.intensity = value ? 26 : 0));
    },
    setCutaway(value) {
      dirty = true;
      renderer.shadowMap.needsUpdate = true;
      model.zones.roof.visible = !value;
      model.zones.solar.visible = !value;
      model.materials.glass.opacity = value ? 0.08 : 0.34;
    },
    setOrbit(value) {
      orbit = value;
    },
    preset(value) {
      const p =
        value === "front"
          ? new THREE.Vector3(1, 8, 36)
          : value === "top"
            ? new THREE.Vector3(0.1, 44, 0.1)
            : new THREE.Vector3(27, 20, 30);
      move(p, new THREE.Vector3(0, value === "top" ? 0 : 2, 0));
    },
    zoom(factor) {
      const direction = camera.position.clone().sub(controls.target);
      const distance = THREE.MathUtils.clamp(
        direction.length() * factor,
        13,
        65,
      );
      move(
        controls.target
          .clone()
          .add(direction.normalize().multiplyScalar(distance)),
        controls.target.clone(),
      );
    },
    dispose() {
      disposed = true;
      observer.disconnect();
      renderer.setAnimationLoop(null);
      controls.removeEventListener("start", handleStart);
      controls.dispose();
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      model.dispose();
      signTexture.dispose();
      signMaterial.dispose();
      planeGeometry.dispose();
      planeMaterial.dispose();
      environmentTarget.dispose();
      grain.dispose();
      sun.shadow.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
