import { useLoaderData, NavLink, Outlet } from "react-router-dom";
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

import { useLocation } from "react-router-dom";

// import { ENABLE_MOCK } from "../utils/constants";
// import Button from "@mui/material/Button";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { initProxyContract } from "../utils/reafactored_util/wallet/wallet";

import "../css/applist.css";
import "../css/app.css";
import { getWalletAddress } from "../utils/reafactored_util/wallet/wallet";
import {
  getListOfAppsOwnedBy,
  getMetaDataOfProxy,
} from "../utils/reafactored_util/contract_access_object/readerCao";
import {
  getBalanceOf,
  getImgUrl,
  getItemIdList,
  getNameOf,
  getNumMinted,
  getSalesAmountOf,
  getSupplyOf,
} from "../utils/reafactored_util/contract_access_object/eStore/readerCao";

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
  const productInfoList = [];
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
    console.log("applist", appList);
    await initializeProxyContract(appData[0].addr, appData[0].logicAddress);
    const proxyAddr = appData[0].addr;
    const productIdList = await getItemIdList(proxyAddr);
    console.log("productIdList: ", productIdList);

    for (const productId in productIdList) {
      const name = await getNameOf(productId, proxyAddr);
      console.log("name: ", name);
      const supply = await getSupplyOf(productId, proxyAddr);
      console.log("supply: ", supply);
      const balance = await getBalanceOf(productId, proxyAddr);
      console.log("balance: ", balance);
      const salesAmount = await getSalesAmountOf(productId, proxyAddr);
      console.log("salesAmount: ", salesAmount);
      const numMinted = await getNumMinted(productId, proxyAddr);
      console.log("numMinted: ", numMinted);
      const imgUrl = await getImgUrl(productId, proxyAddr);
      console.log("imgUrl: ", imgUrl);
      productInfoList.push({
        name: name,
        supply: supply,
        balance: balance,
        numMinted: numMinted,
        salesAmount: salesAmount,
        id: productId,
        imgUrl: imgUrl,
      });
    }
    console.log("firstProductInfoList: ", productInfoList);
  }
  return {
    appData: appData,
    firstStoreProductList: productInfoList,
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

export async function loader() {
  return await getData();
}

export const App = () => {
  const { appData, firstStoreProductList, adminAddr } = useLoaderData();

  console.log("Got appData: ", appData);
  console.log("Got firstStoreProductList: ", firstStoreProductList);

  const urlContractAddr = useLoaderData();
  const location = useLocation();
  const appMeta = appData[0];
  for (let appMeta of appData) {
    console.log("appMeta", appMeta);
    initializeProxyContract(appMeta.addr, appMeta.logicAddress);
  }

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
        <h1>SUPERUSER</h1>
        <Button
          component={NavLink}
          id={"create-button"}
          to={"/app-create"}
          state={{ adminAddr: adminAddr }}
        >
          NEW STORE
        </Button>
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
                {appData.map((row, index) => (
                  <ListItem
                    disablePadding
                    component={NavLink}
                    to={`view/${row.addr}/overview`}
                    state={{ adminAddr: adminAddr, appMeta: appMeta }}
                  >
                    <Button id="appview-sidebar-item">{row.name}</Button>
                  </ListItem>
                ))}
              </List>
            </nav>
          </div>
          <div id="detail">
            <Outlet />
          </div>
        </div>
      </div>
      <nav>
        {appData.length ? (
          <>
            <div>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 100 }} aria-label="customized table">
                  <TableHead className="hidden">
                    <TableRow className="hidden">
                      <StyledTableCell>DIRECTORY</StyledTableCell>
                      {/* <StyledTableCell align="right">Address</StyledTableCell>
                      <StyledTableCell align="right">Date</StyledTableCell>
                      <StyledTableCell align="right">Type</StyledTableCell> */}
                    </TableRow>
                  </TableHead>
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
