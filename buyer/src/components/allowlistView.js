import React, { useState } from "react";
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

import { allowlistCheck } from "../allowlist";

export const AllowlistView = ({ setStep, setProof, info, tokenId }) => {
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(true);
    return (
        <div>
            <CardContent>
                <div className="cardWrapper">
                    <Typography >
                        {isSuccess ? "Please check if you are eligible to buy." : "Sorry, you are not eligiable to mint for this Round."}
                    </Typography>
                    <Button variant="outlined" onClick={async () => {
                        setLoading(true);

                        if (!info.isAllowlist) {
                            setStep(3);
                            setProof([]);
                        }
                        else {
                            const [isAllowlist, allowlistProof] = await allowlistCheck();
                            if (isAllowlist) {
                                setStep(3);
                                if (allowlistProof) {
                                    setProof(allowlistProof);
                                }
                            }
                            else {
                                setProof([]);
                                setIsSuccess(false);
                            }
                        }
                        setLoading(false);
                    }}>
                        {loading ? "Checking" : "Check"}
                    </Button>
                </div>
            </CardContent>
        </div>

    )
}