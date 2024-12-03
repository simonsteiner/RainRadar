import { Map, SourceSpecification } from "maplibre-gl";
import { LAYER_CONFIGS } from "./layers-config";
import { LayerConfig } from "./types";

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

    config.layers.forEach((layer) => {
      if (!this.map.getLayer(layer.id)) {
        this.map.addLayer(layer);
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
    const container = document.getElementById("layer-control");

    if (!container) {
      console.error("Layer control container not found");
      return;
    }

    Object.entries(LAYER_CONFIGS).forEach(([layerId, config]) => {
      const label_elem = document.createElement("label");
      const checkbox = document.createElement("input");

      checkbox.type = "checkbox";
      checkbox.id = layerId;
      checkbox.checked = true;

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
}
