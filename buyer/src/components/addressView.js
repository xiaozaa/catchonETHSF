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

                        await fetch(API_DB + "ship/" + window.CONTRACT_ADDRESS, {
                            method: "GET",
                        })
                            .then((response) => response.json())
                            .then(async (response) => {
                                const dataFromDb = _.get(response, ["Item", "AddressData"]);
                                console.log("AddressData", dataFromDb);
                                var body = "";
                                if (dataFromDb) {
                                    const addresArray = JSON.parse(dataFromDb);
                                    if (addresArray.isArray()) {
                                        addresArray.push({
                                            WalletAddress: walletAddress,
                                            Address: address,
                                            TokenId: tokenId,
                                            ContractAddr: window.CONTRACT_ADDRESS,
                                            Redeemed: burnt
                                        })
                                        body = JSON.stringify({ AddressData: addresArray });
                                    }
                                }
                                else {
                                    body = JSON.stringify({
                                        AddressData: [{
                                            WalletAddress: walletAddress,
                                            Address: address,
                                            TokenId: tokenId,
                                            ContractAddr: window.CONTRACT_ADDRESS,
                                            Redeemed: burnt
                                        }]
                                    });
                                }
                                await fetch(API_DB + "ship/" + window.CONTRACT_ADDRESS, {
                                    method: "PUT",
                                    body,
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
                            })
                            .catch((error) => {
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