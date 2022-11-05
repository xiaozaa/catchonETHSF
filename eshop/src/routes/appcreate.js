import React, { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Form, useNavigate } from "react-router-dom";
import "../css/appcreate.css";
// import { addMockApp } from "../mockdata/mockData";
// import { ENABLE_MOCK } from "../utils/constants";
import { createECOMERCEProxy, createERC721Proxy } from "../utils/reafactored_util/contract_access_object/writerCao";
import { txnStatusChecker } from "./componentHelper";

// export async function action({ request, params }) {
//   const formData = await request.formData();
//   const updates = Object.fromEntries(formData);
//   console.log(`formdata: ${JSON.stringify(updates, null, 2)}`);
//   if (ENABLE_MOCK) {
//     addMockApp(updates);
//   }
//   // create an app with these parameters:
//   // {name: "app name"}
//   console.log(`Logging updates.name: ${updates.name}`);
//   await createERC721Proxy("xiaowei", "test", "TT", 1234);
//   return redirect(`/applist`);
// }

export function AppCreate() {
  const navigate = useNavigate();
  const [storeName, setStoreName] = useState("default");
  const [tokenName, setTokenName] = useState("CatchOn");
  const [tokenSymb, setTokenSymb] = useState("CO");
  const [collectionSize, setCollectionSize] = useState(null);
  const [storeType, setStoreType] = useState("ESTORE");
  const [txnStatus, setTxnStatus] = useState(null);

  const handleStoreNameChange = (event) => {
    setStoreName(event.target.value);
  }
  const handleTokenNameChange = (event) => {
    setTokenName(event.target.value);
  }
  const handleTokenSymbolChange = (event) => {
    setTokenSymb(event.target.value);
  }
  const handleStoreTypeChange = (event) => {
    setStoreType(event.target.value);
  }
  const handleCollectionSizeChange = (event) => {
    setCollectionSize(event.target.value);
  }

  return (
    <>
      <div id="create-body">
        <h1> Create App</h1>
        <Form method="post" id="create-form">
          <Box sx={{ minWidth: 120 }}>
            {/* <span>Name: </span>
            <input placeholder="App Name" type="text" name="name"></input> */}
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Store Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={storeType}
                label="Store type"
                onChange={handleStoreTypeChange}
              >
                <MenuItem value={"ERC721"}>ERC721</MenuItem>
                <MenuItem value={"ESTORE"}>ESTORE</MenuItem>
                <MenuItem value={"MEMBERCARD"}>MEMBER</MenuItem>
              </Select>
            </FormControl>
            <TextField fullWidth id="outlined-basic" label="Store name" variant="outlined" value={storeName}
              onChange={handleStoreNameChange} />
            <TextField fullWidth id="outlined-basic" label="Token name" variant="outlined" value={tokenName}
              onChange={handleTokenNameChange} />
            <TextField fullWidth id="outlined-basic" label="Token symbol" variant="outlined" value={tokenSymb}
              onChange={handleTokenSymbolChange} />
            {(storeType === "ERC721") && <TextField fullWidth id="outlined-basic" label="Collection size" variant="outlined" value={collectionSize}
              onChange={handleCollectionSizeChange} />}
            <div className={"button-container"}>
              <Button
                id={"cancle-op-button"}
                onClick={() => {
                  navigate(-1);
                }}
              >
                Cancle
              </Button>
              <Button id={"create-op-button"} onClick={async () => {
                setTxnStatus("Waiting for approval");
                if (storeType === "ERC721") {
                  const txn = await createERC721Proxy(storeName, tokenName, tokenSymb, collectionSize);
                  setTxnStatus("LOADING");
                  console.log("CREATE txn", txn)
                  txnStatusChecker(txn, setTxnStatus);
                }
                else if (storeType === "ESTORE") {
                  const txn = await createECOMERCEProxy(storeName, tokenName, tokenSymb);
                  setTxnStatus("LOADING");
                  console.log("CREATE txn", txn)
                  txnStatusChecker(txn, setTxnStatus);
                }
              }}>
                Create
              </Button>

            </div>
            <Typography>
              {txnStatus}
            </Typography>
          </Box>
        </Form>
      </div>
    </>
  );
}
