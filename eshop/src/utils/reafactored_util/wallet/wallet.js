import * as eth_util from "eth-sig-util";
import { ENABLE_MOCK } from "../../constants";
import { MOCK } from "../contract_access_object/constants";
import {
  ERC721_LOGIC_CONTRACT_ADDRESS,
  FACTORY_CONTRACT_ADDRESS,
  fetchAbiOfContractAt,
} from "./abiHelper";
import { normalizeURL } from "./utils";
import { tryInitWeb3, web3, provider } from "./web3Helper";

import {
  assert,
  getCurrentNetwork,
  isWeb3Initialized,
  switchNetwork,
} from "./web3Helper";

let initializedContracts = {}; // initialized Contract objects
const LOGIN_VERIFICATION_PHRASE = "Login website";

export const fetchContractObjByAddr = (addr) => {
  assert(
    initializedContracts[addr],
    `No contract object initialized for address ${addr}!`
  );
  return initializedContracts[addr];
};

// TODO: what does shouldSwitchNetwork do?
export const initFactoryContract = async (
  factoryAddr = FACTORY_CONTRACT_ADDRESS,
  shouldSwitchNetwork = true
) => {
  await initContract(
    factoryAddr,
    FACTORY_CONTRACT_ADDRESS,
    shouldSwitchNetwork
  );
};

export const initProxyContract = async (
  proxyAddr,
  logicAddr = ERC721_LOGIC_CONTRACT_ADDRESS,
  shouldSwitchNetwork = true
) => {
  await initContract(proxyAddr, logicAddr, shouldSwitchNetwork);
};

export const initWallet = async () => {
  console.log("Connecting to wallet...");
  await tryInitWeb3(true);
  // await updateWalletStatus(); // TODO: as a function to initWallet, it should not be handling updating wallet status of a button
  console.log("Wallet connected!");
};

export const connectToWallet = async (refresh) => {
  if (isWeb3Initialized()) {
    console.log("can't connect to wallet again if web3 has been initialized!");
    return;
  }
  // assert(
  //   !isWeb3Initialized(),
  // );
  await initWallet();
  if (refresh) {
    window.location.reload();
  }
};

export const getWalletAddress = async () => {
  const currentAddress = async () => {
    try {
      return (await provider?.request({ method: "eth_requestAccounts" }))[0];
    } catch {
      await provider.enable();
      return (await web3.eth.getAccounts())[0];
    }
  };

  return await currentAddress();
};

export const verifyAccount = async () => {
  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];
  const message = LOGIN_VERIFICATION_PHRASE;
  const signature = await web3.eth.personal.sign(message, account);
  const msg = `0x${Buffer.from(message, "utf8").toString("hex")}`;
  const recoveredAddr = await eth_util.recoverPersonalSignature({
    data: msg,
    sig: signature,
  });
  console.log(recoveredAddr);
  return recoveredAddr.toLowerCase() === account.toLowerCase();
};

const initContract = async (
  contractAddr,
  abiAddr,
  shouldSwitchNetwork = true
) => {
  if (ENABLE_MOCK) {
    return;
  }

  if (contractAddr in initializedContracts) {
    return;
  }
  const contract = await initContractGlobalObject(contractAddr, abiAddr);
  assert(isWeb3Initialized(), "web3 not initialized!");
  if (shouldSwitchNetwork) {
    await switchNetwork(contract.allowedNetworks[0]); //TODO: allowedNetworks will be more than one
  }
  initializedContracts[contractAddr] = await init(contract);
};

const init = async (contract, shouldSwitchNetwork = false) => {
  const host = normalizeURL(window.location.href);
  const allowedURLs = contract?.allowedURLs?.map((u) => normalizeURL(u));
  if (allowedURLs && !allowedURLs?.some((v) => v.includes(host))) {
    return undefined; //TODO: what's this check doing?
  }
  let currentNetwork = await getCurrentNetwork();
  if (
    shouldSwitchNetwork &&
    !contract.allowedNetworks.includes(currentNetwork)
  ) {
    await switchNetwork(contract.allowedNetworks[0]);
  }
  const address = contract.address[contract.allowedNetworks[0]];
  const abi = contract.abi;
  return new web3.eth.Contract(abi, address);
};

const initContractGlobalObject = async (addr, abiAddr) => {
  // const chainID = 5; // TODO: what's the correct way of fetching chainID?
  const chainID = await web3.eth.getChainId();

  return {
    address: {
      [chainID]: addr,
    },
    abi: await fetchAbiOfContractAt(abiAddr, chainID),
    allowedNetworks: [chainID],
  };
};

export const getChainIdFromContract = async () => {
  if (initializedContracts.allowedNetworks) {
    return initializedContracts.allowedNetworks[0];
  }
  else {
    return await web3.eth.getChainId();
  }

}
