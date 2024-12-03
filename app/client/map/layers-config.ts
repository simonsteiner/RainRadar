import { center, bounds } from "./configs/centerAndBounds";
import { hillshade } from "./configs/hillshade";
import { LayerConfig } from "./types";
import { precipitation } from "./configs/precipitation";
import { swissBoundary, swissCantonBoundaries } from "./configs/swissBoundaries";
import { swissCities } from "./configs/swissCities";
import { swissNutsRegions, regionCenter } from "./configs/swissNutsRegions";

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
