import React, { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Form, useNavigate } from "react-router-dom";
import "../../css/productcreate.css";
// import { addMockApp } from "../mockdata/mockData";
// import { ENABLE_MOCK } from "../utils/constants";
import {
  createECOMERCEProxy,
  createERC721Proxy,
} from "../../utils/reafactored_util/contract_access_object/writerCao";
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

export function CreateProduct() {
  const navigate = useNavigate();
  const [productName, setProductName] = useState("Lorem ipsum");
  const [totalSupply, setTotalSupply] = useState("RARE");
  const [pricePerItem, setPricePerItem] = useState("COIN");
  const [imageURL, setImageURL] = useState(null);
  const [productType, setProductType] = useState("ESTORE");
  const [txnStatus, setTxnStatus] = useState(null);
  const [description, setDescription] = useState("Enter text");

  const handleProductNameChange = (event) => {
    setProductName(event.target.value);
  };
  const handleTotalSupplyChange = (event) => {
    setTotalSupply(event.target.value);
  };
  const handlePricePerItemChange = (event) => {
    setPricePerItem(event.target.value);
  };
  const handleProductTypeChange = (event) => {
    setProductType(event.target.value);
  };
  const handleImageURLChange = (event) => {
    setImageURL(event.target.value);
  };
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  return (
    <div className="body-outline">
      <div id="create-body">
        <h1 className="italicize">Create product</h1>
        <p className="italicize">
          This is a description of the information required to create a product:
          name, quantity, price, token type, image url, and description.
        </p>
        <Form method="post" id="create-form">
          <Box sx={{ minWidth: 200 }}>
            {/* <span>Name: </span>
            <input placeholder="App Name" type="text" name="name"></input> */}
            <TextField
              fullWidth
              id="outlined-basic"
              className="box-text-space"
              label="Product name"
              variant="outlined"
              value={productName}
              onChange={handleProductNameChange}
            />
            <br />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Product type
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                className="box-text-space"
                value={productType}
                label="Product type"
                onChange={handleProductTypeChange}
              >
                <MenuItem value={"ESTORE"}>eCommerce Store</MenuItem>
                <MenuItem value={"ERC721"}>NFT Collection</MenuItem>
                <MenuItem value={"MEMBERCARD"}>NFT Membership</MenuItem>
              </Select>
            </FormControl>
            <br />
            <div className="nothidden">
              <TextField
                fullWidth
                id="outlined-basic"
                className="box-text-space"
                label="Total supply"
                variant="outlined"
                value={totalSupply}
                onChange={handleTotalSupplyChange}
              />
              <br />
              <TextField
                fullWidth
                id="outlined-basic"
                className="box-text-space"
                label="Price per item"
                variant="outlined"
                value={pricePerItem}
                onChange={handlePricePerItemChange}
              />
              {/* <br /> */}
              {/* {productType === "ERC721" && (
                <TextField
                  fullWidth
                  id="outlined-basic"
                  className="box-text-space"
                  label="Image URL"
                  variant="outlined"
                  value={imageURL}
                  onChange={handleImageURLChange}
                />
              )} */}
              <br />
              <TextField
                fullWidth
                id="outlined-basic"
                className="box-text-space"
                label="Image URL"
                variant="outlined"
                value={imageURL}
                onChange={handleImageURLChange}
              />
              <br />
              <TextField
                fullWidth
                id="outlined-basic"
                className="box-text-space"
                label="Description"
                variant="outlined"
                value={description}
                onChange={handleDescriptionChange}
              />
            </div>
            <div className={"button-container"}>
              <Button
                id={"create-op-button"}
                onClick={async () => {
                  setTxnStatus("Waiting for approval...");
                  if (productType === "ERC721") {
                    const txn = await createERC721Proxy(
                      productName,
                      totalSupply,
                      pricePerItem,
                      imageURL,
                      description
                    );
                    setTxnStatus("Currently loading...");
                    console.log("CREATE txn", txn);
                    txnStatusChecker(txn, setTxnStatus);
                  } else if (productType === "ESTORE") {
                    const txn = await createECOMERCEProxy(
                      productName,
                      totalSupply,
                      pricePerItem,
                      imageURL,
                      description
                    );
                    setTxnStatus("Currently loading...");
                    console.log("CREATE txn", txn);
                    txnStatusChecker(txn, setTxnStatus);
                  }
                }}
              >
                Confirm details
              </Button>
            </div>
            <div className="button-container">
              <Button
                id={"cancel-op-button"}
                onClick={() => {
                  navigate(-1);
                }}
              >
                Cancel
              </Button>
            </div>
            <Typography>{txnStatus}</Typography>
          </Box>
        </Form>
      </div>
    </div>
  );
}
