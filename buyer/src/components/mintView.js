import React, { useState, useEffect } from "react";
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
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
    const handleChange = (event) => {
        setQuantity(event.target.value);
    };
    return (
        <div>
            <CardContent>
                <div className="cardWrapper">
                    <div className="select-wrapper">
                        <div>{Number(info.supply) - Number(info.minted)} of {info.supply} available</div>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={quantity}
                            label="Age"
                            onChange={handleChange}
                        >
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={4}>4</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                        </Select>
                        {/* <PlusMinusButton count={quantity} purchaseLimit={Number(5)} setCount={setQuantity} /> */}
                    </div>

                    <div className="price-tag">
                        <div className="small">Subtotal:</div>
                        <div className="bold">{convertWeiToETH((Number(info.price) * quantity).toString())} ETH</div>
                    </div>

                    <Button variant="outlined" onClick={async () => {
                        setTxnStatus("Waiting for approval");
                        const userAddr = await getWalletAddress();
                        const txn = await setProxyMint(window.CONTRACT_ADDRESS, tokenId, quantity);
                        setTxnStatus("LOADING");
                        console.log("CREATE txn", txn)
                        txnStatusChecker(txn, setTxnStatus);
                        setTxHash(txn)
                        // MintTransaction(quantity, proof, setTxHash, setMintState, setErrorInfo);
                    }}>
                        BUY NOW
                    </Button>
                    {/* <a>{info.totalSupply} out of {info.maxSupply} minted</a> */}
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
            </CardContent >
        </div >

    )
}