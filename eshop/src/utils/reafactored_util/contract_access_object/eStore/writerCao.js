import { callFunction } from "../cao";

export const setTokenUrl = async (tokenId, url, proxyAddr) => {
  await callFunction(proxyAddr, "setTokenURIs", [tokenId, url], 0, true);
};

export const addProduct = async (supply, price, url, proxyAddr) => {
  await callFunction(
    proxyAddr,
    "addTokenAndConfigureUri",
    [supply, price, url],
    0,
    true
  );
};
