import React, { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import { Button } from "@mui/material";
import TextField from '@mui/material/TextField';

import { Contracts, setContracts } from "../../utils/contract";
import { MintTransaction } from "../../utils/mint";
import { IMPLEMENTATION_ADDRESS } from "../../utils/constants";

import "./common.css";

export async function loader({ params }) {
  return params.proxyAddress;
}
const bytes32Zeros = "0x0000000000000000000000000000000000000000000000000000000000000000";

export const Config = () => {
  const contract = useLoaderData();
  const [startTime, setStartTime] = useState(undefined);
  const [endTime, setEndTime] = useState(undefined);
  const [price, setPrice] = useState(undefined);
  const [maxAvailable, setMaxAvailable] = useState(undefined);
  const [purchaseLimit, setPurchaseLimit] = useState(undefined);
  const [isAllowlist, setIsAllowlist] = useState(undefined);
  const [roundIndex, setRoundIndex] = useState(0);

  const [nextRound, setNextRound] = useState(undefined);

  const [url, setUrl] = useState("");



  const handleStartTimeInputChange = (event) => {
    setStartTime(event.target.value);
  }
  const handleEndTimeInputChange = (event) => {
    setEndTime(event.target.value);
  }
  const handleMaxAvailableInputChange = (event) => {
    setMaxAvailable(event.target.value);
  }
  const handlePurchaseLimitInputChange = (event) => {
    setPurchaseLimit(event.target.value);
  }
  const handlePriceInputChange = (event) => {
    setPrice(event.target.value);
  }
  const handleIsAllowlistInputChange = (event) => {
    setIsAllowlist(event.target.value);
  }
  const handleRoundIndexInputChange = (event) => {
    setRoundIndex(event.target.value);
  }

  const handleNextRoundInputChange = (event) => {
    setNextRound(event.target.value);
  }

  const handleUrlInputChange = (event) => {
    setUrl(event.target.value);
  }

  useEffect(() => {
    const fetchData = async () => {
      if (Contracts[contract]) {

      }
      else {
        await setContracts(contract, IMPLEMENTATION_ADDRESS);
      }
    }
    fetchData()
      .catch(console.error);
  }, []);
  return (
    <div className="input-wrapper">
      <div className="input-card">
        <TextField fullWidth id="outlined-basic" label="startTime" variant="outlined" value={startTime}
          onChange={handleStartTimeInputChange} />
        <TextField fullWidth id="outlined-basic" label="endTime" variant="outlined" value={endTime}
          onChange={handleEndTimeInputChange} />
        <TextField fullWidth id="outlined-basic" label="maxAvailable" variant="outlined" value={maxAvailable}
          onChange={handleMaxAvailableInputChange} />
        <TextField fullWidth id="outlined-basic" label="purchaseLimit" variant="outlined" value={purchaseLimit}
          onChange={handlePurchaseLimitInputChange} />
        <TextField fullWidth id="outlined-basic" label="price" variant="outlined" value={price}
          onChange={handlePriceInputChange} />
        <TextField fullWidth id="outlined-basic" label="isAllowlist" variant="outlined" value={isAllowlist}
          onChange={handleIsAllowlistInputChange} />
        <TextField fullWidth id="outlined-basic" label="roundIndex" variant="outlined" value={roundIndex}
          onChange={handleRoundIndexInputChange} />
        <Button onClick={async () => {
          // const mkrTmp = merkleRoot[roundIndex] ? merkleRoot[roundIndex] : bytes32Zeros;
          console.log("args", [startTime, endTime, maxAvailable, purchaseLimit, price, isAllowlist, roundIndex])
          await MintTransaction(contract, "setupMintInfo",
            [startTime, endTime, maxAvailable, purchaseLimit, price, isAllowlist, roundIndex],
            0
          );
        }}>
          Set mint info
        </Button>
      </div>
      <div className="input-card">
        <TextField fullWidth id="outlined-basic" label="nextRound" variant="outlined" value={nextRound}
          onChange={handleNextRoundInputChange} />

        <Button onClick={async () => {
          if (nextRound !== undefined) {
            await MintTransaction(contract, "setCurrentRound",
              [nextRound],
              0,
            );
          }
        }}>
          set round
        </Button>
      </div>
      <div className="input-card">
        <TextField fullWidth id="outlined-basic" label="url" variant="outlined" value={url}
          onChange={handleUrlInputChange} />

        <Button onClick={async () => {
          await MintTransaction(contract, "setBaseURI",
            [url],
            0,
          );

        }}>
          set url
        </Button>
      </div>
    </div>
  );
}
