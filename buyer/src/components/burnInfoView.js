import React from "react";
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { getProxyBalanceByTokenID } from "../reafactored_util/contract_access_object/readerCao";

export const DoneView = ({ txHash }) => {
    return (
        <div>
            <CardContent>
                <div className="cardWrapper">
                    <Typography >
                        Congratuations! You successfully minted!
                    </Typography>
                </div>
            </CardContent>
        </div>

    )
}