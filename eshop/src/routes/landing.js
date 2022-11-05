import Button from "@mui/material/Button";

import { useNavigate } from "react-router-dom";
import "../css/landing.css";
import {
  connectToWallet,
  initFactoryContract,
  getWalletAddress,
  verifyAccount
} from "../utils/reafactored_util/wallet/wallet";
import { FACTORY_CONTRACT_ADDRESS } from "../utils/reafactored_util/wallet/abiHelper";

export const LandPage = () => {
  let navigate = useNavigate();
  return (
    <>
      <h1 class="line-one">To enter the future,</h1>
      <div className="flex-container">
        <div className="space-padder"></div>
        <Button
          id="connect-button"
          onClick={async () => {
            await connectToWallet();
            const userAddr = await getWalletAddress();
            console.log(`userAddr ${userAddr}`);
            initFactoryContract(FACTORY_CONTRACT_ADDRESS);
            const identityVerified = await verifyAccount();
            if (identityVerified) {
              await initFactoryContract();
              navigate("/applist");
            } else {
              //TODO: Failure
              throw new Error("WTF do you want to do?");
            }
          }}
        >
          Connect
        </Button>
        <h1 class="line-two"> to your web3 wallet.</h1>
      </div>
    </>
  );
};
