import { callViewFunction, readParam } from "../cao";
import { MOCK } from "../constants";

const fetchUrlObj = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

// TODO: this can be getNumOfItems(proxyAddr)
export async function getItemIdList(proxyAddr) {
  if (MOCK) {
    return [0, 1];
  }
  const boundry = await readParam(proxyAddr, "boundry");
  console.log("boundry of proxyAddr: ", proxyAddr, " is ", boundry);
  console.log("this?: ", Array.from(Array(parseInt(boundry)).keys()));
  return Array.from(Array(parseInt(boundry)).keys());
}

export async function getNameOf(productId, proxyAddr) {
  if (MOCK) {
    const mockMap = {
      0: "Shoe",
      1: "Shirt",
    };
    return mockMap[productId];
  }

  const tokenUri = await getUrl(productId, proxyAddr);
  console.log("Fetched uri of token ", productId, "is: ", tokenUri);
  const jsonObj = await fetchUrlObj(tokenUri);
  console.log("Fetched json object: ", jsonObj);

  return jsonObj.name;
}

export async function getSupplyOf(productId, proxyAddr) {
  if (MOCK) {
    const mockMap = {
      0: 1000,
      1: 500,
    };
    return mockMap[productId];
  }
}

export async function getBalanceOf(productId, proxyAddr) {
  if (MOCK) {
    const mockMap = {
      0: 432,
      1: 123,
    };
    return mockMap[productId];
  }
}

export async function getSalesAmountOf(productId, proxyAddr) {
  if (MOCK) {
    const mockMap = {
      0: 10.8,
      1: 9.2,
    };
    return mockMap[productId];
  }
}

export async function getUrl(tokenId, proxyAddr) {
  return await callViewFunction(proxyAddr, "uri", [tokenId]);
}
