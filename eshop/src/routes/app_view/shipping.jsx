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

async function fetchShippingRecordsOfProxy(proxyAddr) {
  /*
    return await fetch(API_DB + "ship/" + contractAddr, {
        method: "GET",
      })
        .then((response) => response.json())
        .then(async (response) => {
          const dataFromDb = _.get(response, ["Item", "Abi"]);
          console.log("ABI", dataFromDb);
          if (dataFromDb) {
            abi[contractAddr] = JSON.parse(dataFromDb);
            return JSON.parse(dataFromDb);
          }
        })
        .catch((error) => {
          console.error(error);
        });
        */
  return [];
}

export async function loader({ params }) {
  const proxyAddr = params.proxyAddress;

  console.log("shipping info of: ", proxyAddr);

  const records = await fetchShippingRecordsOfProxy(proxyAddr);

  console.log("fetched shipping records: ", records);

  const mockRecords = [
    {
      UserWallet: "0x123456789002948575947398594",
      ContractAddr: "0x24681012141618202224262830",
      Address: "123 Fake Ave, San Jose, CA 95110",
      Redeemed: 3,
      TokenId: 2,
    },
  ];

  console.log("Log mockRecords", mockRecords);

  return {
    proxyAddr: proxyAddr,
    shippingRecords: mockRecords,
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
              <TableCell>UserWallet</TableCell>
              <TableCell align="right">TokenId</TableCell>
              <TableCell align="right">Address</TableCell>
              <TableCell align="right">Redeemed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shippingRecords.map((row) => (
              <TableRow
                key={row.UserWallet}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.UserWallet}
                </TableCell>
                <TableCell align="right">{row.TokenId}</TableCell>
                <TableCell align="right">{row.Address}</TableCell>
                <TableCell align="right">{row.Redeemed}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
