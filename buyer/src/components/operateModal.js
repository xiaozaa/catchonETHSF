import React, { useImperativeHandle, useState } from "react";
import Dialog from '@mui/material/Dialog';
import DialogTitle from "@mui/material/DialogTitle";
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { AllowlistView } from "./allowlistView";
import { MintView } from "./mintView";
import { SoldOutView } from "./soldoutView";
import { InfoView } from "./infoView";
import { DoneView } from "./doneView";
import { BurnView } from "./burnView";
import { AddressView } from "./addressView";
import { BurnDoneView } from "./burnDoneView";

export const OperateModal = (props, ref) => {
    const [isOpen, setIsOpen] = useState(false)

    const [step, setStep] = useState(1)
    const [proof, setProof] = useState(undefined);
    const [info, setInfo] = useState(null);
    const [txHash, setTxHash] = useState(undefined);
    const [soldOut, setSoldOut] = useState(false);
    const [tokenId, setTokenId] = useState(null);
    const [operate, setOperate] = useState(null);
    const [owned, setOwned] = useState(null);
    const [burnt, setBurnt] = useState(null);
    const handleClose = () => {
        setIsOpen(false);
        setStep(1);
    }

    useImperativeHandle(ref, () => ({
        setIsOpen, setInfo, setSoldOut, setTokenId, setOperate, setOwned
    })
    )
    return (
        <div>
            <Dialog onClose={handleClose} open={isOpen}>
                {operate === "MINT" && <div>
                    <DialogTitle>Buy Digital Items</DialogTitle>
                    <Card sx={{ minWidth: 475, minWidth: 475 }}>
                        <CardContent>
                            {soldOut ?
                                <SoldOutView />
                                :
                                <div>
                                    {info && <InfoView info={info} />}
                                    {(step === 1) && <AllowlistView setStep={setStep} setProof={setProof} info={info} tokenId={tokenId} />}
                                    {(step === 3) && <MintView setStep={setStep} proof={proof} info={info} txHash={txHash} setTxHash={setTxHash} tokenId={tokenId} />}
                                    {(step === 4) && <DoneView txHash={txHash} />}
                                </div>

                            }
                        </CardContent>
                    </Card>
                </div>}
                {operate === "BURN" && <div>
                    <DialogTitle>Redeem Physical Items</DialogTitle>
                    <Card sx={{ minWidth: 475, minWidth: 475 }}>
                        <CardContent>
                            {soldOut ?
                                <SoldOutView />
                                :
                                <div>
                                    {(step === 1) && <BurnView setStep={setStep} owned={owned} info={info} tokenId={tokenId} setTxHash={setTxHash} setBurnt={setBurnt} />}
                                    {(step === 2) && <AddressView setStep={setStep} info={info} tokenId={tokenId} burnt={burnt} />}
                                    {(step === 4) && <BurnDoneView txHash={txHash} />}
                                </div>

                            }
                        </CardContent>
                    </Card>
                </div>}
            </Dialog>
        </div>


    )
}

export const modalRef = React.createRef();

export const showMintModal = (tokenId, info) => {
    modalRef.current?.setIsOpen(true);
    modalRef.current?.setOperate("MINT");
    modalRef.current?.setTokenId(tokenId);
    modalRef.current?.setInfo(info);
    // if (info.stock === 0) {
    //     modalRef.current?.setSoldOut(true);
    // }
}

export const showBurnModal = (tokenId, info, owned) => {
    modalRef.current?.setIsOpen(true);
    modalRef.current?.setOperate("BURN");
    modalRef.current?.setTokenId(tokenId);
    modalRef.current?.setInfo(info);
    modalRef.current?.setOwned(owned);
}

// export const setMintInfo = (info) => {
//     if (info.totalSupply && info.maxSupply) {
//         if (info.totalSupply === info.maxSupply) {
//             modalRef.current?.setSoldOut(true);
//         }
//         else {
//             modalRef.current?.setSoldOut(false);
//         }
//     }
//     modalRef.current?.setInfo(info);
//     // TODO: if root =0x0, make the proof []
// }

export default React.forwardRef(OperateModal);
