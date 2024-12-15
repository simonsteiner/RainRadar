import { center, bounds } from "./configs/centerAndBounds";
import { hillshade } from "./configs/hillshade";
import { locationMarker } from "./configs/locationMarker";
import { precipitation } from "./configs/precipitation";
import { radarDomain, world } from "./configs/radar-domain";
import { swissBoundary, swissCantonBoundaries } from "./configs/swissBoundaries";
import { swissCities } from "./configs/swissCities";
import { swissNutsRegions, regionCenter } from "./configs/swissNutsRegions";
import type { LayerConfig } from "../_types/map";

export const LAYER_CONFIGS: Record<string, LayerConfig> = {
  precipitation,
  radarDomain,
  world,
  center,
  bounds,
  hillshade,
  swissBoundary,
  swissCantonBoundaries,
  swissCities,
  swissNutsRegions,
  regionCenter,
  locationMarker,
};

export default LAYER_CONFIGS;
