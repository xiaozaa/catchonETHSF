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
import { getMetaDataOfProxy } from "../../utils/reafactored_util/contract_access_object/readerCao";
import {
  getBalanceOf,
  getImgUrl,
  getItemIdList,
  getNameOf,
  getNumMinted,
  getSalesAmountOf,
  getSupplyOf,
} from "../../utils/reafactored_util/contract_access_object/eStore/readerCao";
import { Box } from "@mui/system";
import "../../css/overview.css";

export async function loader({ params }) {
  const proxyAddr = params.proxyAddress;
  const storeMetaData = await getMetaDataOfProxy(proxyAddr);
  const productIdList = await getItemIdList(proxyAddr);
  console.log("productIdList: ", productIdList);

  const productInfoList = [];
  for (const productId in productIdList) {
    const name = await getNameOf(productId, proxyAddr);
    const supply = await getSupplyOf(productId, proxyAddr);
    const balance = await getBalanceOf(productId, proxyAddr);
    const salesAmount = await getSalesAmountOf(productId, proxyAddr);
    const numMinted = await getNumMinted(productId, proxyAddr);
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
  console.log("productInfoList: ", productInfoList);
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
  console.log("Item list: ", itemList);

  const displayCards = itemList.map((item) => {
    return (
      <Box className="productCard">
        <Card>
          <CardContent>
            <img src={item.imgUrl} width="250" height="250" />
            <Typography variant="h3">{item.name}</Typography>
            <span>
              {item.numMinted} of {item.supply} sold
            </span>
          </CardContent>
          <CardActions>
            <Button>share</Button>
          </CardActions>
        </Card>
      </Box>
    );
  });

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
      <Button
        component={NavLink}
        id={"add-product-button"}
        to={"../addProduct"}
        state={{ adminAddr: adminAddr, appMeta: appMeta, proxyAddr: proxyAddr }}
      >
        Add
      </Button>
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

      <div> {displayCards} </div>
    </>
  );
};
