/**
 * This is a collection of functions to write to contract via constructing and  submitting a transaction
 */

import {
  ERC721_LOGIC_CONTRACT_ADDRESS,
  ECOMERCE_CONTRACT_ADDRESS,
  FACTORY_CONTRACT_ADDRESS,
  fetchAbiOfContractAt,
} from "../wallet/abiHelper";
import { assert } from "../wallet/web3Helper";
import { callFunction } from "./cao";
import * as ethers from "ethers";
import { getChainIdFromContract } from "../wallet/wallet";

const ERC_721_PROXY = "ERC_721_PROXY";
const PROXY_TYPES = [ERC_721_PROXY, "ECOMERCE"];
const TYPE_ADDR_MAPS = {
  ECOMERCE: ECOMERCE_CONTRACT_ADDRESS,
  ERC_721_PROXY: ERC721_LOGIC_CONTRACT_ADDRESS
}

/**
 * Create an ERC721 proxy owned by ownerAddr
 * @param {*} ownerAddr
 */
export const createERC721Proxy = async (name, tokenName, tokenSymbol, collectionSize) => {
  return await createProxy(name, ERC_721_PROXY, {
    name: tokenName,
    symbol: tokenSymbol,
    collectionSize: collectionSize,
  });
};

/**
 * Create an ECOMERCE proxy owned by ownerAddr
 * @param {*} ownerAddr
 */
export const createECOMERCEProxy = async (name, tokenName, tokenSymbol) => {
  return await createProxy(name, "ECOMERCE", {
    name: tokenName,
    symbol: tokenSymbol,
  });
};

const createProxy = async (name, proxyType, initializerArgs) => {
  assert(
    PROXY_TYPES.includes(proxyType),
    `Unsupported proxy type: ${proxyType}`
  );

  const contractAddr = TYPE_ADDR_MAPS[proxyType];
  const chainID = await getChainIdFromContract();
  const encodeInit = async (contractAddr, args) => {
    const completeAbi = await fetchAbiOfContractAt(
      contractAddr,
      chainID
    ); //TODO: different network?
    console.log("encodeInit", completeAbi);
    const ABI = completeAbi
      .filter((func) => func.name === "initialize")[0]
      .inputs.reduce((prev, cur, idx, arr) => {
        const res =
          prev +
          cur.internalType +
          " " +
          cur.name +
          (idx < arr.length - 1 ? ", " : ")");
        return res;
      }, "function initialize(");
    console.log(`ABI: ${ABI}`);
    const target =
      "function initialize(string name_, string symbol_)";
    assert(ABI === target, `${ABI} vs ${target}`);
    const iface = new ethers.utils.Interface([ABI]);
    const bytes = await iface.encodeFunctionData("initialize", [
      args.name,
      args.symbol,
    ]);
    return bytes;
  };

  const dataBytes = await encodeInit(contractAddr, initializerArgs);
  console.log("databytes", dataBytes);

  // TODO: How do we make sure the transaction succeeds?
  return await callFunction(
    FACTORY_CONTRACT_ADDRESS,
    "createProxy",
    [name, contractAddr, dataBytes],
    0,
    true
  );
};

export const setProxyCurrentRound = async (proxyAddr, curRound) => {
  return await callFunction(proxyAddr, "setCurrentRound", [curRound], 0, true);
};

export const setProxySetSupply = async (proxyAddr, tokenId, newSupply) => {
  return await callFunction(proxyAddr, "setSupply", [tokenId, newSupply], 0, true);
};

export const setProxySetMintOn = async (proxyAddr, tokenId, status) => {
  return await callFunction(proxyAddr, "setMintOn", [tokenId, status], 0, true);
};

export const setProxySetSaleInfo = async (proxyAddr, tokenId, price, maxSupply, isAllowlist, merkleTree) => {
  return await callFunction(proxyAddr, "setSaleInfo", [tokenId, price, maxSupply, isAllowlist, merkleTree], 0, true);
};

export const setProxyMint = async (proxyAddr, tokenId, amount) => {
  console.log("MINT", tokenId, amount);
  return await callFunction(proxyAddr, "mint", [tokenId, amount], 0, true);
};

export const setProxyBurn = async (proxyAddr, tokenId, amount) => {
  return await callFunction(proxyAddr, "forgeToken", [tokenId, amount], 0, true);
};