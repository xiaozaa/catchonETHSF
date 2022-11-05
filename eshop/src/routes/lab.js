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
import { FACTORY_CONTRACT_ADDRESS } from "../utils/reafactored_util/wallet/abiHelper";
import {
  connectToWallet,
  getWalletAddress,
  initFactoryContract,
  initProxyContract,
} from "../utils/reafactored_util/wallet/wallet";

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
          initFactoryContract(FACTORY_CONTRACT_ADDRESS);
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
          const owner = await getProxyOwner(res[1]);
          console.log("getProxyOwner", owner);

          const proxy = res[2];
          setProxyAddr(proxy);

          await initProxyContract(proxy);

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
    </div>
  );
};
