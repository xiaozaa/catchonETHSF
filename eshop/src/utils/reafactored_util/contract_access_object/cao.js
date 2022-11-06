/**
 * Contract Access Object(CAO)
 */

import { fetchContractObjByAddr, getWalletAddress } from "../wallet/wallet";
import { assert, web3 } from "../wallet/web3Helper";

export const GAS_INCREASE = 1.16;

export const readParam = async (contractAddr, paramName) => {
  const contractObj = fetchContractObjAt(contractAddr);
  // TODO: check if paramRes has any errors
  return getFunctionSignature(contractObj, paramName).then((funcSig) =>
    funcSig.call()
  );
};

export const callViewFunction = async (contractAddr, methodName, args) => {
  const contractObj = fetchContractObjAt(contractAddr);

  /*
  const funcSig = await getFunctionSignature(contractObj, methodName, args);
  return await funcSig.call();
  */
  console.log("callViewFunction", contractObj, methodName);
  return getFunctionSignature(contractObj, methodName, args).then((funcSig) =>
    funcSig.call()
  );
};

/**
 * This is for non-view function call only. For view function call, use callViewFunction() instead.
 */
export const callFunction = async (
  contractAddr,
  methodName,
  args,
  value = 0,
  requireGasOptimize = true
) => {
  const contractObj = await fetchContractObjAt(contractAddr);

  assert(contractObj, `contract obj is not defined: ${contractObj}`);

  const funcSig = await getFunctionSignature(contractObj, methodName, args);

  if (requireGasOptimize) {
    return await gasOptimizedFunctionCall(contractAddr, funcSig, value);
  } else {
    const options = { value: web3.utils.toWei(value.toString(), "wei") };
    // TODO: this does not work, why?
    return await funcSig.call(options);
  }
};

const getFunctionSignature = async (contractObj, functionName, args) => {
  if (args === undefined) {
    args = [];
  }
  const res = await contractObj.methods[functionName](...args);
  return res;
};

const gasOptimizedFunctionCall = async (contractAddr, funcSig, value) => {
  const input = funcSig.encodeABI();
  const fromAddress = await getWalletAddress();
  const estimatedGas = await web3.eth.estimateGas({
    from: fromAddress,
    data: input,
    to: contractAddr,
    value: web3.utils.toWei(value.toString(), "wei"),
  });
  const nonce = await web3.eth.getTransactionCount(fromAddress, "latest");

  function sendTransaction(_tx) {
    return new Promise((resolve, reject) => {
      web3.eth
        .sendTransaction(_tx)
        .once("transactionHash", (txHash) => resolve(txHash))
        .catch((err) => reject(err));
    });
  }
  try {
    return await sendTransaction({
      gas: parseInt(estimatedGas * GAS_INCREASE),
      to: await fetchContractObjAt(contractAddr).options.address,
      from: fromAddress,
      value: web3.utils.toWei(value.toString(), "wei"),
      data: web3.utils.toHex(input),
      nonce,
    });
    // const interval = setInterval(function () {
    //   web3.eth.getTransactionReceipt(result, function (err, rec) {
    //     if (rec) {
    //       clearInterval(interval);
    //     }
    //   });
    // }, 1000);
  } catch (error) {
    //TODO: revisit error handling
    console.error("CATCHERROR", error);
    var myRe = /{.*}/g;
    var str = error.message.replace(/(\r\n|\n|\r)/gm, "");
    var errArray = myRe.exec(str);
    if (errArray && errArray.length > 0) {
      console.log("ERROR", errArray[0]);
      if (JSON.parse(errArray[0]).originalError.data) {
        const errorCode = JSON.parse(errArray[0]).originalError.data;
        console.error(errorCode);
      } else {
      }
    } else {
    }
  }
};

export const fetchContractObjAt = (contractAddr) => {
  return fetchContractObjByAddr(contractAddr);
};
