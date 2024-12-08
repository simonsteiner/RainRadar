import { Map } from "maplibre-gl";
import { getCurrentPosition } from "../map/location-button";

export class ParaglidingMode {
    private static instance: ParaglidingMode;
    private isActive: boolean;
    private changeListeners: Array<(isActive: boolean) => void> = [];
    private map: Map;

    public static getInstance(): ParaglidingMode {
        if (!ParaglidingMode.instance) {
            ParaglidingMode.instance = new ParaglidingMode();
        }
        return ParaglidingMode.instance;
    }

    public isEnabled(): boolean {
        return this.isActive;
    }

    public addChangeListener(listener: (isActive: boolean) => void): void {
        this.changeListeners.push(listener);
    }

    public initialize(map: Map): void {
        this.map = map;
        if (this.isActive) {
            getCurrentPosition(this.map);
        }
    }

    private constructor() {
        this.isActive = this.checkUrlParam();
        this.setupToggleButton();
    }

    private checkUrlParam(): boolean {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get("mode") === "paragliding";
    }

    private updateUrl(active: boolean): void {
        const url = new URL(window.location.href);
        active ? url.searchParams.set("mode", "paragliding") : url.searchParams.delete("mode");
        window.history.replaceState({}, "", url);
    }

    private setupToggleButton(): void {
        const buttons = document.querySelectorAll("#paraglidingMode");
        if (!buttons.length) return;

        if (this.isActive) {
            this.updateClasses(true);
        }

        buttons.forEach(button => {
            button.addEventListener("click", () => this.toggle());
        });
    }

    private updateClasses(active: boolean): void {
        const buttons = document.querySelectorAll("#paraglidingMode");

        if (active) {
            document.body.classList.add("paragliding");
            buttons.forEach(button => button.classList.add("active"));
        } else {
            document.body.classList.remove("paragliding");
            buttons.forEach(button => button.classList.remove("active"));
        }
    }

    private toggle(): void {
        this.isActive = !this.isActive;
        this.updateClasses(this.isActive);
        this.updateUrl(this.isActive);

        if (this.isActive) {
            if (!this.map) {
                console.error("Map not initialized in ParaglidingMode");
                return;
            }
            getCurrentPosition(this.map);
        }
        this.changeListeners.forEach(listener => listener(this.isActive));
    }
}