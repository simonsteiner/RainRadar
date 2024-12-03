import { center, bounds } from "./configs/centerAndBounds";
import { hillshade } from "./configs/terrain";
import { LayerConfig } from "./types";
import { precipitation } from "./configs/weather";
import { swissBoundary, swissCantonBoundaries } from "./configs/boundaries";
import { swissCities } from "./configs/cities";
import { swissNutsRegions, regionCenter } from "./configs/regions";

export const LAYER_CONFIGS: Record<string, LayerConfig> = {
  precipitation,
  center,
  bounds,
  hillshade,
  swissBoundary,
  swissCantonBoundaries,
  swissCities,
  swissNutsRegions,
  regionCenter,
};

export default LAYER_CONFIGS;
