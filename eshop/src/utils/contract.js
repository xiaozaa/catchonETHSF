import { getCurrentNetwork, isWeb3Initialized, switchNetwork, web3 } from './wallet.js';
import { normalizeURL } from "./utils.js";
import { NETWORKS } from "./constants.js";
import { abiSelector } from './abi.js';

export let Contracts = {};

const abiMemoryCache = {};

export const initContract = async (contract, shouldSwitchNetwork = true) => {
    const host = normalizeURL(window.location.href);
    const allowedURLs = contract?.allowedURLs?.map(u => normalizeURL(u));
    if (allowedURLs && !allowedURLs?.some(v => v.includes(host))) {
        return undefined;
    }
    let currentNetwork = await getCurrentNetwork();
    if (shouldSwitchNetwork && !contract.allowedNetworks.includes(currentNetwork)) {
        await switchNetwork(contract.allowedNetworks[0])
        currentNetwork = await getCurrentNetwork();
    }
    const address = contract.address[contract.allowedNetworks[0]];
    const abi = contract.abi;
    return new web3.eth.Contract(abi, address);
}

const initContractGlobalObject = async (addr, implementationAddress) => {
    if (!addr) {
        alert("You forgot to insert your NFT contract address in your Webflow Embed code. Insert your contract address, publish the website and try again.")
        return
    }
    const chainID = getConfigChainID();

    return {
        address: {
            [chainID]: addr,
        },
        abi: await fetchABI(implementationAddress, chainID),
        allowedNetworks: [chainID]
    }
}

export const getConfigChainID = () => {
    // Default to Ethereum
    //TODO : add networkID config here
    const networkID = window.NETWORK_ID ?? 1;
    return 5;
}

export const fetchABI = async (address, chainID) => {
    if (abiSelector[chainID]) {
        if (abiSelector[chainID][address]) {
            return abiSelector[chainID][address]
        }
    }
    return undefined;
}

export const setContracts = async (contractAddr, implementationAddress, shouldSwitchNetwork = true) => {
    const contract = await initContractGlobalObject(contractAddr, implementationAddress);
    if (!isWeb3Initialized()) {
        return
    }
    if (shouldSwitchNetwork) {
        await switchNetwork(contract.allowedNetworks[0]);
    }
    if (Contracts) {
        if (contractAddr in Contracts) {
            return
        }
    }
    Contracts[contractAddr] = await initContract(contract, false);
    console.log("NFTContract", Contracts)
}

export const isEthereumContract = () => ([1, 4].includes(window.CONTRACT.nft.allowedNetworks[0]))
