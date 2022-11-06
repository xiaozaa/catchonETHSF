import { getProxyPriceByTokenID, getProxyIsMintOnByTokenID } from "./reafactored_util/contract_access_object/readerCao";

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
    const isMintOn = await getProxyIsMintOnByTokenID(window.CONTRACT_ADDRESS, tokenId);
    const price = await getProxyPriceByTokenID(window.CONTRACT_ADDRESS, tokenId);
    const info = {
        isMintOn,
        price: price,
    }
    return info
}

