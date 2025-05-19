export interface AdsConfig {
    adProbability: number;
    minTimeBetweenAds: number;
}

export interface Config {
    id: number;
    adsConfig: AdsConfig;
    createdAt: string;
    updatedAt: string;
}