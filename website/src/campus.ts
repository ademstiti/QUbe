import type { Feature, FeatureCollection, Polygon } from "geojson";

export type Hub = {
  id: string;
  number: string;
  name: string;
  college: string;
  area: string;
  group: "Metro" | "Colleges" | "Health";
  coordinates: [number, number];
  landmark: [number, number];
  description: string;
  note: string;
  anchor: "mapped" | "approximate";
  osmId?: number;
};

// Landmark positions refer to mapped buildings where available. Container
// coordinates are design proposals nearby, not surveyed or approved plots.
export const HUBS: Hub[] = [
  {
    id: "metro",
    number: "01",
    name: "The Metro Pause",
    college: "Qatar University Metro Station",
    area: "Metro arrival area",
    group: "Metro",
    coordinates: [51.49268, 25.38216],
    landmark: [51.4930115, 25.3823443],
    anchor: "mapped",
    osmId: 5079684559,
    description:
      "A soft landing between your commute and your first class. Imagine a little room to rest, get ready, or find your focus.",
    note: "Proposed beside the metro arrival area. Exact siting and access would need a site review.",
  },
  {
    id: "engineering",
    number: "02",
    name: "The Ideas Yard",
    college: "College of Engineering",
    area: "H07 neighbourhood",
    group: "Colleges",
    coordinates: [51.48922, 25.37862],
    landmark: [51.4877, 25.379],
    anchor: "mapped",
    osmId: 1036007007,
    description:
      "A quiet reset after a lab, or a place for your project team to gather. A proposed modular hub near the engineering building.",
    note: "Anchored to the mapped engineering building. The container plot is illustrative.",
  },
  {
    id: "arts",
    number: "03",
    name: "The Creative Corner",
    college: "College of Arts and Sciences",
    area: "Arts & Sciences neighbourhood",
    group: "Colleges",
    coordinates: [51.49093, 25.37104],
    landmark: [51.49004, 25.37103],
    anchor: "mapped",
    osmId: 1442853859,
    description:
      "Make room for a chapter, a conversation, or a little quiet. A proposed pause near the Arts and Sciences campus area.",
    note: "Uses the mapped Arts and Sciences building as a reference; the college uses more than one campus building.",
  },
  {
    id: "business",
    number: "04",
    name: "The Next Chapter",
    college: "College of Business and Economics",
    area: "H08 neighbourhood · approximate",
    group: "Colleges",
    coordinates: [51.48772, 25.37775],
    landmark: [51.48655, 25.37755],
    anchor: "approximate",
    description:
      "Step out of a busy day and into a calmer one. A proposed place to focus, meet, and recharge near the business college area.",
    note: "Approximate H08 college area, informed by the QU building directory and campus layout. Not a verified entrance or plot.",
  },
  {
    id: "education",
    number: "05",
    name: "The Learning Garden",
    college: "College of Education",
    area: "I10 neighbourhood",
    group: "Colleges",
    coordinates: [51.48402, 25.37558],
    landmark: [51.483, 25.37595],
    anchor: "mapped",
    osmId: 1442853857,
    description:
      "A little breathing room between learning and everything else. A proposed hub alongside the education neighbourhood.",
    note: "Anchored to the mapped College of Education. Container placement is a concept only.",
  },
  {
    id: "law",
    number: "06",
    name: "The Quiet Argument",
    college: "College of Law",
    area: "I09 neighbourhood",
    group: "Colleges",
    coordinates: [51.48196, 25.37508],
    landmark: [51.48099, 25.37559],
    anchor: "mapped",
    osmId: 1442853858,
    description:
      "Read, reflect, or compare notes. A proposed quiet corner near the College of Law for the time between classes.",
    note: "Anchored to the mapped law building; the proposed containers are not existing facilities.",
  },
  {
    id: "sharia",
    number: "07",
    name: "The Reflection Space",
    college: "College of Sharia and Islamic Studies",
    area: "C07 / C11 area · approximate",
    group: "Colleges",
    coordinates: [51.4887, 25.37244],
    landmark: [51.48915, 25.37268],
    anchor: "approximate",
    description:
      "A thoughtful pause for reading, study, and time with your classmates. Imagined near the Sharia and Islamic Studies area.",
    note: "Approximate college area based on QU’s C07 / C11 directory references. Precise building access and plot remain unverified.",
  },
  {
    id: "sport",
    number: "08",
    name: "The Second Wind",
    college: "College of Sport Sciences",
    area: "Sports campus area · approximate",
    group: "Colleges",
    coordinates: [51.49373, 25.37583],
    landmark: [51.4943, 25.37595],
    anchor: "approximate",
    description:
      "Freshen up, put your feet up, and take a breather. A proposed stop serving Sport Sciences near the campus sports facilities.",
    note: "Proposed in the sports facilities area to serve the college; this is not a verified College of Sport Sciences building location.",
  },
  {
    id: "medicine",
    number: "09",
    name: "The Care Break",
    college: "College of Medicine",
    area: "Medicine & Health Sciences neighbourhood",
    group: "Health",
    coordinates: [51.48458, 25.38185],
    landmark: [51.48385, 25.38198],
    anchor: "mapped",
    osmId: 1442853855,
    description:
      "A small pause in a full day of learning to care for others. A proposed hub near the mapped Medicine and Health Sciences building.",
    note: "The mapped Medicine and Health Sciences building anchors this proposal. Teaching and offices can span other health buildings.",
  },
  {
    id: "health",
    number: "10",
    name: "The Wellbeing Stop",
    college: "College of Health Sciences",
    area: "Shared QU Health area",
    group: "Health",
    coordinates: [51.48456, 25.38121],
    landmark: [51.48385, 25.38198],
    anchor: "mapped",
    osmId: 1442853855,
    description:
      "Space to recharge before the next class. Imagined as a separate stop serving Health Sciences in the shared QU Health area.",
    note: "Shares the mapped Medicine and Health Sciences area as a reference. A separate college entrance is not verified.",
  },
  {
    id: "pharmacy",
    number: "11",
    name: "The Little Recharge",
    college: "College of Pharmacy",
    area: "I06 · Ibn Al Baitar neighbourhood",
    group: "Health",
    coordinates: [51.48291, 25.38112],
    landmark: [51.48191, 25.38116],
    anchor: "mapped",
    osmId: 1036007006,
    description:
      "A place to gather your thoughts, compare notes, or simply recharge. A proposed hub near the mapped pharmacy building.",
    note: "Anchored to the mapped Ibn Al Baitar / pharmacy building. Proposed footprint only.",
  },
  {
    id: "dental",
    number: "12",
    name: "The Fresh Start",
    college: "College of Dental Medicine",
    area: "QU Health area · approximate",
    group: "Health",
    coordinates: [51.48279, 25.38023],
    landmark: [51.4821, 25.38029],
    anchor: "approximate",
    description:
      "A fresh start between classes. A proposed container hub to serve Dental Medicine within the wider health-colleges neighbourhood.",
    note: "Approximate health-colleges area. A dedicated Dental Medicine building location is not verified in the map snapshot.",
  },
  {
    id: "nursing",
    number: "13",
    name: "The Kind Pause",
    college: "College of Nursing",
    area: "QU Health / I03 area · approximate",
    group: "Health",
    coordinates: [51.48074, 25.38007],
    landmark: [51.4798, 25.38034],
    anchor: "approximate",
    description:
      "A little care for the people learning to care. Imagined near the western health-colleges area, serving Nursing students.",
    note: "QU identifies Nursing with I03. This map uses an approximate western QU Health area, not a verified I03 entrance.",
  },
];

export const CAMPUS_CENTER: [number, number] = [51.48725, 25.37725];
export const CAMPUS_BOUNDS: [[number, number], [number, number]] = [
  [51.479, 25.3698],
  [51.4957, 25.3831],
];
export const CAMPUS_SOURCES = [
  {
    label: "QU college directory",
    url: "https://www.qu.edu.qa/en-us/Colleges/",
  },
  {
    label: "QU building directory",
    url: "https://qu.edu.qa/en-us/Offices/FacilitiesGeneralServices/Pages/Building-Codes.aspx",
  },
  {
    label: "OpenStreetMap campus data",
    url: "https://www.openstreetmap.org/#map=16/25.3773/51.4873",
  },
];

// Coordinates in metres east/north of a proposed site, projected onto WGS84.
export function offsetPoint(
  origin: [number, number],
  east: number,
  north: number,
): [number, number] {
  return [
    origin[0] + east / (111320 * Math.cos((origin[1] * Math.PI) / 180)),
    origin[1] + north / 111320,
  ];
}
export function boxFeature(
  hub: Hub,
  x: number,
  y: number,
  width: number,
  depth: number,
  base: number,
  height: number,
  color: string,
  part: string,
): Feature<Polygon> {
  const ring = [
    [x, y],
    [x + width, y],
    [x + width, y + depth],
    [x, y + depth],
    [x, y],
  ].map(([east, north]) => offsetPoint(hub.coordinates, east, north));
  return {
    type: "Feature",
    properties: { hubId: hub.id, part, base, height, color },
    geometry: { type: "Polygon", coordinates: [ring] },
  };
}
export function containerModels(): FeatureCollection<Polygon> {
  const features: Feature<Polygon>[] = [];
  for (const hub of HUBS) {
    // Two standard 40-ft container volumes and an offset upper module.
    features.push(boxFeature(hub, -9, -7, 23, 17, 0, 0.25, "#d9c8a6", "deck"));
    for (const [x, y, base, color] of [
      [-6, -4, 0, "#174e3b"],
      [-6, 1.1, 0, "#527459"],
      [-4, 1.1, 2.9, "#dfd1b0"],
    ] as [number, number, number, string][]) {
      features.push(
        boxFeature(
          hub,
          x,
          y,
          12.2,
          2.44,
          base + 0.25,
          base + 3.15,
          color,
          "container",
        ),
      );
      features.push(
        boxFeature(
          hub,
          x - 0.08,
          y - 0.09,
          12.36,
          2.62,
          base + 3.15,
          base + 3.3,
          "#efe7d5",
          "roof",
        ),
      );
      for (let rib = 0; rib < 20; rib++)
        features.push(
          boxFeature(
            hub,
            x + rib * 0.61,
            y - 0.025,
            0.06,
            0.04,
            base + 0.4,
            base + 3.05,
            color === "#dfd1b0" ? "#b9ab8b" : "#608065",
            "rib",
          ),
        );
      for (const windowX of [1, 5.3, 9])
        features.push(
          boxFeature(
            hub,
            x + windowX,
            y - 0.06,
            2,
            0.08,
            base + 1.1,
            base + 2.5,
            "#a9ccc1",
            "window",
          ),
        );
    }
    for (let panel = 0; panel < 6; panel++)
      features.push(
        boxFeature(
          hub,
          -3.3 + panel * 1.65,
          1.5,
          1.4,
          1.6,
          6.2,
          6.35,
          "#365e65",
          "solar",
        ),
      );
    features.push(
      boxFeature(hub, 9, -2, 0.35, 6, 0, 3.3, "#a48b60", "pergola"),
    );
    for (let beam = 0; beam < 6; beam++)
      features.push(
        boxFeature(
          hub,
          6.4,
          -2 + beam,
          3.5,
          0.15,
          3.25,
          3.4,
          "#b29c77",
          "pergola",
        ),
      );
    for (const [x, y] of [
      [-8, -6],
      [12, -6],
      [-8, 7],
      [12, 7],
    ]) {
      features.push(boxFeature(hub, x, y, 0.5, 0.5, 0, 2.4, "#a38e68", "tree"));
      features.push(
        boxFeature(
          hub,
          x - 1.2,
          y - 1.2,
          2.9,
          2.9,
          2.4,
          3.4,
          "#6f8d63",
          "tree",
        ),
      );
    }
  }
  return { type: "FeatureCollection", features };
}

export const hubPoints: FeatureCollection = {
  type: "FeatureCollection",
  features: HUBS.map((hub) => ({
    type: "Feature",
    properties: { id: hub.id, number: hub.number, name: hub.college },
    geometry: { type: "Point", coordinates: hub.coordinates },
  })),
};
