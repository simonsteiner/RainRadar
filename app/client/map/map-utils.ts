
export function getZoomFromUrl(): number | undefined {
    const params = new URLSearchParams(window.location.search);
    const zoom = params.get("zoom");
    return zoom ? parseFloat(zoom) : undefined;
}

export function hasZoomParameter(): boolean {
    return new URLSearchParams(window.location.search).has("zoom");
}