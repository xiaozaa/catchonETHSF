import { useLoaderData, NavLink } from "react-router-dom";
import { Button } from "@mui/material";

import { getAppListData as getMockAppListData } from "../mockdata/mockData";

import { ENABLE_MOCK } from "../utils/constants";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { Outlet, useLocation } from "react-router-dom";

// import { ENABLE_MOCK } from "../utils/constants";
// import Button from "@mui/material/Button";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { initProxyContract } from "../utils/reafactored_util/wallet/wallet";
import assert from "assert";

import Main from "../components/main";
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
// import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';
import LabTabs from "../components/tabs.js";

import { SlPaypal } from "react-icons/sl";
import { SlPlus } from "react-icons/sl";
import { SlLayers } from "react-icons/sl";

import "../css/applist.css";
import "../css/app.css";
import { getWalletAddress } from "../utils/reafactored_util/wallet/wallet";
import {
  getListOfAppsOwnedBy,
  getMetaDataOfProxy,
} from "../utils/reafactored_util/contract_access_object/readerCao";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    backgroundColor: "#1c1f2f",
    fontSize: 14,
    color: theme.palette.common.white,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

async function getData() {
  var appData;
  let userAddr;
  if (ENABLE_MOCK) {
    appData = getMockAppListData();
    userAddr = "0x7aAaA1e9EE5Aa1fA329975DaDdEa56437a2B6B18";
  } else {
    userAddr = await getWalletAddress();
    const appList = await getListOfAppsOwnedBy(userAddr);
    appData = await Promise.all(
      appList.map(async (addr) => {
        const metaObj = await getMetaDataOfProxy(addr);
        metaObj.addr = addr;
        return metaObj;
      })
    );
  }
  return {
    appData: appData,
    adminAddr: userAddr,
  };
}

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

//   export async function loader({ params }) {
//     return params.proxyAddress;
//   }

export async function loader() {
  return await getData();
}

export const App = () => {
  const { appData, adminAddr } = useLoaderData();

  console.log("appData: ", appData);

  const urlContractAddr = useLoaderData();
  const location = useLocation();
  // const { adminAddr, appMeta } = location.state; // adminAddr,
  const appMeta = appData[0];
  console.log("appMeta", appMeta);
  initializeProxyContract(appMeta.addr, appMeta.logicAddress);

  //TODO: repeat code in utils
  const abbreviateAddr = (addr) => {
    return (
      addr.substring(0, 6) +
      "..." +
      addr.substring(addr.length - 4)
    ).toUpperCase();
  };

  return (
    <div>
      <div className="app-list-top-container">
        <nav>
          {appData.length ? (
            <>
              <div>
                <TableContainer component={Paper}>
                  <Table sx={{ maxWidth: 200 }} aria-label="customized table">
                    <TableBody>
                      {appData.map((row, index) => (
                        <StyledTableRow
                          key={row.name}
                          className={"app-list-row"}
                        >
                          <StyledTableCell component="th" scope="row">
                            <SlPaypal />
                            <Button
                              sz={{ textTransform: "unset" }}
                              className="button-unset"
                              component={NavLink}
                              to={`/appview/${row.addr}`}
                              state={{
                                adminAddr: adminAddr,
                                appMeta: row,
                              }}
                            >
                              {row.name}
                            </Button>
                          </StyledTableCell>

                          {/* <StyledTableCell align="right">
                          {row.addr}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {new Date(
                            parseInt(row.createTime) * 1000
                          ).toLocaleString()}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.logicAddress}
                        </StyledTableCell> */}
                        </StyledTableRow>
                      ))}
                      <StyledTableRow>
                        <StyledTableCell>
                          <SlPlus />
                          <Button
                            component={NavLink}
                            id={"create-button"}
                            to={"/app-create"}
                            state={{ adminAddr: adminAddr }}
                          >
                            Add store
                          </Button>
                        </StyledTableCell>
                      </StyledTableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </>
          ) : (
            <dev>Whoops, no apps</dev>
          )}
        </nav>
        <h4>
          ethereum <SlLayers /> address
        </h4>
      </div>
      <div>
        <Main />
      </div>

      <div className="select-app">
        <Button component={NavLink} to={"/applist"}>
          <ArrowBackIcon />
          <span className="directory">Directory</span>
        </Button>
        <div id="view-top">
          <h3> {`${appMeta.name}: ${abbreviateAddr(appMeta.addr)}`} </h3>
        </div>
        <div id="viewContainer">
          <div id="sidebar">
            <nav>
              <List>
                <ListItem
                  disablePadding
                  component={NavLink}
                  to={"overview"}
                  state={{ adminAddr: adminAddr, appMeta: appMeta }}
                >
                  <ListItemButton id="appview-sidebar-item">
                    GreekSneaker
                  </ListItemButton>
                </ListItem>
                <ListItem
                  disablePadding
                  component={NavLink}
                  to={"support"}
                  state={{ adminAddr: adminAddr, appMeta: appMeta }}
                >
                  <ListItemButton id="appview-sidebar-item">
                    Supreme II
                  </ListItemButton>
                </ListItem>
                <ListItem
                  disablePadding
                  component={NavLink}
                  to={"Shipping"}
                  state={{ adminAddr: adminAddr, appMeta: appMeta }}
                >
                  <ListItemButton id="appview-sidebar-item">
                    <Button
                      component={NavLink}
                      id={"create-button"}
                      to={"/app-create"}
                      state={{ adminAddr: adminAddr }}
                    >
                      NEW STORE
                    </Button>
                  </ListItemButton>
                </ListItem>
              </List>
            </nav>
          </div>
          <div id="detail">
            <LabTabs />
            {/* <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Item One" {...a11yProps(0)} />
                <Tab label="Item Two" {...a11yProps(1)} />
                <Tab label="Item Three" {...a11yProps(2)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              Item One
            </TabPanel>
            <TabPanel value={value} index={1}>
              Item Two
            </TabPanel>
            <TabPanel value={value} index={2}>
              Item Three
            </TabPanel> */}
            <Outlet context={[adminAddr, appMeta]} />
          </div>
        </div>
      </div>
      <nav>
        {appData.length ? (
          <>
            <div>
              <TableContainer component={Paper}>
                <Table sx={{ maxWidth: 100 }} aria-label="customized table">
                  <TableBody>
                    {appData.map((row, index) => (
                      <StyledTableRow key={row.name} className={"app-list-row"}>
                        <StyledTableCell component="th" scope="row">
                          <Button
                            component={NavLink}
                            to={`/appview/${row.addr}`}
                            state={{
                              adminAddr: adminAddr,
                              appMeta: row,
                            }}
                          >
                            {row.name}
                          </Button>
                        </StyledTableCell>
                        {/* <StyledTableCell align="right">
                          {row.addr}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {new Date(
                            parseInt(row.createTime) * 1000
                          ).toLocaleString()}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.logicAddress}
                        </StyledTableCell> */}
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </>
        ) : (
          <dev>Whoops, no apps</dev>
        )}
      </nav>
    </div>
  );
};