import React from "react";
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { etherscanLink } from "../utils";

export const DoneView = ({ txHash }) => {
    return (
        <div>
            <CardContent>
                <div className="cardWrapper">
                    <Typography >
                        Congratuations! You successfully minted!
                    </Typography>
                    {txHash && <a
                        target="_blank"
                        rel="noreferrer"
                        href={etherscanLink() + txHash}
                    >
                        Etherscan
                    </a>}
                </div>
            </CardContent>
        </div>

    )
}