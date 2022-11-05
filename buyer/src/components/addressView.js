import React, { useState } from "react";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { getWalletAddress } from "../reafactored_util/wallet/wallet";
import { API_DB } from "../constants";
import fetch from "node-fetch";
import * as _ from "lodash";

export const AddressView = ({ setStep, tokenId, burnt }) => {
    const [address, setAddress] = useState(null);
    const handleAddressChange = (event) => {
        setAddress(event.target.value);
    }
    return (
        <div>
            <CardContent>
                <div className="cardWrapper">
                    <Typography >
                        Pleae fill your shipping information
                    </Typography>
                    <TextField fullWidth id="outlined-basic" label="address" variant="outlined" value={address}
                        onChange={handleAddressChange} />
                    <Button onClick={async () => {
                        const walletAddress = await getWalletAddress();
                        const body = {
                            Address: address,
                            TokenId: tokenId,
                            ContractAddr: window.CONTRACT_ADDRESS,
                            Redeemed: burnt
                        }
                        await fetch(API_DB + "ship/" + walletAddress, {
                            method: "PUT",
                            body: JSON.stringify(body),
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        })
                            .then(response => {
                                return response
                            })
                            .catch(error => {
                                console.error(error);
                            });
                        setStep(4);
                    }}>
                        Submit
                    </Button>
                </div>
            </CardContent>
        </div>

    )
}