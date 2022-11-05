import { formatWalletAddress } from "./reafactored_util/wallet/utils";
import { connectToWallet, getWalletAddress, initProxyContract } from "./reafactored_util/wallet/wallet";
import { isWeb3Initialized } from "./reafactored_util/wallet/web3Helper";
import { getContractInfoRecur } from "./status";

const getConnectButton = () => {
    console.log("getConnectButton")
    const btnID = window.buttonID ?? '#connect';
    return document.querySelector(btnID)
        ?? document.querySelector(`a[href='${btnID}']`);
}

export const updateConnectButton = () => {
    const walletBtn = getConnectButton();
    console.log(walletBtn);
    walletBtn?.addEventListener('click', async () => {
        console.log("CLICK the button")
        await connectToWallet();
        await updateWalletStatus();
        await initProxyContract(window.CONTRACT_ADDRESS, window.LOGIC_ADDRESS);
        // await getContractInfoRecur(window.CONTRACT_ADDRESS, 0);
    });
}

export const updateWalletStatus = async () => {
    if (!isWeb3Initialized()) {
        console.log("can't read wallet before initialized!");
        return;
    }
    const button = getConnectButton();
    if (button) {
        const userAddr = await getWalletAddress();
        console.log("useraddr", userAddr);
        button.textContent = window?.DEFAULTS?.labels?.walletConnected ?? formatWalletAddress(userAddr);
    }
}