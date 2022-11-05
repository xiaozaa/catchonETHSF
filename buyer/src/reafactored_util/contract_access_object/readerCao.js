/**
 * This is a collection of functions to read from contract, i.e. Contract Access Object
 */

import { ENABLE_MOCK } from "../../constants";
import { FACTORY_CONTRACT_ADDRESS } from "../wallet/abiHelper";
import { callViewFunction, readParam } from "./cao";
import { MOCK } from "./constants";

/**
 * Returns a list of addresses of proxies owned by ownerAddr.
 * e.g.
 * ['0xd06DF76754d2C6bDE84fD3A36951DD0AfDcF7235']
 */
export const getListOfAppsOwnedBy = async (ownerAddr) => {
  if (ENABLE_MOCK) {
    return ["0xd06DF76754d2C6bDE84fD3A36951DD0AfDcF7235"];
  }
  return await callViewFunction(FACTORY_CONTRACT_ADDRESS, "getProxiesOwnedBy", [
    ownerAddr,
  ]);
};

/**
 * Return owner address of the given proxy
 * @param {*} proxyAddr
 * @returns e.g. 0xCA81144D8439682F87799c52D51baDA1F0f38D3C
 */
export const getProxyOwner = async (proxyAddr) => {
  if (ENABLE_MOCK) {
    return "0xCA81144D8439682F87799c52D51baDA1F0f38D3C";
  }
  return await callViewFunction(FACTORY_CONTRACT_ADDRESS, "getOwnerOfProxy", [
    proxyAddr,
  ]);
};

/**
 * 
 * @param {*} proxyAddr 
 * @returns 
 * example:
 * {
    "0":"dummy",
    "1":"1666589352",
    "2":"0x708d2502422ee498CfcF020d78Cf08211696D93A",
    "3":"0xCA81144D8439682F87799c52D51baDA1F0f38D3C",
    "4":true,
    "name":"dummy",
    "createTime":"1666589352",
    "logicAddress":"0x708d2502422ee498CfcF020d78Cf08211696D93A",
    "owner":"0xCA81144D8439682F87799c52D51baDA1F0f38D3C",
   }
 */
export const getMetaDataOfProxy = async (proxyAddr) => {
  if (ENABLE_MOCK) {
    return {
      0: "Nike Shoes",
      1: "1666589352",
      2: "0x708d2502422ee498CfcF020d78Cf08211696D93A",
      3: "0xCA81144D8439682F87799c52D51baDA1F0f38D3C",
      4: true,
      name: "Nike Shoes",
      createTime: "1666589352",
      logicAddress: "0x708d2502422ee498CfcF020d78Cf08211696D93A",
      owner: "0xCA81144D8439682F87799c52D51baDA1F0f38D3C",
    };
  }
  const res = await callViewFunction(
    FACTORY_CONTRACT_ADDRESS,
    "metaDataByProxyAddr",
    [proxyAddr]
  );
  return res;
};

/**
 * A testing function to make sure we are able to call function on proxy
 * @param {*} proxyAddr
 */
export const getProxySymbol = async (proxyAddr) => {
  const res = await callViewFunction(proxyAddr, "symbol", []);
  return res;
};

export const getProxyCurrentRound = async (proxyAddr) => {
  const res = await readParam(proxyAddr, "currentRound");
  return res;
};

export const getProxyMintInfoOfRound = async (proxyAddr, round) => {
  const res = await callViewFunction(proxyAddr, "mintInfo", [round]);
  return res;
};

export const getProxyIsMintOn = async (proxyAddr, round) => {
  const res = await callViewFunction(proxyAddr, "isMintOn", [round]);
  return res;
};

export const getProxyCurrentRoundByTokenID = async (proxyAddr, tokenId) => {
  const res = await callViewFunction(proxyAddr, "currentRound", [tokenId]);
  return res;
};

export const getProxyIsMintOnByTokenID = async (proxyAddr, tokenId) => {
  const res = await callViewFunction(proxyAddr, "isMintOn", [tokenId]);
  return res;
};

export const getProxyMintInfoByTokenID = async (proxyAddr, tokenId, currentRound) => {
  const res = await callViewFunction(proxyAddr, "mintInfo", [tokenId, currentRound]);
  return res;
};

/**
 * Returns proxy specific data.
 * TODO: fill XX with meaningful wording, e.g. getProxyPublicMintTime
 */
export const getProxyXX = async (proxyAddr) => { };
