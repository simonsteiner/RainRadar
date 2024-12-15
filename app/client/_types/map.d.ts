/// <reference types="maplibre-gl" />

export interface LayerConfig {
  id: string;
  label?: string;
  visible?: boolean;  // default: true
  source: string;
  sourceConfig?: object;
  layers: maplibregl.LayerSpecification[];
}
