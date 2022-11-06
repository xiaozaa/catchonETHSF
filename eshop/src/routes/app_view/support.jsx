import { useLoaderData, NavLink, useLocation } from "react-router-dom";
import {
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TableBody,
  TableHead,
  Divider,
  Button,
  Card,
  CardContent,
  Typography,
  CardActions,
} from "@mui/material";

import Main from "../../components/main";

export function Support() {
  // const { metaData, itemList, proxyAddr } = useLoaderData();
  const location = useLocation();
  const { adminAddr, appMeta } = location.state;

  // console.log("Overview contract", proxyAddr);
  // console.log("Item list: ", itemList);
  return (
    <>
      {/* <h1>This is Support!</h1> */}
      {/* <div>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableBody>
              <TableRow>
                <TableCell align="right">Store</TableCell>
                <TableCell align="left">{metaData.name }</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right">Create Time</TableCell>
                <TableCell align="left">{metaData.createTime}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div> */}
      <Divider></Divider>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Supply</TableCell>
              <TableCell align="right">Balance</TableCell>
              <TableCell align="right">Sales</TableCell>
              <TableCell align="right">Detail</TableCell>
            </TableRow>
          </TableHead>
          {/* <TableBody>
            {itemList.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.supply}</TableCell>
                <TableCell align="right">{row.balance}</TableCell>
                <TableCell align="right">{row.salesAmount}</TableCell>
                <TableCell align="right">
                  <Button
                    component={NavLink}
                    to={`../detail/${row.id}`}
                    state={{
                      adminAddr: adminAddr,
                      appMeta: appMeta,
                      productInfo: row,
                    }}
                  >
                    explore
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody> */}
        </Table>
      </TableContainer>
    </>
  );
}
