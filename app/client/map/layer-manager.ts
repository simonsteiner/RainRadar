import { LAYER_CONFIGS } from "./layers-config";
import type { GeoJSON } from "geojson";
import type { LayerConfig } from "../_types/map";
import type { Map, GeoJSONSource } from "maplibre-gl";

export class LayerManager {
  private map: Map;

  constructor(map: Map) {
    this.map = map;
    this.setupLayerToggles();
  }

  addLayer(config: LayerConfig): void {
    if (config.sourceConfig && !this.map.getSource(config.source)) {
      this.map.addSource(config.source, config.sourceConfig);
    }

    const visibility = config.visible === false ? "none" : "visible";
    config.layers.forEach((layer) => {
      if (!this.map.getLayer(layer.id)) {
        this.map.addLayer({
          ...layer,
          layout: {
            ...layer.layout,
            visibility
          }
        });
      }
    });
  }

  toggleLayer(layerId: string, visible: boolean): void {
    const config = LAYER_CONFIGS[layerId];
    if (!config) return;

    const visibility = visible ? "visible" : "none";
    config.layers.forEach((layer) => {
      if (this.map.getLayer(layer.id)) {
        this.map.setLayoutProperty(layer.id, "visibility", visibility);
      }
    });
  }

  public createLayerCheckboxes(): void {
    const container = document.getElementById("layer-content");

    if (!container) {
      console.error("Layer control container not found");
      return;
    }

    Object.entries(LAYER_CONFIGS).forEach(([layerId, config]) => {
      const label_elem = document.createElement("label");
      const checkbox = document.createElement("input");

      checkbox.className = "layer-checkbox";
      checkbox.type = "checkbox";
      checkbox.id = layerId;
      checkbox.checked = config.visible !== false;

      label_elem.appendChild(checkbox);
      label_elem.appendChild(
        document.createTextNode(` ${config.label || layerId}`)
      );
      container.appendChild(label_elem);
    });
  }

  setupLayerToggles(): void {
    const layerIds = Object.keys(LAYER_CONFIGS);
    layerIds.forEach((layerId) => {
      const checkbox = document.getElementById(layerId) as HTMLInputElement;
      if (checkbox) {
        checkbox.addEventListener("change", (e) => {
          this.toggleLayer(layerId, (e.target as HTMLInputElement).checked);
        });
      }
    });
  }

  // MapLibre 6 made `setData` asynchronous — it resolves once the worker has
  // parsed the new data — so this returns the promise rather than dropping it.
  // Callers that render a frame need to know when the data actually landed.
  async updateSourceData(layerId: string, data: string | GeoJSON): Promise<void> {
    const config = LAYER_CONFIGS[layerId];
    if (!config) return;

    if (!this.map.getSource(config.source)) {
      this.addLayer(config);
    }

    const source = this.map.getSource<GeoJSONSource>(config.source);
    if (!source) {
      // addLayer above adds the source when the config carries one, so getting
      // here means the layer is misconfigured. Returning normally would report
      // a frame as rendered when nothing was updated — the exact thing making
      // this method async was meant to stop.
      throw new Error(
        `Layer "${layerId}" has no source "${config.source}" to update`
      );
    }
    await source.setData(data);
  }
}
