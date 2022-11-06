import { web3 } from "../utils/reafactored_util/wallet/web3Helper";

export const txnStatusChecker = async (txn, setTxnStatus, callback) => {
  const interval = setInterval(function () {
    web3.eth.getTransactionReceipt(txn, function (err, rec) {
      if (rec) {
        setTxnStatus("DONE");
        clearInterval(interval);
        if (callback) {
          callback();
        }
      }
    });
  }, 1000);
};
