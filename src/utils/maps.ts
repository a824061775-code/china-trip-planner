/**
 * Utility to generate map URLs for various providers.
 */

export const getGoogleMapsUrl = (query: string) => {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

export const getAppleMapsUrl = (query: string) => {
  return `https://maps.apple.com/?q=${encodeURIComponent(query)}`;
};

export const getAmapUrl = (query: string, city: string) => {
  return `https://uri.amap.com/search?keyword=${encodeURIComponent(query)}&city=${encodeURIComponent(city)}&mode=0`;
};

export const getBaiduMapsUrl = (query: string, city: string) => {
  return `https://api.map.baidu.com/place/search?query=${encodeURIComponent(query)}&region=${encodeURIComponent(city)}&output=html`;
};
