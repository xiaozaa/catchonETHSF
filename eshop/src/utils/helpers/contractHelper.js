import {
  FACTORY_CONTRACT_ADDR,
  IMPLEMENTATION_ADDRESS,
  PROXY_FACTORY_FUNCTION_MAPPER,
  PROXY_FUNCTION_MAPPER,
} from "../constants";
import { Contracts } from "../contract";
import { MintTransaction } from "../mint";
import { encodeInit } from "../utils";

export const getStatus = async (contractAddr, method, args) => {
  if (!Contracts[contractAddr]) {
    alert(`No valid contract set at ${contractAddr}`);
    return;
  }
  const Contract = Contracts[contractAddr];
  console.log("CONTRACT", Contract);
  if (args !== undefined) {
    return await Contract.methods[method](args).call();
  } else {
    return await Contract.methods[method]().call();
  }
};

export const getAppListData = async (adminAddress) => {
  const proxyContractList = await getStatus(
    FACTORY_CONTRACT_ADDR,
    PROXY_FACTORY_FUNCTION_MAPPER.getProxyAddressList,
    adminAddress
  );
  if (!proxyContractList) {
    console.log("No Proxy Found");
  }
  return proxyContractList;
};

export const getProxyMetaData_deprecated = async (proxyAddr, adminAddress) => {
  const proxyContractList = await getStatus(
    FACTORY_CONTRACT_ADDR,
    PROXY_FACTORY_FUNCTION_MAPPER.getProxyAddressList,
    adminAddress
  );
  if (!proxyContractList) {
    console.log("No Proxy Found");
  }
  return proxyContractList;
};

export const getProxyName = async (proxyAddr, adminAddress) => {
  const proxyName = await getStatus(proxyAddr, PROXY_FUNCTION_MAPPER.name);
  if (!proxyName) {
    console.log("No Name Returned");
  }
  return proxyName;
};

export const createProxy = async (name) => {
  const creatProxyCallData = await encodeInit("Huazhong", "HUST", 123);
  await MintTransaction(
    FACTORY_CONTRACT_ADDR,
    PROXY_FACTORY_FUNCTION_MAPPER.createProxy,
    [name, IMPLEMENTATION_ADDRESS, creatProxyCallData],
    0
  );
};

export const getProxyMetaData = async (proxyAddr) => {
  const metaData = await getStatus(
    FACTORY_CONTRACT_ADDR,
    PROXY_FUNCTION_MAPPER.getMetaData,
    proxyAddr.toLowerCase()
  );
  return metaData;
};
