import { useLoaderData } from "react-router-dom";
import {
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TableBody,
  TableHead,
} from "@mui/material";

import * as _ from "lodash";
import { getNameOf } from "../../utils/reafactored_util/contract_access_object/eStore/readerCao";

export const API_DB = "https://11xykht95a.execute-api.us-west-1.amazonaws.com/";

async function fetchShippingRecordsOfProxy(proxyAddr) {
  return await fetch(API_DB + "ship/" + proxyAddr, {
    method: "GET",
  })
    .then((response) => response.json())
    .then(async (response) => {
      const dataFromDb = _.get(response, ["Item", "AddressData"]);
      console.log("Addrss Data: ", dataFromDb);
      var body = "";
      if (dataFromDb) {
        return dataFromDb;
      } else {
        console.log("No address data fetched, returning empty array");
        return [];
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

export async function loader({ params }) {
  const proxyAddr = params.proxyAddress;

  console.log("shipping info of: ", proxyAddr);

  const records = await fetchShippingRecordsOfProxy(proxyAddr);

  const renamedRecords = await Promise.all(
    records.map(async (i) => {
      const name = await getNameOf(i.TokenId, proxyAddr);
      i.name = name;
      return i;
    })
  );

  console.log("fetched shipping records: ", records);

  const mockRecords = [
    {
      WalletAddress: "0x123456789002948575947398594",
      ContractAddr: "0x24681012141618202224262830",
      Address: "123 Fake Ave, San Jose, CA 95110",
      Redeemed: 3,
      TokenId: 2,
    },
  ];

  console.log("Log mockRecords", mockRecords);

  return {
    proxyAddr: proxyAddr,
    shippingRecords: renamedRecords,
  };
}

export function Shipping() {
  const { proxyAddr, shippingRecords } = useLoaderData();

  return (
    <>
      <h1>This is Shipping of Proxy Address: {proxyAddr}!</h1>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Buyer</TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Shipping Address</TableCell>
              <TableCell align="left">Amounts</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shippingRecords.map((row) => (
              <TableRow
                key={row.WalletAddress}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.WalletAddress}
                </TableCell>
                <TableCell align="left">{row.name}</TableCell>
                <TableCell align="left">{row.Address}</TableCell>
                <TableCell align="left">{row.Redeemed}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
