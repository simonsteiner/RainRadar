import { LayerSpecification } from "maplibre-gl";

export interface LayerConfig {
  id: string;
  source: string;
  layers: LayerSpecification[];
  sourceConfig?: object;
  label?: string;
}
