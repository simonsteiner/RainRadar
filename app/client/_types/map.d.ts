import type { LayerSpecification, SourceSpecification } from "maplibre-gl";

export interface LayerConfig {
  id: string;
  label?: string;
  visible?: boolean;  // default: true
  source: string;
  sourceConfig?: SourceSpecification;
  layers: LayerSpecification[];
}
