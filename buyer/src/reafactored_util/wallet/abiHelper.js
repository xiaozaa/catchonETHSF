import fetch from "node-fetch";
import { API_DB } from "../../constants";
import * as _ from "lodash";
/**
 * This file will be untimately replaced by Database calls.
 */

const chainAddress = {
  goerli: {
    chainId: 5,
    factoryAddr: "0x32d430f0A0c1E8Cd2CD6efE01D3230D3805f7E3C",
    erc721LogicAddr: "0x697ab37b8d975340Db4077083db685826af67503",
    ecomerceLogicAddr: "0xd497Ca3b0F87f2dc330dDce7EC79Ddc09927A602",
  },
  sepolia: {
    chainId: 11155111,
    factoryAddr: "0x942d0529c8478AB991D68280229142Cb7fE89A75",
    erc721LogicAddr: "",
    ecomerceLogicAddr: "0xe9881925B4Bc0aa390Ce12630864D7835C03184F", // with counter
  },
};

const SELECTED_CHAIN = "sepolia";

export const FACTORY_CONTRACT_ADDRESS =
  chainAddress[SELECTED_CHAIN]["factoryAddr"];
export const ERC721_LOGIC_CONTRACT_ADDRESS =
  chainAddress[SELECTED_CHAIN]["erc721LogicAddr"];
export const ECOMERCE_CONTRACT_ADDRESS =
  chainAddress[SELECTED_CHAIN]["ecomerceLogicAddr"];

// TODO: when converting this to db calls, remember to add "async" here and "await" at callers
// TODO: select contract abi based on chainId: is it necessary?
export const fetchAbiOfContractAt = async (contractAddr, chainId) => {
  if (contractAddr in abi) {
    return abi[contractAddr];
  } else {
    return await fetch(API_DB + "abi/" + chainId + "/" + contractAddr, {
      method: "GET",
    })
      .then((response) => response.json())
      .then(async (response) => {
        const dataFromDb = _.get(response, ["Item", "Abi"]);
        console.log("ABI", dataFromDb);
        if (dataFromDb) {
          abi[contractAddr] = JSON.parse(dataFromDb);
          return JSON.parse(dataFromDb);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
};

// This is the "Database"
const abi = {
  [ERC721_LOGIC_CONTRACT_ADDRESS]: [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "ApprovalCallerNotOwnerNorApproved",
      type: "error",
    },
    {
      inputs: [],
      name: "ApprovalQueryForNonexistentToken",
      type: "error",
    },
    {
      inputs: [],
      name: "BalanceQueryForZeroAddress",
      type: "error",
    },
    {
      inputs: [],
      name: "MintERC2309QuantityExceedsLimit",
      type: "error",
    },
    {
      inputs: [],
      name: "MintToZeroAddress",
      type: "error",
    },
    {
      inputs: [],
      name: "MintZeroQuantity",
      type: "error",
    },
    {
      inputs: [],
      name: "OwnerQueryForNonexistentToken",
      type: "error",
    },
    {
      inputs: [],
      name: "OwnershipNotInitializedForExtraData",
      type: "error",
    },
    {
      inputs: [],
      name: "TransferCallerNotOwnerNorApproved",
      type: "error",
    },
    {
      inputs: [],
      name: "TransferFromIncorrectOwner",
      type: "error",
    },
    {
      inputs: [],
      name: "TransferToNonERC721ReceiverImplementer",
      type: "error",
    },
    {
      inputs: [],
      name: "TransferToZeroAddress",
      type: "error",
    },
    {
      inputs: [],
      name: "URIQueryForNonexistentToken",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "approved",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "ApprovalForAll",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "fromTokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "toTokenId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
      ],
      name: "ConsecutiveTransfer",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint8",
          name: "version",
          type: "uint8",
        },
      ],
      name: "Initialized",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "collectionSize",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "currentRound",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "quantity",
          type: "uint256",
        },
      ],
      name: "devMint",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "getApproved",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "name_",
          type: "string",
        },
        {
          internalType: "string",
          name: "symbol_",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "collectionSize_",
          type: "uint256",
        },
      ],
      name: "initialize",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
      ],
      name: "isApprovedForAll",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "round",
          type: "uint256",
        },
      ],
      name: "isMintOn",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "quantity",
          type: "uint256",
        },
        {
          internalType: "bytes32[]",
          name: "merkleProof",
          type: "bytes32[]",
        },
      ],
      name: "mint",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "mintInfo",
      outputs: [
        {
          internalType: "uint256",
          name: "startTime",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "endTime",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "maxAvailable",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "purchaseLimit",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "isAllowlist",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "ownerOf",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "register",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "royaltyAddress",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "salePrice",
          type: "uint256",
        },
      ],
      name: "royaltyInfo",
      outputs: [
        {
          internalType: "address",
          name: "receiver",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "royaltyAmount",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "royaltyPercent",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "_data",
          type: "bytes",
        },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "setApprovalForAll",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "baseURI",
          type: "string",
        },
      ],
      name: "setBaseURI",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_currentRound",
          type: "uint256",
        },
      ],
      name: "setCurrentRound",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_currentRound",
          type: "uint256",
        },
        {
          internalType: "bytes32",
          name: "_merkleRoot",
          type: "bytes32",
        },
      ],
      name: "setMerkleRoot",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "royaltyPercentage",
          type: "uint256",
        },
      ],
      name: "setRoyaltyPercentage",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "royaltyReceiver",
          type: "address",
        },
      ],
      name: "setRoyaltyReceiver",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_startTime",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_endTime",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_maxAvailable",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_purchaseLimit",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_price",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "_isAllowlist",
          type: "bool",
        },
        {
          internalType: "uint256",
          name: "_index",
          type: "uint256",
        },
      ],
      name: "setupMintInfo",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes4",
          name: "interfaceId",
          type: "bytes4",
        },
      ],
      name: "supportsInterface",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "tokenURI",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "transferFrom",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "withdrawMoney",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
};
