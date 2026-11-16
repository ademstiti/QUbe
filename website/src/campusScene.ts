import type {
  LayerSpecification,
  SourceSpecification,
  StyleSpecification,
  FilterSpecification,
} from "maplibre-gl";
import type { FeatureCollection } from "geojson";
import { HUBS, containerModels } from "./campus";

export const campusBaseStyle: StyleSpecification = {
  version: 8,
  sources: {
    streets: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      maxzoom: 19,
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>',
    },
  },
  layers: [
    {
      id: "ground",
      type: "background",
      paint: { "background-color": "#eeeade" },
    },
    {
      id: "street-map",
      type: "raster",
      source: "streets",
      layout: { visibility: "none" },
      paint: { "raster-opacity": 0.72 },
    },
  ],
};

export function addCampusLayers(
  map: {
    addSource(id: string, source: SourceSpecification): unknown;
    addLayer(layer: LayerSpecification): unknown;
  },
  geometry: FeatureCollection,
) {
  map.addSource("campus", { type: "geojson", data: geometry });
  const land: FilterSpecification = ["==", ["get", "kind"], "land"],
    building: FilterSpecification = ["==", ["get", "kind"], "building"],
    road: FilterSpecification = ["==", ["get", "kind"], "road"];
  map.addLayer({
    id: "land",
    type: "fill",
    source: "campus",
    filter: ["all", [...land], ["==", ["geometry-type"], "Polygon"]],
    paint: {
      "fill-color": [
        "match",
        ["get", "subtype"],
        "parking",
        "#e1ddce",
        "pitch",
        "#b8c8a0",
        "park",
        "#cfdbbc",
        "grass",
        "#d2ddbd",
        "forest",
        "#c2d2ac",
        "#e3e5d2",
      ],
      "fill-opacity": 0.8,
    },
  });
  map.addLayer({
    id: "road-edge",
    type: "line",
    source: "campus",
    filter: [...road],
    paint: {
      "line-color": "#d1cbb9",
      "line-width": [
        "interpolate",
        ["linear"],
        ["zoom"],
        14,
        1.2,
        18,
        16,
        21,
        75,
      ],
    },
    layout: { "line-cap": "round", "line-join": "round" },
  });
  map.addLayer({
    id: "roads",
    type: "line",
    source: "campus",
    filter: [...road],
    paint: {
      "line-color": [
        "match",
        ["get", "subtype"],
        "footway",
        "#f3f0e4",
        "path",
        "#f3f0e4",
        "cycleway",
        "#d5c5b0",
        "#fffdf5",
      ],
      "line-width": [
        "interpolate",
        ["linear"],
        ["zoom"],
        14,
        0.7,
        18,
        12,
        21,
        68,
      ],
    },
    layout: { "line-cap": "round", "line-join": "round" },
  });
  map.addLayer({
    id: "building-footprints",
    type: "fill",
    source: "campus",
    filter: [...building],
    paint: { "fill-color": "#d2c6ae", "fill-outline-color": "#bbb39c" },
  });
  map.addLayer({
    id: "buildings-3d",
    type: "fill-extrusion",
    source: "campus",
    filter: [...building],
    paint: {
      "fill-extrusion-color": "#dfd6c1",
      "fill-extrusion-height": ["get", "height"],
      "fill-extrusion-opacity": 0.88,
    },
  });
  map.addSource("containers", {
    type: "geojson",
    data: containerModels(),
  });
  map.addLayer({
    id: "container-footprints",
    type: "fill",
    source: "containers",
    filter: ["in", ["get", "part"], ["literal", ["container", "deck"]]],
    paint: { "fill-color": ["get", "color"] },
  });
  map.addLayer({
    id: "containers-3d",
    type: "fill-extrusion",
    source: "containers",
    paint: {
      "fill-extrusion-color": ["get", "color"],
      "fill-extrusion-base": ["get", "base"],
      "fill-extrusion-height": ["get", "height"],
      "fill-extrusion-opacity": 1,
    },
  });
  map.addSource("selected-area", {
    type: "geojson",
    data: {
      type: "Feature",
      properties: {},
      geometry: { type: "Point", coordinates: HUBS[0].coordinates },
    },
  });
  map.addLayer({
    id: "selected-halo",
    type: "circle",
    source: "selected-area",
    paint: {
      "circle-color": "#174e3b",
      "circle-opacity": 0.08,
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        14,
        16,
        18,
        55,
        21,
        180,
      ],
      "circle-stroke-color": "#174e3b",
      "circle-stroke-width": 1,
      "circle-stroke-opacity": 0.35,
    },
  });
}

export function createCampusStyle(
  geometry: FeatureCollection,
): StyleSpecification {
  const style = structuredClone(campusBaseStyle);
  addCampusLayers(
    {
      addSource(id, source) {
        style.sources[id] = source;
      },
      addLayer(layer) {
        style.layers.push(layer);
      },
    },
    geometry,
  );
  return style;
}
