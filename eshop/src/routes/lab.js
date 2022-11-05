import { Button } from "@mui/material";

import { useState } from "react";
import {
  getListOfAppsOwnedBy,
  getMetaDataOfProxy,
  getProxyCurrentRound,
  getProxyIsMintOn,
  getProxyMintInfoOfRound,
  getProxyOwner,
  getProxySymbol,
} from "../utils/reafactored_util/contract_access_object/readerCao";
import {
  createERC721Proxy,
  setProxyCurrentRound,
  createECOMERCEProxy,
} from "../utils/reafactored_util/contract_access_object/writerCao";
import {
  ECOMERCE_CONTRACT_ADDRESS,
  FACTORY_CONTRACT_ADDRESS,
} from "../utils/reafactored_util/wallet/abiHelper";
import {
  connectToWallet,
  getWalletAddress,
  initFactoryContract,
  initProxyContract,
} from "../utils/reafactored_util/wallet/wallet";

import { Form } from "react-router-dom";

import { create } from "ipfs-http-client";
import { setTokenUrl } from "../utils/reafactored_util/contract_access_object/eStore/writerCao";
import { getUrl } from "../utils/reafactored_util/contract_access_object/eStore/readerCao";

export async function action({ request, params }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  console.log("Form: ", updates);

  const projectId = "2H7QnUXRy2bedggBQfmuJB9iYpG";
  const projectSecret = "54cbd88dc60539ed9be39ddd32fe092f";
  const auth =
    "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
  const client = create({
    host: "ipfs.infura.io:5001",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: auth,
    },
  });
  const added = await client.add(JSON.stringify(updates));
  console.log("URL: ", added.path);
  console.log("added: ", added);
  const tokenUrl = "https://ipfs.io/ipfs/" + added.path;
  await setTokenUrl(0, tokenUrl);

  return;
}

export const Lab = () => {
  // setters
  const [address, setAddress] = useState(null);
  const [proxyList, setProxyList] = useState([]);
  const [proxyAddr, setProxyAddr] = useState(null);

  return (
    <div>
      <h1>Lab</h1>
      <Button
        onClick={async () => {
          await connectToWallet();
          const userAddr = await getWalletAddress();
          console.log(`userAddr ${userAddr}`);
          setAddress(userAddr);
          await initFactoryContract(FACTORY_CONTRACT_ADDRESS);
          //await initProxyContract("0xBbF724ec963995cE99412B3ED4701d28Fc38D4Fa", ECOMERCE_CONTRACT_ADDRESS);
        }}
      >
        Connect
      </Button>
      <span>{address ? `Wallet address: ${address}` : "not connected"}</span>

      <h1>Read Function of Factory Contract</h1>
      <Button
        onClick={async () => {
          const userAddr = await getWalletAddress();
          const res = await getListOfAppsOwnedBy(userAddr);
          setProxyList([...res]);
          console.log("getListOfAppsOwnedBy", res);
          const owner = await getProxyOwner(res[0]);
          console.log("getProxyOwner", owner);

          const proxy = res[2];
          setProxyAddr(proxy);

          await initProxyContract(proxy, ECOMERCE_CONTRACT_ADDRESS);

          const metaMap = await getMetaDataOfProxy(proxy);
          console.log(metaMap);

          const symbol = await getProxySymbol(proxy);
          console.log("Symbol: ", symbol);
        }}
      >
        getProxiesOwnedBy
      </Button>

      <ul>
        {proxyList.map((proxyAddr) => {
          return <li>{proxyAddr}</li>;
        })}
      </ul>

      <Button
        onClick={async () => {
          const userAddr = await getWalletAddress();
          await createERC721Proxy("xiaowei", "test", "TT", 1234);
        }}
      >
        Create ERC721 Proxy
      </Button>

      <Button
        onClick={async () => {
          // const userAddr = await getWalletAddress();
          const txn = await createECOMERCEProxy("AnZh", "aazz", "AZ");
        }}
      >
        Create ERC1155 Proxy
      </Button>

      <br></br>

      <Button
        onClick={async () => {
          const userAddr = await getWalletAddress();
          await setProxyCurrentRound(proxyAddr, 2);
        }}
      >
        Set Round to 2;
      </Button>

      <br></br>

      <Button
        onClick={async () => {
          const curRound = await getProxyCurrentRound(proxyAddr);
          console.log(`current round: ${curRound}`);
        }}
      >
        log current round;
      </Button>
      <br></br>
      <Button
        onClick={async () => {
          const mintInfo = await getProxyMintInfoOfRound(proxyAddr, 0);
          console.log(`MintInfo: ${mintInfo}`);
        }}
      >
        Get MintInfo
      </Button>
      <Button
        onClick={async () => {
          const mintInfo = await getProxyIsMintOn(proxyAddr, 0);
          console.log(`isMintOn: ${mintInfo}`);
        }}
      >
        Get isMintOn
      </Button>

      <Form method="post" id="submit-json-form">
        <p>
          <span>Name</span>
          <input placeholder="Product Name" type="text" name="name" />
        </p>
        <label>
          <span>Description</span>
          <input type="text" name="twitter" placeholder="Product Description" />
        </label>
        <label>
          <span>Image</span>
          <input
            placeholder="Img URL"
            aria-label="Avatar URL"
            type="text"
            name="img"
            defaultValue="http://example-image.com"
          />
        </label>
        <p>
          <button type="submit">Save</button>
        </p>
      </Form>

      <Button
        onClick={async () => {
          await setTokenUrl(
            0,
            "https://ipfs.io/ipfs/QmPW54NLWabGDyG1z4oT9XNJR41KkmgC2HFU163Bp8hCpk",
            proxyAddr
          );
        }}
      >
        Set url of token id 0
      </Button>

      <Button
        onClick={async () => {
          const url = await getUrl(1, proxyAddr);
          console.log("Got URL: ", url);
        }}
      >
        Set url of token id 0
      </Button>
    </div>
  );
};
