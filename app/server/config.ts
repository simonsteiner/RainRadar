export const SERVER = {
  PORT: process.env.PORT || 3300,
};

export const METEOSWISS = {
  BASE_URL: "https://www.meteoswiss.admin.ch",
  PRODUCT_OUTPUT_PATH: "/product/output",
  get VERSIONS_PATH() {
    return `${this.PRODUCT_OUTPUT_PATH}/versions.json`;
  },
  get PRECIPITATION_PATH() {
    return `${this.PRODUCT_OUTPUT_PATH}/precipitation/animation`;
  },
};

export const MIME_TYPES: Record<string, string> = {
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".html": "text/html",
};

export const CACHE = {
  MAX_AGE: 300, // 5 minutes in seconds
};

export const RETRY = {
  MAX_ATTEMPTS: 3,
  INITIAL_DELAY: 1000, // 1 second
  MAX_DELAY: 10000, // 10 seconds
  JITTER_MAX: 300, // maximum random delay in ms
};
