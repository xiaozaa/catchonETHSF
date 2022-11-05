import React from "react";
import MuiButton from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import "./plusMinusButton.css";

const options = {
    shouldForwardProp: (prop) => prop !== 'rounded',
};
const Button = styled(
    MuiButton,
    options,
)(({ theme, rounded }) => ({
    borderRadius: rounded ? '24px' : null,
}));

const MIN_COUNT = 1;

export const PlusMinusButton = ({ count, setCount, purchaseLimit }) => {

    function incrementCount() {
        if (count < purchaseLimit) {
            count = count + 1;
            setCount(count);
        }
    }
    function decrementCount() {
        if (count > MIN_COUNT) {
            count = count - 1;
            setCount(count);
        }
    }
    return (
        <div>
            {(purchaseLimit >= 1) &&
                <div className="plusMinusWrapper">
                    <Button variant="contained" onClick={decrementCount} rounded>
                        <RemoveIcon />
                    </Button>
                    <div>{count}</div>
                    <Button variant="contained" onClick={incrementCount} rounded>
                        <AddIcon />
                    </Button>
                </div>}
        </div >
    );
};