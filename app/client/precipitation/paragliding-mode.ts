export class ParaglidingMode {
    private static instance: ParaglidingMode;
    private isActive: boolean;
    private changeListeners: Array<(isActive: boolean) => void> = [];

    private constructor() {
        this.isActive = this.checkUrlParam();
        this.setupToggleButton();
    }

    public static getInstance(): ParaglidingMode {
        if (!ParaglidingMode.instance) {
            ParaglidingMode.instance = new ParaglidingMode();
        }
        return ParaglidingMode.instance;
    }

    public isEnabled(): boolean {
        return this.isActive;
    }

    private checkUrlParam(): boolean {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('mode') === 'paragliding';
    }

    private setupToggleButton(): void {
        const button = document.getElementById('paraglidingMode');
        if (!button) return;

        if (this.isActive) {
            button.classList.add('active');
            document.body.classList.add('paragliding');
        }

        button.addEventListener('click', () => this.toggle());
    }

    public addChangeListener(listener: (isActive: boolean) => void): void {
        this.changeListeners.push(listener);
    }

    private toggle(): void {
        this.isActive = !this.isActive;
        const url = new URL(window.location.href);
        const button = document.getElementById('paraglidingMode');

        if (this.isActive) {
            url.searchParams.set('mode', 'paragliding');
            document.body.classList.add('paragliding');
            button?.classList.add('active');
        } else {
            url.searchParams.delete('mode');
            document.body.classList.remove('paragliding');
            button?.classList.remove('active');
        }

        window.history.replaceState({}, '', url);
        this.changeListeners.forEach(listener => listener(this.isActive));
    }
}