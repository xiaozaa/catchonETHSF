// import { updateConnectButton, updateWalletStatus } from "./wallet.js";
import { updateMintButton } from "./mintUI";
import { updateBurnButton } from "./burnUI";
import { getContractInfoRecur } from "./status.js";
import { getWalletAddress, initProxyContract } from "./reafactored_util/wallet/wallet.js";
import { updateConnectButton } from "./buttonCheck";
// import { blacklist } from "./blacklist";

export const init = async () => {

    // await updateWalletStatus();
    await updateConnectButton();
    // const userAddr = await getWalletAddress();
    // console.log("useraddr", userAddr);


    updateMintButton();
    updateBurnButton();
}

// init();
