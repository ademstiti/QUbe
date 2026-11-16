import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

export type HubZone =
  | "structure"
  | "roof"
  | "glass"
  | "interior"
  | "terrace"
  | "landscape"
  | "solar";
export type HubArchitecture = {
  group: THREE.Group;
  materials: Record<string, THREE.MeshStandardMaterial>;
  zones: Record<HubZone, THREE.Group>;
  dispose: () => void;
};

// Original architectural concept. Geometry is in metres, using standard
// 40-foot container proportions; interiors and landscaping are illustrative.
export function buildHubArchitecture(): HubArchitecture {
  const group = new THREE.Group();
  group.name = "QUbe architectural concept";
  const materials: Record<string, THREE.MeshStandardMaterial> = {};
  const material = (
    name: string,
    color: string,
    roughness = 0.7,
    metalness = 0,
  ) =>
    (materials[name] = new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness,
    }));
  material("forest", "#174e3b", 0.55, 0.28);
  material("sage", "#78917a", 0.65, 0.18);
  material("ivory", "#e7dfca", 0.78, 0.12);
  material("trim", "#263e34", 0.4, 0.45);
  material("timber", "#b59b74", 0.86);
  material("deck", "#cab491", 0.86);
  material("stone", "#e5dfd1", 0.95);
  material("gravel", "#c8c7b3", 1);
  material("white", "#f4efe2", 0.85);
  material("seat", "#b4b99b", 0.95);
  material("linen", "#e8dcc0", 0.98);
  material("leaf", "#557650", 0.91);
  material("leafLight", "#7c9660", 0.9);
  material("trunk", "#9b8260", 1);
  material("metal", "#515c51", 0.5, 0.55);
  material("solar", "#274952", 0.28, 0.45);
  material("cell", "#45717a", 0.3, 0.4);
  material("water", "#b1c9c0", 0.25, 0.1);
  material("terracotta", "#b99170", 0.9);
  material("skin", "#bb916e", 0.95);
  material("shirt", "#d2b286", 0.95);
  material("pants", "#455548", 0.9);
  materials.glass = new THREE.MeshStandardMaterial({
    color: "#b5d8cf",
    roughness: 0.12,
    metalness: 0.14,
    transparent: true,
    opacity: 0.34,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  materials.glow = new THREE.MeshStandardMaterial({
    color: "#ffdeb1",
    emissive: "#ffd49b",
    emissiveIntensity: 0.35,
    roughness: 0.5,
  });
  const zones = {} as Record<HubZone, THREE.Group>;
  for (const name of [
    "structure",
    "roof",
    "glass",
    "interior",
    "terrace",
    "landscape",
    "solar",
  ] as HubZone[]) {
    const zone = new THREE.Group();
    zone.name = name;
    zones[name] = zone;
    group.add(zone);
  }
  const batches = new Map<string, THREE.BufferGeometry[]>();
  function geometry(
    shape: THREE.BufferGeometry,
    mat: string,
    zone: HubZone,
    x: number,
    y: number,
    z: number,
    rotation?: THREE.Euler,
  ) {
    const transform = new THREE.Matrix4().compose(
      new THREE.Vector3(x, y, z),
      new THREE.Quaternion().setFromEuler(rotation || new THREE.Euler()),
      new THREE.Vector3(1, 1, 1),
    );
    shape.applyMatrix4(transform);
    const key = `${zone}/${mat}`;
    if (!batches.has(key)) batches.set(key, []);
    batches.get(key)!.push(shape);
  }
  function box(
    mat: string,
    zone: HubZone,
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
    rotation?: THREE.Euler,
  ) {
    const floor = w > 4 && h < 0.4;
    geometry(
      new THREE.BoxGeometry(
        w,
        h,
        d,
        floor ? Math.ceil(w / 1.5) : 1,
        1,
        floor ? Math.ceil(d / 1.5) : 1,
      ),
      mat,
      zone,
      x,
      y,
      z,
      rotation,
    );
  }
  function cylinder(
    mat: string,
    zone: HubZone,
    x: number,
    y: number,
    z: number,
    rt: number,
    rb: number,
    h: number,
    segments = 12,
  ) {
    geometry(
      new THREE.CylinderGeometry(rt, rb, h, segments),
      mat,
      zone,
      x,
      y,
      z,
    );
  }
  function sphere(
    mat: string,
    zone: HubZone,
    x: number,
    y: number,
    z: number,
    r: number,
    sx = 1,
    sy = 1,
    sz = 1,
  ) {
    const geo = new THREE.SphereGeometry(r, 10, 7);
    geo.scale(sx, sy, sz);
    geometry(geo, mat, zone, x, y, z);
  }
  function bar(
    mat: string,
    zone: HubZone,
    a: THREE.Vector3,
    b: THREE.Vector3,
    r = 0.025,
  ) {
    const delta = b.clone().sub(a);
    const geo = new THREE.CylinderGeometry(r, r, delta.length(), 8);
    const quat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      delta.normalize(),
    );
    geo.applyQuaternion(quat);
    geometry(
      geo,
      mat,
      zone,
      ...(a.clone().add(b).multiplyScalar(0.5).toArray() as [
        number,
        number,
        number,
      ]),
    );
  }
  function rail(x: number, y: number, z: number, length: number) {
    for (let i = 0; i <= Math.round(length / 0.9); i++)
      box(
        "trim",
        "terrace",
        x - length / 2 + (i * length) / Math.round(length / 0.9),
        y + 0.5,
        z,
        0.045,
        1,
        0.045,
      );
    box("timber", "terrace", x, y + 1.02, z, length + 0.1, 0.07, 0.09);
    box("trim", "terrace", x, y + 0.12, z, length, 0.04, 0.04);
  }
  function chair(x: number, y: number, z: number, mat = "seat") {
    box(mat, "interior", x, y + 0.52, z, 0.58, 0.13, 0.58);
    box(mat, "interior", x, y + 0.86, z - 0.24, 0.58, 0.58, 0.1);
    for (const dx of [-0.21, 0.21])
      for (const dz of [-0.21, 0.21])
        box("metal", "interior", x + dx, y + 0.25, z + dz, 0.04, 0.5, 0.04);
  }
  function bench(x: number, z: number, length = 2.3) {
    for (let i = 0; i < 4; i++)
      box("timber", "terrace", x, 0.65, z - 0.25 + i * 0.16, length, 0.1, 0.14);
    for (const dx of [-length * 0.35, length * 0.35])
      box("trim", "terrace", x + dx, 0.42, z, 0.12, 0.48, 0.65);
    box("sage", "terrace", x, 0.8, z, length - 0.15, 0.17, 0.55);
  }
  function plant(x: number, z: number, size = 0.7) {
    cylinder(
      "terracotta",
      "landscape",
      x,
      0.47,
      z,
      size * 0.7,
      size * 0.52,
      0.8,
    );
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      bar(
        "leaf",
        "landscape",
        new THREE.Vector3(x, 0.9, z),
        new THREE.Vector3(
          x + Math.cos(a) * size,
          1.7 + (i % 3) * 0.18,
          z + Math.sin(a) * size,
        ),
        0.025,
      );
      sphere(
        i % 2 ? "leaf" : "leafLight",
        "landscape",
        x + Math.cos(a) * size * 0.7,
        1.6 + (i % 3) * 0.17,
        z + Math.sin(a) * size * 0.7,
        0.38,
        0.45,
        1.1,
        0.65,
      );
    }
  }
  function palm(x: number, z: number, height = 5) {
    cylinder("stone", "landscape", x, 0.2, z, 1.25, 1.3, 0.24, 18);
    cylinder("gravel", "landscape", x, 0.34, z, 1.12, 1.12, 0.08, 18);
    cylinder(
      "trunk",
      "landscape",
      x,
      height / 2 + 0.3,
      z,
      0.12,
      0.25,
      height,
      10,
    );
    for (let i = 0; i < 10; i++) {
      const a = (i * Math.PI) / 5;
      const points = [
        new THREE.Vector3(x, height + 0.3, z),
        new THREE.Vector3(
          x + Math.cos(a) * 1.25,
          height + 0.7,
          z + Math.sin(a) * 1.25,
        ),
        new THREE.Vector3(
          x + Math.cos(a) * 2.25,
          height - 0.1,
          z + Math.sin(a) * 2.25,
        ),
      ];
      const curve = new THREE.CatmullRomCurve3(points);
      geometry(
        new THREE.TubeGeometry(curve, 6, 0.045, 4, false),
        "leaf",
        "landscape",
        0,
        0,
        0,
      );
      for (let j = 1; j <= 6; j++) {
        const p = curve.getPoint(j / 7);
        for (const side of [-1, 1]) {
          const end = new THREE.Vector3(
            p.x + Math.cos(a + side * 0.8) * (0.65 - j * 0.045),
            p.y - 0.13,
            p.z + Math.sin(a + side * 0.8) * (0.65 - j * 0.045),
          );
          bar(i % 2 ? "leaf" : "leafLight", "landscape", p, end, 0.055);
        }
      }
    }
  }
  function person(x: number, z: number, angle = 0) {
    const y = 0.36;
    cylinder("pants", "landscape", x - 0.11, y + 0.43, z, 0.07, 0.055, 0.78, 8);
    cylinder("pants", "landscape", x + 0.11, y + 0.43, z, 0.07, 0.055, 0.78, 8);
    cylinder("shirt", "landscape", x, y + 1.02, z, 0.2, 0.18, 0.5, 10);
    sphere("skin", "landscape", x, y + 1.47, z, 0.14);
    bar(
      "skin",
      "landscape",
      new THREE.Vector3(x - 0.19, y + 1.16, z),
      new THREE.Vector3(x - 0.29, y + 0.76, z + Math.sin(angle) * 0.12),
      0.06,
    );
    bar(
      "skin",
      "landscape",
      new THREE.Vector3(x + 0.19, y + 1.16, z),
      new THREE.Vector3(x + 0.29, y + 0.76, z - 0.08),
      0.06,
    );
  }

  // Raised timber courtyard, individual boards and a stone arrival path.
  box("stone", "landscape", 0, -0.17, 0, 28, 0.3, 22);
  box("gravel", "landscape", 0, 0.01, 0, 27.6, 0.08, 21.6);
  box("trim", "terrace", 0, 0.13, 0, 23, 0.24, 16);
  box("deck", "terrace", 0, 0.27, 0, 22.8, 0.15, 15.8);
  for (let i = 0; i < 53; i++)
    box(
      i % 4 ? "deck" : "timber",
      "terrace",
      -11.2 + i * 0.43,
      0.36,
      0,
      0.405,
      0.04,
      15.7,
    );
  for (let i = 0; i < 5; i++)
    box("stone", "landscape", 0, 0.08, 9 + i * 0.5, 4, 0.15, 0.42);
  // Two ground modules and an offset upper module, with actual interior space.
  const modules = [
    { x: -1.5, z: 2.2, y: 0.43, mat: "forest", kind: "rest" },
    { x: -1.5, z: -3, y: 0.43, mat: "sage", kind: "focus" },
    { x: 0.5, z: -3, y: 3.46, mat: "ivory", kind: "group" },
  ];
  for (const module of modules) {
    const { x, y, z, mat, kind } = module;
    const front = z + 1.22;
    box("white", "structure", x, y + 0.08, z, 12.2, 0.16, 2.44);
    box(mat, "structure", x, y + 1.48, z - 1.16, 12.2, 2.8, 0.12);
    for (const side of [-1, 1]) {
      box(mat, "structure", x + side * 6.04, y + 1.48, z, 0.12, 2.8, 2.44);
      for (let r = 0; r < 7; r++)
        box(
          mat,
          "structure",
          x + side * 6.12,
          y + 1.48,
          z - 0.98 + r * 0.31,
          0.065,
          2.63,
          0.075,
        );
    }
    for (let r = 0; r < 40; r++)
      box(
        mat,
        "structure",
        x - 5.95 + r * 0.305,
        y + 1.48,
        z - 1.245,
        0.075,
        2.62,
        0.065,
      );
    for (const side of [-1, 1])
      box(
        "trim",
        "structure",
        x + side * 5.98,
        y + 1.45,
        front,
        0.11,
        2.9,
        0.15,
      );
    for (const dy of [0.16, 2.78])
      box("trim", "structure", x, y + dy, front, 12.2, 0.12, 0.14);
    for (let bay = 0; bay < 6; bay++) {
      const bx = x - 4.99 + bay * 2;
      box("trim", "structure", bx - 1, y + 1.45, front, 0.055, 2.65, 0.1);
      box("glass", "glass", bx, y + 1.47, front + 0.005, 1.91, 2.5, 0.025);
      box("glow", "structure", bx, y + 2.61, front - 0.08, 1.5, 0.025, 0.035);
    }
    box("ivory", "roof", x, y + 2.97, z, 12.45, 0.14, 2.68);
    box("trim", "roof", x, y + 3.06, z, 12.4, 0.055, 2.62);
    if (kind === "rest")
      for (const dx of [-3.9, 0, 3.9]) {
        box("trim", "interior", x + dx, y + 0.33, z, 2.9, 0.45, 1.65);
        box("linen", "interior", x + dx, y + 0.62, z, 2.85, 0.2, 1.6);
        box("seat", "interior", x + dx + 0.9, y + 0.77, z, 0.75, 0.14, 1.57);
        box("white", "interior", x + dx - 1, y + 0.8, z, 0.55, 0.18, 1.08);
        box(
          "timber",
          "interior",
          x + dx - 1.7,
          y + 0.48,
          z - 0.45,
          0.4,
          0.65,
          0.5,
        );
      }
    if (kind === "focus")
      for (const dx of [-4.6, -1.55, 1.55, 4.6]) {
        box("timber", "interior", x + dx, y + 0.86, z - 0.55, 2.2, 0.1, 0.8);
        for (const side of [-0.9, 0.9])
          box(
            "trim",
            "interior",
            x + dx + side,
            y + 0.43,
            z - 0.55,
            0.05,
            0.86,
            0.68,
          );
        box("trim", "interior", x + dx, y + 1.17, z - 0.68, 0.9, 0.51, 0.06);
        box("water", "interior", x + dx, y + 1.18, z - 0.64, 0.8, 0.42, 0.015);
        chair(x + dx, y, z + 0.4);
      }
    if (kind === "group") {
      box("timber", "interior", x, y + 0.86, z, 4, 0.13, 1.15);
      box("trim", "interior", x, y + 0.42, z, 0.15, 0.84, 0.9);
      for (const dx of [-1.4, 1.4]) {
        chair(x + dx, y, z + 0.85);
        chair(x + dx, y, z - 0.83);
      }
      box("white", "interior", x + 4, y + 1.55, z - 1.08, 2.5, 1.25, 0.05);
    }
  }
  // Terrace with a planted parapet, open stairs, and handrails.
  box("deck", "roof", -1.5, 3.48, 2.2, 12.4, 0.14, 2.65);
  rail(-1.5, 3.58, 3.52, 12.3);
  for (let i = 0; i < 16; i++) {
    const x = 6.7 + i * 0.29,
      y = 0.42 + i * 0.19;
    box("stone", "terrace", x, y, -0.2, 0.29, 0.14, 1.3);
  }
  box("deck", "terrace", 9.05, 3.48, -0.9, 4.9, 0.15, 1.9);
  rail(9.05, 3.58, -1.85, 4.8);
  bar(
    "trim",
    "terrace",
    new THREE.Vector3(6.5, 1.45, 0.48),
    new THREE.Vector3(11.2, 4.3, 0.48),
    0.035,
  );
  bar(
    "trim",
    "terrace",
    new THREE.Vector3(6.5, 1.45, -0.88),
    new THREE.Vector3(11.2, 4.3, -0.88),
    0.035,
  );
  for (let i = 0; i < 5; i++)
    box(
      "trim",
      "terrace",
      6.8 + i * 1.05,
      1.05 + i * 0.68,
      -0.88,
      0.04,
      1.2,
      0.04,
    );
  // Shaded café-style courtyard and outdoor tables.
  for (const x of [-7.8, 5.2])
    for (const z of [-0.55, 1.05])
      box("timber", "terrace", x, 2.1, z, 0.14, 3.5, 0.14);
  for (let i = 0; i < 30; i++)
    box("timber", "terrace", -7.8 + i * 0.45, 3.88, 0.25, 0.14, 0.13, 2.2);
  for (const x of [-4, 2.5]) {
    box("timber", "terrace", x, 1.15, 0.2, 2.6, 0.12, 1);
    box("trim", "terrace", x, 0.73, 0.2, 0.13, 0.8, 0.65);
    bench(x, 1.1, 2.3);
    bench(x, -0.75, 2.3);
  }
  bench(-8.7, 5, 3.1);
  bench(6.7, 5, 3.1);
  // Solar arrays, frame outlines and individual cells.
  for (let panel = 0; panel < 8; panel++) {
    const x = -5.1 + panel * 1.55;
    box("metal", "solar", x, 6.62, -3, 1.4, 0.08, 1.9);
    box("solar", "solar", x, 6.67, -3, 1.31, 0.025, 1.8);
    for (let ix = 0; ix < 4; ix++)
      for (let iz = 0; iz < 6; iz++)
        box(
          "cell",
          "solar",
          x - 0.48 + ix * 0.32,
          6.687,
          -3.7 + iz * 0.28,
          0.3,
          0.008,
          0.26,
        );
  }
  for (const [x, z, h] of [
    [-10, 6.2, 5.1],
    [10, 6.2, 4.8],
    [-10, -6.2, 5.7],
    [10, -6.2, 5.2],
  ] as [number, number, number][])
    palm(x, z, h);
  for (const [x, z] of [
    [-8.5, 3.5],
    [7, 3.5],
    [-8.5, -3],
    [8, -4.9],
    [-5, 6.5],
    [4, 6.5],
  ])
    plant(x, z, 0.7);
  for (const x of [-5, 4]) {
    box("stone", "landscape", x, 0.62, -6.8, 5, 0.55, 1);
    for (let i = 0; i < 8; i++)
      sphere(
        i % 2 ? "leaf" : "leafLight",
        "landscape",
        x - 2.1 + i * 0.6,
        1.1,
        -6.8,
        0.45,
        1,
        0.7,
        1,
      );
  }
  for (const x of [-9, 9]) {
    cylinder("trim", "terrace", x, 1.23, 7, 0.055, 0.055, 1.8, 8);
    box("glow", "terrace", x, 2.16, 7, 0.2, 0.15, 0.2);
  }
  person(-3, 5.1, 0.3);
  person(-2, 5.7, 1);
  person(8, -1.4, 2);
  for (const [key, geometries] of batches) {
    const [zone, mat] = key.split("/") as [HubZone, string];
    const merged = mergeGeometries(geometries, false);
    for (const g of geometries) g.dispose();
    if (!merged) continue;
    const mesh = new THREE.Mesh(merged, materials[mat]);
    mesh.castShadow = zone !== "glass";
    mesh.receiveShadow = true;
    mesh.name = `${zone}:${mat}`;
    zones[zone].add(mesh);
  }
  group.userData = { concept: true, containerCount: 3, units: "metres" };
  return {
    group,
    materials,
    zones,
    dispose: () => {
      group.traverse((object) => {
        if (object instanceof THREE.Mesh) object.geometry.dispose();
      });
      for (const mat of Object.values(materials)) mat.dispose();
    },
  };
}
