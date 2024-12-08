export class ViewportHandler {
    initialize(): void {
        const updateMapHeight = () => {
            const visualViewport = window.visualViewport;
            const map = document.getElementById("map");
            if (!map || document.fullscreenElement) return;

            const heightDifference = window.innerHeight - (visualViewport?.height || 0);
            if (!map) return;

            if (heightDifference !== 0) {
                map.classList.add("address-bar-visible");
            } else {
                map.classList.remove("address-bar-visible");
            }
        };

        if (window.visualViewport) {
            window.visualViewport.addEventListener("resize", updateMapHeight);
        }

        window.addEventListener("load", updateMapHeight);
        updateMapHeight();
    }
}