import { GAS_INCREASE } from "./constants";
import { Contracts } from "./contract";
import { web3, getWalletAddressOrConnect } from "./wallet";
import { getExtraData } from "./contractDecode";

const errorInfo = {
  "0xb2348091": "Sorry, you cannot mint more than allowed per wallet.",
  "0x274ccf27": "Sorry, the signature is invalid.",
  "0xafb53c54":
    "Sorry, the allowlist mint isn't open. Current round is for mintlist users.",
  "0x4f1ddc5a": "Sorry, public mint is not stated yet.",
  "0x688ef65c": "Sorry, you cannot mint more than max cap.",
  "0xa733df5e": "Sorry, you don't have enough ETH in your wallet.",
  "0x212582c3": "Sorry, allowlist sale is not started yet.",
  "0xf87df8af": "Sorry, you need to mint 4 NFTs for this round",
};

const formatMintTransaction = async (contractAddr, args, method, value) => {
  if (!Contracts[contractAddr]) {
    alert("No valid contract set");
    return;
  }
  const Contract = Contracts[contractAddr];
  const address = await getWalletAddressOrConnect(true);
  const targetContract = Contract.options.address;
  var extraData = await getExtraData(Contract, method, args);
  var input = extraData.encodeABI();
  console.log("finalPrice", value, typeof value);
  const estimatedGas = await web3.eth.estimateGas({
    from: address,
    data: input,
    to: targetContract,
    value: web3.utils.toWei(value.toString(), "wei"),
  });
  const nonce = await web3.eth.getTransactionCount(address, "latest");
  return {
    gas: parseInt(estimatedGas * GAS_INCREASE),
    to: targetContract,
    from: address,
    value: web3.utils.toWei(value.toString(), "wei"),
    data: web3.utils.toHex(input),
    nonce,
  };
};

export const MintTransaction = async (
  contractAddr,
  method,
  args,
  value,
  setTxHash,
  setMintState,
  setErrorInfo
) => {
  if (!web3) {
    return;
  }

  try {
    const tx = await formatMintTransaction(contractAddr, args, method, value);
    function sendTransaction(_tx) {
      return new Promise((resolve, reject) => {
        web3.eth
          .sendTransaction(_tx)
          .once("transactionHash", (txHash) => resolve(txHash))
          .catch((err) => reject(err));
      });
    }
    const result = await sendTransaction(tx);
    setTxHash(result);
    setMintState(2);

    const interval = setInterval(function () {
      web3.eth.getTransactionReceipt(result, function (err, rec) {
        if (rec) {
          clearInterval(interval);
          setMintState(3);
        }
      });
    }, 1000);
  } catch (error) {
    console.error("CATCHERROR", error);
    setMintState(0);
    var myRe = /{.*}/g;
    var str = error.message.replace(/(\r\n|\n|\r)/gm, "");
    var errArray = myRe.exec(str);
    if (errArray && errArray.length > 0) {
      console.log("ERROR", errArray[0]);
      if (JSON.parse(errArray[0]).originalError.data) {
        const errorCode = JSON.parse(errArray[0]).originalError.data;
        const errorDetails = errorInfo[errorCode];
        setErrorInfo(errorDetails);
      } else {
        setErrorInfo(error.originalError.message);
      }
    } else {
      setErrorInfo(error.message);
    }
  }
};

// export const getStatus = async (contractAddr, method, args) => {
//     if (!Contracts[contractAddr]) {
//         alert("No valid contract set")
//         return
//     }
//     const Contract = Contracts[contractAddr];
//     console.log("CONTRACT", Contract);
//     if (args !== undefined) {
//         return await Contract.methods[method](args).call();
//     }
//     else {
//         return await Contract.methods[method]().call();
//     }

// }
