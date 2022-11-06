import { Outlet, useLoaderData, NavLink, useLocation } from "react-router-dom";
import { ENABLE_MOCK } from "../../utils/constants";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArchitectureRoundedIcon from "@mui/icons-material/ArchitectureRounded";
import { initProxyContract } from "../../utils/reafactored_util/wallet/wallet";
import { ECOMERCE_CONTRACT_ADDRESS } from "../../utils/reafactored_util/wallet/abiHelper";

async function initializeProxyContract(proxyAddr, logicAddr) {
  if (ENABLE_MOCK) {
    console.log("skipping initialize proxy contract");
  } else {
    console.log(
      "initializeProxyContract: proxy: ",
      proxyAddr,
      " logicAddr: ",
      logicAddr
    );
    await initProxyContract(proxyAddr, logicAddr);
  }
}

export async function loader({ params }) {
  const appMeta = {};
  appMeta.addr = params.proxyAddress;
  appMeta.logicAddress = ECOMERCE_CONTRACT_ADDRESS;
  console.log("appMeta", appMeta);
  await initializeProxyContract(appMeta.addr, appMeta.logicAddress);
  return params.proxyAddress;
}

export function AppView() {
  const urlContractAddr = useLoaderData();
  const location = useLocation();
  let { adminAddr, appMeta } = location.state;

  //TODO: repeat code in utils
  const abbreviateAddr = (addr) => {
    return (
      addr.substring(0, 6) +
      "..." +
      addr.substring(addr.length - 4)
    ).toUpperCase();
  };
  //console.log(metaData);
  return (
    <div className="view-shift">
      {/* <div classNAme="view-header">
        <Button className="right-move" component={NavLink} to={"/applist"}>
          STORE LIST
          <ArchitectureRoundedIcon />
        </Button>
        <div className="right-move" id="view-top">
          <h3> {`${appMeta.name}: ${abbreviateAddr(appMeta.addr)}`} </h3>
        </div>
      </div> */}
      <div id="viewContainer">
        <div id="viewSidebar">
          <nav>
            <Box
              sx={{
                position: "absolute",
                top: 50,
                left: 250,
                bgcolor: "background.paper",
              }}
            >
              <List component={Stack} direction="row">
                <ListItem
                  disablePadding
                  component={NavLink}
                  to={"overview"}
                  state={{ adminAddr: adminAddr, appMeta: appMeta }}
                >
                  <ListItemButton id="appview-sidebar-item">
                    Products
                  </ListItemButton>
                </ListItem>
                <ListItem
                  disablePadding
                  component={NavLink}
                  to={"support"}
                  state={{ adminAddr: adminAddr, appMeta: appMeta }}
                >
                  <ListItemButton id="appview-sidebar-item">
                    Buyers
                  </ListItemButton>
                </ListItem>
                <ListItem
                  disablePadding
                  component={NavLink}
                  to={"Shipping"}
                  state={{ adminAddr: adminAddr, appMeta: appMeta }}
                >
                  <ListItemButton id="appview-sidebar-item">
                    Redeemed
                  </ListItemButton>
                </ListItem>
                <ListItem
                  disablePadding
                  component={NavLink}
                  to={"integration"}
                  state={{ adminAddr: adminAddr, appMeta: appMeta }}
                >
                  <ListItemButton id="appview-sidebar-item">
                    Integration
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>
          </nav>
        </div>
      </div>
      <div id="detail">
        <Outlet context={[adminAddr, appMeta]} />
      </div>
    </div>
  );
}
