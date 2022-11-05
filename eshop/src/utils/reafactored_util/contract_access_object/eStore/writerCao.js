import { callFunction } from "../cao";

export const setTokenUrl = async (tokenId, url, proxyAddr) => {
  await callFunction(proxyAddr, "setTokenURIs", [tokenId, url], 0, true);
};

export const addProduct = async (supply, url, proxyAddr) => {
  await callFunction(
    proxyAddr,
    "addTokenAndConfigureUri",
    [supply, url],
    0,
    true
  );
};
