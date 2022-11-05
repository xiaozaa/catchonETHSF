export const NETWORKS = {
  1: {
    name: "Ethereum",
    rpcURL: "https://mainnet.infura.io/v3/d85b23f501584a4aa0a6cfdf6ad3d8bc",
    currency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    testnetID: 5,
    blockExplorerURL: "https://etherscan.io",
  },
  4: {
    name: "Rinkeby",
    rpcURL: "https://rinkeby.infura.io/v3/d85b23f501584a4aa0a6cfdf6ad3d8bc",
    currency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    testnetID: 4,
    blockExplorerURL: "https://rinkeby.etherscan.io",
  },
  137: {
    name: "Polygon",
    rpcURL: "https://polygon-rpc.com/",
    currency: {
      name: "Matic",
      symbol: "MATIC",
      decimals: 18,
    },
    testnetID: 80001,
    blockExplorerURL: "https://polygonscan.com",
  },
  80001: {
    name: "Mumbai (Polygon Testnet)",
    rpcURL: "https://rpc-mumbai.maticvigil.com/",
    currency: {
      name: "Matic",
      symbol: "MATIC",
      decimals: 18,
    },
    testnetID: 80001,
    blockExplorerURL: "https://mumbai.polygonscan.com",
  },
  56: {
    name: "Binance",
    rpcURL: "https://bsc-dataseed1.binance.org",
    currency: {
      name: "Binance Coin",
      symbol: "BNB",
      decimals: 18,
    },
    testnetID: 97,
    blockExplorerURL: "https://bscscan.com",
  },
  97: {
    name: "Binance Smart Chain Testnet",
    rpcURL: "https://data-seed-prebsc-1-s1.binance.org:8545",
    currency: {
      name: "Binance Coin",
      symbol: "tBNB",
      decimals: 18,
    },
    testnetID: 97,
    blockExplorerURL: "https://testnet.bscscan.com",
  },

  25: {
    name: "Cronos Blockchain",
    rpcURL: "https://evm-cronos.crypto.org",
    currency: {
      name: "Cronos",
      symbol: "CRO",
      decimals: 18,
    },
    testnetID: 338,
    blockExplorerURL: "https://cronos.crypto.org/explorer/",
  },
  338: {
    name: "Cronos Testnet",
    rpcURL: "https://cronos-testnet-3.crypto.org:8545/",
    currency: {
      name: "Cronos",
      symbol: "tCRO",
      decimals: 18,
    },
    testnetID: 338,
    blockExplorerURL: "https://cronos.crypto.org/explorer/testnet3/",
  },

  1285: {
    name: "Moonriver",
    rpcURL: "https://rpc.moonriver.moonbeam.network",
    currency: {
      name: "MOVR",
      symbol: "MOVR",
      decimals: 18,
    },
    testnetID: 1287,
    blockExplorerURL: "https://blockscout.moonriver.moonbeam.network",
  },
  1287: {
    name: "Moonbase Alpha",
    rpcURL: "https://rpc.testnet.moonbeam.network",
    currency: {
      name: "DEV",
      symbol: "DEV",
      decimals: 18,
    },
    testnetID: 1287,
    blockExplorerURL: "https://moonbase-blockscout.testnet.moonbeam.network",
  },
};

export const GAS_INCREASE = 1.16;

export const MINTED_CHECK_CAP = 5000;

export const FACTORY_CONTRACT_ADDR =
  //"0x031dC5b491B441a588BF6BaDECb511fA67856Ede";
  "0x64d7957dA876BeB219D92697601C91eb176D2755"; // this is the new factory which can return metadata

export const IMPLEMENTATION_ADDRESS =
  "0x697ab37b8d975340Db4077083db685826af67503";

export const PROXY_FACTORY_FUNCTION_MAPPER = {
  getProxyAddressList: "getProxiesOwnedBy",
  createProxy: "createProxy",
};

export const PROXY_FUNCTION_MAPPER = {
  name: "name",
  getMetaData: "getAppMetaData",
};

// Configs
export const ENABLE_MOCK = false;
export const API_DB = "https://11xykht95a.execute-api.us-west-1.amazonaws.com/";
