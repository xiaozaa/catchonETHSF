export const normalizeURL = (u) => new URL(u).host.replace("www.", "");

export const isMobile = () =>
  /Mobi/i.test(window.navigator.userAgent) ||
  /iPhone|iPod|iPad/i.test(navigator.userAgent);

export const objectMap = (object, mapFn) => {
  return Object.keys(object).reduce((result, key) => {
    result[key] = mapFn(object[key]);
    return result;
  }, {});
};

export const formatWalletAddress = (address) => {
  return address && `${address.substring(0, 4)}...${address.substring(40)}`;
};
