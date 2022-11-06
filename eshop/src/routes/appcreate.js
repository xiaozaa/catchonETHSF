import React, { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Form, useNavigate } from "react-router-dom";
import "../css/appcreate.css";
// import { addMockApp } from "../mockdata/mockData";
// import { ENABLE_MOCK } from "../utils/constants";
import {
  createECOMERCEProxy,
  createERC721Proxy,
} from "../utils/reafactored_util/contract_access_object/writerCao";
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
  const [storeName, setStoreName] = useState("Lorem ipsum");
  const [tokenName, setTokenName] = useState("RARE");
  const [tokenSymb, setTokenSymb] = useState("COIN");
  const [collectionSize, setCollectionSize] = useState(null);
  const [storeType, setStoreType] = useState("ESTORE");
  const [txnStatus, setTxnStatus] = useState(null);

  const handleStoreNameChange = (event) => {
    setStoreName(event.target.value);
  };
  const handleTokenNameChange = (event) => {
    setTokenName(event.target.value);
  };
  const handleTokenSymbolChange = (event) => {
    setTokenSymb(event.target.value);
  };
  const handleStoreTypeChange = (event) => {
    setStoreType(event.target.value);
  };
  const handleCollectionSizeChange = (event) => {
    setCollectionSize(event.target.value);
  };

  return (
    <div className="body-outline">
      <div id="create-body">
        <h1 className="italicize">Get started</h1>
        <p className="italicize">
          This is a description of why you should create a web3 enabled store, a
          unique NFT collection, or a NFT Membership Program.
        </p>
        <Form method="post" id="create-form">
          <Box sx={{ minWidth: 200 }}>
            {/* <span>Name: </span>
            <input placeholder="App Name" type="text" name="name"></input> */}
            <TextField
              fullWidth
              id="outlined-basic"
              className="box-text-space"
              label="Store name"
              variant="outlined"
              value={storeName}
              onChange={handleStoreNameChange}
            />
            <br />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Store type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                className="box-text-space"
                value={storeType}
                label="Store type"
                onChange={handleStoreTypeChange}
              >
                <MenuItem value={"ESTORE"}>eCommerce Store</MenuItem>
                <MenuItem value={"ERC721"}>NFT Collection</MenuItem>
                <MenuItem value={"MEMBERCARD"}>NFT Membership</MenuItem>
              </Select>
            </FormControl>
            <br />
            <div className="hidden">
              <TextField
                fullWidth
                id="outlined-basic"
                className="box-text-space"
                label="Token name"
                variant="outlined"
                value={tokenName}
                onChange={handleTokenNameChange}
              />
              <br />
              <TextField
                fullWidth
                id="outlined-basic"
                className="box-text-space"
                label="Token symbol"
                variant="outlined"
                value={tokenSymb}
                onChange={handleTokenSymbolChange}
              />
              <br />
              {storeType === "ERC721" && (
                <TextField
                  fullWidth
                  id="outlined-basic"
                  className="box-text-space"
                  label="Collection size"
                  variant="outlined"
                  value={collectionSize}
                  onChange={handleCollectionSizeChange}
                />
              )}
              <br />
            </div>
            <div className={"button-container"}>
              <Button
                id={"create-op-button"}
                onClick={async () => {
                  setTxnStatus("Waiting for approval...");
                  if (storeType === "ERC721") {
                    const txn = await createERC721Proxy(
                      storeName,
                      tokenName,
                      tokenSymb,
                      collectionSize
                    );
                    setTxnStatus("In progress...");
                    console.log("CREATE txn", txn);
                    txnStatusChecker(txn, setTxnStatus);
                  } else if (storeType === "ESTORE") {
                    const txn = await createECOMERCEProxy(
                      storeName,
                      tokenName,
                      tokenSymb
                    );
                    setTxnStatus("In progress...");
                    console.log("CREATE txn", txn);
                    txnStatusChecker(txn, setTxnStatus);
                  }
                }}
              >
                Create store
              </Button>
            </div>
            <div className="button-container">
              <Button
                id={"cancel-op-button"}
                onClick={() => {
                  navigate(-1);
                }}
              >
                Back
              </Button>
            </div>
            <Typography>{txnStatus}</Typography>
          </Box>
        </Form>
      </div>
    </div>
  );
}
