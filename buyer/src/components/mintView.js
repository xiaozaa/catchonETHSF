import React, { useState, useEffect } from "react";
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { PlusMinusButton } from './plusMinusButton';
import { convertWeiToETH, etherscanLink } from '../utils'


import "./mint.css";
import { setProxyMint } from "../reafactored_util/contract_access_object/writerCao";
import { txnStatusChecker } from "../reafactored_util/componentHelper";
import { getWalletAddress } from "../reafactored_util/wallet/wallet";

export const MintView = ({ setStep, proof, info, setTxHash, tokenId }) => {
    const [quantity, setQuantity] = useState(1);

    const [errorInfo, setErrorInfo] = useState("")
    const [txnStatus, setTxnStatus] = useState(null);
    useEffect(() => {
        if (txnStatus === "DONE") {
            setStep(4);
        }
    },);
    return (
        <div>
            <CardContent>
                <div className="cardWrapper">
                    <PlusMinusButton count={quantity} purchaseLimit={Number(info.stock)} setCount={setQuantity} />
                    <Typography>
                        Total price: {convertWeiToETH((Number(info.price) * quantity).toString())}ETH
                    </Typography>
                    <Button variant="outlined" onClick={async () => {
                        setTxnStatus("Waiting for approval");
                        const userAddr = await getWalletAddress();
                        const txn = await setProxyMint(window.CONTRACT_ADDRESS, userAddr, tokenId, quantity, proof);
                        setTxnStatus("LOADING");
                        console.log("CREATE txn", txn)
                        txnStatusChecker(txn, setTxnStatus);
                        setTxHash(txn)
                        // MintTransaction(quantity, proof, setTxHash, setMintState, setErrorInfo);
                    }}>
                        MINT
                    </Button>
                    <a>{info.totalSupply} out of {info.maxSupply} minted</a>
                    {/* {txHash && <a
                        target="_blank"
                        rel="noreferrer"
                        href={etherscanLink() + txHash}
                    >
                        Etherscan
                    </a>} */}
                    <Typography>
                        {txnStatus}
                    </Typography>
                    <a className="error-text">{errorInfo}</a>
                </div>
            </CardContent>
        </div>

    )
}