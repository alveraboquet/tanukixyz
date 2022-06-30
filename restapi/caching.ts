// simple utility memory cache data
import { getTimestamp } from '../lib/helper';

interface Caching {
  [index: string]: {
    expire: number;
    data: any;
  };
}

const cacheLife = 10 * 60; // 10 minutes
let memoryCache: Caching = {};

export function getCache(key: string): any {
  if (!memoryCache[key]) return null;

  const timestamp = getTimestamp();
  if (memoryCache[key].expire < timestamp) return null;

  return memoryCache[key].data;
}

export function setCache(key: string, data: any): any {
  memoryCache[key] = {
    expire: getTimestamp() + cacheLife,
    data,
  };
}
