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

import "../css/applist.css";
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
  var appListData;
  let userAddr;
  if (ENABLE_MOCK) {
    appListData = getMockAppListData();
    userAddr = "0x7aAaA1e9EE5Aa1fA329975DaDdEa56437a2B6B18";
  } else {
    userAddr = await getWalletAddress();
    const appList = await getListOfAppsOwnedBy(userAddr);
    appListData = await Promise.all(
      appList.map(async (addr) => {
        const metaObj = await getMetaDataOfProxy(addr);
        metaObj.addr = addr;
        return metaObj;
      })
    );
  }
  return {
    appListData: appListData,
    adminAddr: userAddr,
  };
}

export async function loader() {
  return await getData();
}

export const AppList = () => {
  const { appListData, adminAddr } = useLoaderData();

  console.log("appListData: ", appListData);

  return (
    <div>
      <div className="app-list-top-container">
        <h1>Apps</h1>
        <Button component={NavLink} id={"create-button"} to={"/app-create"}>
          Create
        </Button>
      </div>
      <nav>
        {appListData.length ? (
          <>
            <div>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Name</StyledTableCell>
                      <StyledTableCell align="right">Address</StyledTableCell>
                      <StyledTableCell align="right">Date</StyledTableCell>
                      <StyledTableCell align="right">Type</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {appListData.map((row, index) => (
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
                        <StyledTableCell align="right">
                          {row.addr}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {new Date(
                            parseInt(row.createTime) * 1000
                          ).toLocaleString()}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.logicAddress}
                        </StyledTableCell>
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
