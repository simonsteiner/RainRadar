export interface Bounds {
  x_min: number;
  x_max: number;
  x_count: number;
  y_min: number;
  y_max: number;
  y_count: number;
}

export type GeoJSONFeature = {
  type: "Feature";
  properties: { color: string };
  geometry: {
    type: "Polygon";
    coordinates: [number, number][][];
  };
};

export type GeoJSONFeatureCollection = {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
};

export interface GeoPoint {
  x: number;
  y: number;
}

export interface RadarArea {
  color: string;
  shapes: ShapeInput[][];
}

export interface RadarData {
  coords: Bounds;
  areas: RadarArea[];
}

export interface ShapeInput {
  i: number;
  j: number;
  d: string;
  o: string;
  l: number;
}
