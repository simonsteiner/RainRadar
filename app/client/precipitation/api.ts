import { showMessageOverlay } from "../utils/message-overlay";
import type { VersionsData, AnimationData } from "../_types/precipitation";

const API_ENDPOINTS = {
  versions: "/api/versions.json",
  precipitation: "/api/precipitation",
} as const;

export async function fetchJson<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      showMessageOverlay(`🚨 HTTP error! status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    showMessageOverlay("🚨 Network or parsing error!");
    throw error;
  }
}

export async function fetchVersionsData(): Promise<VersionsData> {
  return fetchJson<VersionsData>(API_ENDPOINTS.versions);
}

export async function fetchPrecipitationAnimation(): Promise<AnimationData> {
  const versionsData = await fetchVersionsData();
  const precipVersion = versionsData["precipitation/animation"];
  return fetchJson<AnimationData>(
    `${API_ENDPOINTS.precipitation}/${precipVersion}/animation.json`
  );
}
