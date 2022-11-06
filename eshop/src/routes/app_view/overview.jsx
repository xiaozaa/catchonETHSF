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
          <CardContent sx={{ borderRadius: 20 }}>
            <img
              sx={{ borderRadius: 5 }}
              src={item.imgUrl}
              width="333"
              height="333"
            />
            <div sx={{ margin: 10 }}>
              <Typography variant="h3">{item.name}</Typography>
              <span>
                {item.numMinted} of {item.supply} sold
              </span>
            </div>
          </CardContent>
          <CardActions>
            <Button sx={{ textAlign: "right", color: "red" }}>Remove</Button>
          </CardActions>
        </Card>
      </Box>
    );
  });

  return (
    <>
      {/* <h2>Overview</h2> */}
      <Button
        component={NavLink}
        id={"add-product-button"}
        className="add-new-product"
        sx={{ fontWeight: "bold" }}
        to={"../addProduct"}
        state={{ adminAddr: adminAddr, appMeta: appMeta, proxyAddr: proxyAddr }}
      >
        Create Product
      </Button>

      <div className="cards-holder"> {displayCards} </div>
    </>
  );
};
