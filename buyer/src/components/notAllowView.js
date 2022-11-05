import React from "react";
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

export const NotAllowView = ({ setStep }) => {
    return (
        <div>
            <CardContent>
                <Typography >
                    not allow view
                </Typography>
                <Button onClick={() => {
                    alert('clicked');
                }}>
                    Check
                </Button>
            </CardContent>
        </div>

    )
}