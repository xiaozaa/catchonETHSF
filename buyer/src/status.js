import { getProxyCurrentRoundByTokenID, getProxyIsMintOnByTokenID, getProxyMintInfoByTokenID } from "./reafactored_util/contract_access_object/readerCao";

let recursiveCheck = undefined;

export const getContractInfoRecur = async (contract, tokenId) => {
    const mintInfo = await getContractInfo(contract, tokenId);
    console.log("getContractInfoRecur", mintInfo);
    // setMintInfo(mintInfo);
    // if (!recursiveCheck) {
    //     recursiveCheck = setInterval(async function () {
    //         const mintInfo = await getContractInfo();
    //         console.log("getContractInfoRecur", mintInfo);
    //         setMintInfo(mintInfo);
    //     }, MINTED_CHECK_CAP);
    // }
}

export const getContractInfo = async (tokenId) => {
    const currentRound = await getProxyCurrentRoundByTokenID(window.CONTRACT_ADDRESS, tokenId);
    const isMintOn = await getProxyIsMintOnByTokenID(window.CONTRACT_ADDRESS, tokenId);
    const saleInfo = await getProxyMintInfoByTokenID(window.CONTRACT_ADDRESS, tokenId, currentRound);
    const info = {
        currentRound,
        isMintOn,
        price: saleInfo[0],
        stock: saleInfo[1],
        isAllowlist: saleInfo[2]
    }
    return info
}

