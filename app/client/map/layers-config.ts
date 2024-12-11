import { center, bounds } from "./configs/centerAndBounds";
import { hillshade } from "./configs/hillshade";
import { LayerConfig } from "./types";
import { precipitation } from "./configs/precipitation";
import {
  swissBoundary,
  swissCantonBoundaries,
} from "./configs/swissBoundaries";
import { swissCities } from "./configs/swissCities";
import { swissNutsRegions, regionCenter } from "./configs/swissNutsRegions";
import { locationMarker } from "./configs/locationMarker";
import { radarDomain, world } from "./configs/radar-domain";

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
  locationMarker,
  radarDomain,
  world,
};

export default LAYER_CONFIGS;
