import { getWalletAddress } from './reafactored_util/wallet/wallet';
import { getProof } from './utils';

export const allowlistCheck = async () => {
    const address = await getWalletAddress(true);
    console.log("allowlistCheck", address);
    return checkAllowlistByAddress(address);
}

export const checkAllowlistByAddress = async (address) => {

}