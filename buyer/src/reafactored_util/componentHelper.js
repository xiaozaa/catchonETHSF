import { web3 } from "./wallet/web3Helper"

export const txnStatusChecker = async (txn, setTxnStatus) => {
    const interval = setInterval(function () {
        web3.eth.getTransactionReceipt(txn, function (err, rec) {
            if (rec) {
                setTxnStatus("DONE");
                clearInterval(interval);
            }
        });
    }, 1000);
}