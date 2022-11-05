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
} from "@mui/material";
import { getMetaDataOfProxy } from "../../utils/reafactored_util/contract_access_object/readerCao";
import {
  getBalanceOf,
  getItemIdList,
  getNameOf,
  getSalesAmountOf,
  getSupplyOf,
} from "../../utils/reafactored_util/contract_access_object/eStore/readerCao";

export async function loader({ params }) {
  const proxyAddr = params.proxyAddress;
  const storeMetaData = await getMetaDataOfProxy(proxyAddr);
  const productIdList = await getItemIdList(proxyAddr);

  const productInfoList = [];
  for (const productId in productIdList) {
    const name = await getNameOf(productId, proxyAddr);
    const supply = await getSupplyOf(productId, proxyAddr);
    const balance = await getBalanceOf(productId, proxyAddr);
    const salesAmount = await getSalesAmountOf(productId, proxyAddr);
    productInfoList.push({
      name: name,
      supply: supply,
      balance: balance,
      salesAmount: salesAmount,
      id: productId,
    });
  }
  return {
    metaData: storeMetaData,
    itemList: productInfoList,
    proxyAddr: proxyAddr,
  };
}

export const Overview = () => {
  const { metaData, itemList, proxyAddr } = useLoaderData();
  const location = useLocation();
  const { adminAddr, appMeta } = location.state;

  console.log("Overview contract", proxyAddr);

  return (
    <>
      <h2>Overview</h2>
      <div>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableBody>
              <TableRow>
                <TableCell align="right">Store</TableCell>
                <TableCell align="left">{metaData.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right">Create Time</TableCell>
                <TableCell align="left">{metaData.createTime}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Divider></Divider>
      <Button>Add</Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Supply</TableCell>
              <TableCell align="right">Balance</TableCell>
              <TableCell align="right">Sales</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
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
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
