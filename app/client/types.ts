export interface VersionsData {
  'precipitation/animation': string;
}

export interface AnimationData {
    cities: City[];
    legend: LegendItem[];
    map_images: [{
        day: string;
        pictures: Array<PictureInfo>;
        timepoint: string;
    }];
    config: Config;
}

export interface City {
    city_name: string;
    min_zoom: number;
    coord_x: number;
    coord_y: number;
    location_id: string;
}

export interface LegendItem {
    min: number;
    color: string;
    max: number;
}

export interface PictureInfo {
  data_type_string: string;
  radar_url: string;
  data_type: 'measurement' | 'forecast';
  day: string;
  timepoint: string;
  timestamp: number;
  // Optional properties for forecast type
  snowrain_url?: string;
  freezingrain_url?: string;
  snow_url?: string;
}

export interface Config {
    name: string;
    language: string;
    version: string;
    timestamp: number;
}
