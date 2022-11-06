import Button from "@mui/material/Button";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { SlDrawer } from "react-icons/sl";
import { useNavigate } from "react-router-dom";
import "../css/landing.css";
import {
  connectToWallet,
  initFactoryContract,
  getWalletAddress,
  verifyAccount,
} from "../utils/reafactored_util/wallet/wallet";
import { FACTORY_CONTRACT_ADDRESS } from "../utils/reafactored_util/wallet/abiHelper";

export const LandPage = () => {
  let navigate = useNavigate();
  return (
    <>
      <div className="header">
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
                navigate("/app");
                // REMOVED: /applist
              } else {
                //TODO: Failure
                throw new Error("WTF do you want to do?");
              }
            }}
          >
            <SlDrawer className="icon-space" />
            <span className="connect-space">Connect Wallet</span>
          </Button>
        </div>
      </div>
      <div className="banner">
        <span className="line-one">CATCHON</span>
        <br />
        <span className="line-two">No-Code Solution for</span>
        <br />
        <span className="line-two">NFT eCommerce</span>
      </div>
    </>
  );
};
