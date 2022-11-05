import { setButtonText } from './utils';
import { showBurnModal } from './components/operateModal';
import { getContractInfo } from './status';
import { getWalletAddress } from './reafactored_util/wallet/wallet';
export const updateBurnButton = () => {
    const burnButtons = [
        ...document.querySelectorAll("[id^='burn-button']"),
        ...document.querySelectorAll("a[href*='#burn-button']")
    ]
    if (burnButtons) {
        console.log(burnButtons);

        burnButtons.forEach((burnButton) => {
            burnButton.href = "#"
            burnButton.onclick = async () => {
                const initialBtnText = burnButton.textContent;
                const splitID = burnButton.id.split(' ');
                if (splitID.length <= 1) {
                    alert("Invalid button ID, please fix your butthon settings");
                    return
                }
                function isNumeric(str) {
                    if (typeof str != "string") return false // we only process strings!  
                    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
                        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
                }
                if (!isNumeric(splitID[1])) {
                    alert("Invalid button ID, please fix your butthon settings");
                    return
                }
                const tokenId = splitID[1];
                console.log("Token ID", tokenId);

                setButtonText(burnButton, "Loading...")
                try {
                    // const quantity = getburnQuantity();
                    const address = await getWalletAddress()
                    const info = await getContractInfo(tokenId);
                    // const info = await getContractInfo();
                    console.log('updateburnButton', address, info);
                    if (address) {
                        showBurnModal(tokenId, info);
                    }
                    else {
                        console.log("Please connect wallet before burn.")
                    }
                } catch (e) {
                    console.log("Error on pressing burn")
                    console.error(e)
                    alert(`Error on burn: ${e}`)
                }
                setButtonText(burnButton, initialBtnText)
            }
        })
    }
}