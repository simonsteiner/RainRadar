declare interface Bounds {
  x_min: number;
  x_max: number;
  x_count: number;
  y_min: number;
  y_max: number;
  y_count: number;
}

declare interface ShapeInput {
  i: number;
  j: number;
  d: string;
  o: string;
  l: number;
}

declare interface RadarArea {
  color: string;
  shapes: ShapeInput[][];
}

declare interface RadarData {
  coords: Bounds;
  areas: RadarArea[];
}

declare interface GeoPoint {
  x: number;
  y: number;
}

declare type GeoJSONFeature = {
  type: "Feature";
  properties: { color: string };
  geometry: {
    type: "Polygon";
    coordinates: [number, number][][];
  };
};

declare type GeoJSONFeatureCollection = {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
};

export {
  Bounds,
  ShapeInput,
  RadarArea,
  RadarData,
  GeoPoint,
  GeoJSONFeature,
  GeoJSONFeatureCollection
};
