interface LegendItem {
  min: number;
  max: number;
  color: string;
}

export function createLegend(
  legendData: LegendItem[],
  containerId: string = "legend-container"
): void {
  const container = document.createElement("div");
  container.className = containerId;

  legendData.forEach((item) => {
    const legendItem = document.createElement("div");
    legendItem.className = "legend-item";

    const colorBox = document.createElement("div");
    colorBox.className = "color-box";
    colorBox.style.backgroundColor = item.color;

    const text = document.createElement("span");
    text.className = "legend-text";
    text.textContent = `${item.min}-${item.max} mm/h`;

    legendItem.appendChild(colorBox);
    legendItem.appendChild(text);
    container.appendChild(legendItem);
  });

  const targetElement = document.getElementById(containerId);
  if (targetElement) {
    targetElement.appendChild(container);
  }
}
