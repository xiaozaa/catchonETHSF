import { MOCK } from "../constants";

// TODO: this can be getNumOfItems(proxyAddr)
export async function getItemIdList(proxyAddr) {
  if (MOCK) {
    return [0, 1];
  }
}

export async function getNameOf(productId, proxyAddr) {
  if (MOCK) {
    const mockMap = {
      0: "Shoe",
      1: "Shirt",
    };
    return mockMap[productId];
  }
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
