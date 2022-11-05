import React, { useState, useEffect } from "react";
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { PlusMinusButton } from './plusMinusButton';
import { convertWeiToETH, etherscanLink } from '../utils'


import "./mint.css";
import { setProxyBurn } from "../reafactored_util/contract_access_object/writerCao";
import { txnStatusChecker } from "../reafactored_util/componentHelper";
import { getWalletAddress } from "../reafactored_util/wallet/wallet";

export const BurnView = ({ setStep, proof, info, setTxHash, tokenId }) => {
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
                    <PlusMinusButton count={quantity} purchaseLimit={1} setCount={setQuantity} />
                    <Button variant="outlined" onClick={async () => {
                        setTxnStatus("Waiting for approval");
                        const userAddr = await getWalletAddress();
                        const txn = await setProxyBurn(window.CONTRACT_ADDRESS, userAddr, tokenId, quantity, proof);
                        setTxnStatus("LOADING");
                        console.log("CREATE txn", txn)
                        txnStatusChecker(txn, setTxnStatus);
                        setTxHash(txn)
                    }}>
                        BRUN
                    </Button>
                    {/* <a>{info.totalSupply} out of {info.maxSupply} minted</a> */}
                    <Typography>
                        {txnStatus}
                    </Typography>
                    <a className="error-text">{errorInfo}</a>
                </div>
            </CardContent>
        </div>

    )
}