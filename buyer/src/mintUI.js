import { setButtonText } from './utils';
import { setMintInfo, showMintModal } from './components/operateModal';
import { getContractInfo } from './status';
import { getWalletAddress } from './reafactored_util/wallet/wallet';
export const updateMintButton = () => {
    const mintButtons = [
        ...document.querySelectorAll("[id^='mintbutton']"),
        ...document.querySelectorAll("a[href*='#mintbutton']")
    ]
    if (mintButtons) {
        console.log(mintButtons);

        mintButtons.forEach((mintButton) => {
            mintButton.href = "#"
            mintButton.onclick = async () => {
                const initialBtnText = mintButton.textContent;
                const splitID = mintButton.id.split('-');
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

                setButtonText(mintButton, "Loading...")
                try {
                    // const quantity = getMintQuantity();
                    const address = await getWalletAddress()
                    const info = await getContractInfo(tokenId);
                    // const info = await getContractInfo();
                    console.log('updateMintButton', address, info);
                    if (address) {
                        showMintModal(tokenId, info);
                    }
                    else {
                        console.log("Please connect wallet before mint.")
                    }
                } catch (e) {
                    console.log("Error on pressing mint")
                    console.error(e)
                    alert(`Error on mint: ${e}`)
                }
                setButtonText(mintButton, initialBtnText)
            }
        })
    }
}