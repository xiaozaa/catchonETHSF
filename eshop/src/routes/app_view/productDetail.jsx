import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Divider,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";

export function ProductDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { appMeta, productInfo } = location.state;

  return (
    <>
      <h1> Product Detail </h1>
      <h2>{`${productInfo.name}`}</h2>
      <h3>Basic Info</h3>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableBody>
            <TableRow>
              <TableCell align="right">Supply</TableCell>
              <TableCell align="left">{productInfo.supply}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="right">Sold</TableCell>
              <TableCell align="left">
                {productInfo.supply - productInfo.balance}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="right">Balance</TableCell>
              <TableCell align="left">{productInfo.balance}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <h3>Sales Info</h3>
      We can put some graph here, showing the trend of how this product was
      sold, even the price trend.
      <Divider></Divider>
      <Button
        component={NavLink}
        to={`../edit/${productInfo.id}`}
        state={{
          appMeta: appMeta,
          productInfo: productInfo,
        }}
      >
        Config
      </Button>
      <Button>下架</Button>
    </>
  );
}
