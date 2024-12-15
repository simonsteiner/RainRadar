/// <reference types="maplibre-gl" />

declare interface LayerConfig {
  id: string;
  label?: string;
  visible?: boolean;  // default: true
  source: string;
  sourceConfig?: object;
  layers: maplibregl.LayerSpecification[];
}

export {
  LayerConfig
};
