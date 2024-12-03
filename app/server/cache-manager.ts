
interface CacheEntry {
    data: Buffer;
    timestamp: number;
}

export class CacheManager {
    private cache: Map<string, CacheEntry> = new Map();
    private readonly maxAge: number;

    constructor(maxAgeSeconds: number) {
        this.maxAge = maxAgeSeconds * 1000;
    }

    set(key: string, data: Buffer): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    get(key: string): Buffer | null {
        const entry = this.cache.get(key);
        if (!entry) return null;

        if (Date.now() - entry.timestamp > this.maxAge) {
            this.cache.delete(key);
            return null;
        }

        return entry.data;
    }

    clear(): void {
        this.cache.clear();
    }
}