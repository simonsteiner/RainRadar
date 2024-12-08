import { Map, SourceSpecification, GeoJSONSource } from "maplibre-gl";
import type { GeoJSON } from "geojson";
import { LAYER_CONFIGS } from "./layers-config";
import { LayerConfig } from "./types";

const TRANSITION_CONFIG = { duration: 300 };

export class LayerManager {
  private map: Map;

  constructor(map: Map) {
    this.map = map;
    this.setupLayerToggles();
  }

  addLayer(config: LayerConfig): void {
    if (config.sourceConfig && !this.map.getSource(config.source)) {
      this.map.addSource(
        config.source,
        config.sourceConfig as SourceSpecification
      );
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

    // Add transitions for paint properties if layer is precipitation
    if (config.id === "precipitation") {
      config.layers.forEach(layer => {
        if (layer.paint) {
          Object.keys(layer.paint).forEach(prop => {
            this.map.setPaintProperty(layer.id, `${prop}-transition`, TRANSITION_CONFIG);
          });
        }
      });
    }
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

  updateSourceData(layerId: string, data: string | GeoJSON): void {
    const config = LAYER_CONFIGS[layerId];
    if (!config) return;

    const source = this.map.getSource(config.source) as GeoJSONSource;
    if (!source) {
      this.addLayer(config);
      (this.map.getSource(config.source) as GeoJSONSource).setData(data);
    } else {
      source.setData(data);
    }
  }
}
