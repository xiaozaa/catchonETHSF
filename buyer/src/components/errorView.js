import React from "react";
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

export const ErrorView = ({ setStep }) => {
    return (
        <div>
            <CardContent>
                <Typography >
                    error view
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