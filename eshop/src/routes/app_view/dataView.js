import MUIDataTable from "mui-datatables";
import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { Button, TextField, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import fetch from "node-fetch";
import * as _ from "lodash";
import * as keccak256 from "keccak256";



import { getLeafNodes, getLeafNodesByInfo, getRoot, isValidAddr } from "../../utils/utils";
import { API_DB } from "../../utils/constants";
import { web3 } from "../../utils/wallet";
import { MintTransaction } from "../../utils/mint";

const muiCache = createCache({
    key: "mui-datatables",
    prepend: true
});

export async function loader({ params }) {
    return params.proxyAddress;
}

const getToken = async () => {
    const authUrl = 'https://dev-m1ef8b65he25183a.us.auth0.com/oauth/token';
    var options = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '{"client_id":"08TNJV9eX6FfYwIJh8vrq3AqAYwzAAFs","client_secret":"8qrL5lgIYphGuuye6u1r0ld5TgEXbGVdoSXDsRW3jnQoq8lpdA9KnLbAkshJ81KK","audience":"https://auth0-jwt-authorizer","grant_type":"client_credentials"}'
    };

    const tokenResponse = await fetch(authUrl, options)
        .then(response => response.json())
        .then(async response => {
            return response
        })
        .catch(error => {
            console.error(error);
        });

    console.log("tokenResponse", tokenResponse);
    return `${tokenResponse.token_type} ${tokenResponse.access_token}`;
}

export const DataView = () => {
    const contract = useLoaderData();
    const [responsive, setResponsive] = useState("vertical");
    const [tableBodyHeight, setTableBodyHeight] = useState("400px");
    const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");
    const [searchBtn, setSearchBtn] = useState(true);
    const [downloadBtn, setDownloadBtn] = useState(true);
    const [printBtn, setPrintBtn] = useState(true);
    const [viewColumnBtn, setViewColumnBtn] = useState(true);
    const [filterBtn, setFilterBtn] = useState(true);
    // const [allowlistData, setAllowlistData] = useState([]);
    const [auth0Token, setAuth0Token] = useState("");

    const [merkleRoot, setMerkleRoot] = useState(null);

    const [roundInput, setRoundInput] = useState(0);

    const [allowlistStrList, setAllowlistStrList] = useState({});

    const columns = [
        { name: "Address", options: { filterOptions: { fullWidth: true } } },
        "Round",
    ];

    const options = {
        search: searchBtn,
        download: downloadBtn,
        print: printBtn,
        viewColumns: viewColumnBtn,
        filter: filterBtn,
        filterType: "dropdown",
        responsive,
        tableBodyHeight,
        tableBodyMaxHeight,
        onTableChange: (action, state) => {
            console.log(action);
            console.dir(state);
        }
    };

    const getDataFromDB = async (account) => {
        try {
            await fetch(API_DB + "allowlist/" + account + "/" + contract, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(async response => {
                    const dataFromDb = _.get(response, ["Item", "AllowlistData"]);
                    console.log("DATA", dataFromDb);
                    if (dataFromDb) {
                        setAllowlistStrList(JSON.parse(dataFromDb))
                    }
                })
                .catch(error => {
                    console.error(error);
                });

        } catch (error) {

        }
    }

    const setShowData = (addresses, round) => {
        allowlistStrList[round] = addresses;
        setAllowlistStrList((prevState) => ({
            ...prevState,
            [round]: allowlistStrList[round]
        }));
        generateMerkleRoot();
    }

    const generateMerkleRoot = () => {
        console.log("generateMerkleRoot", allowlistStrList);
        var allDataHolder = [];
        for (let i in allowlistStrList) {
            allDataHolder = allDataHolder.concat(
                allowlistStrList[i].map(
                    addr => { return { address: addr, round: i } }
                )
            );
        }
        console.log("setShowData", allDataHolder);
        const leafNodes = getLeafNodesByInfo(contract, allDataHolder);
        const merkleRootTmp = "0x" + getRoot(leafNodes);
        setMerkleRoot(merkleRootTmp);
        console.log("setMerkleRoot root", merkleRootTmp);
    }

    const handleAddressSetting = (addresses) => {
        const leafNodes = getLeafNodes(contract, addresses, roundInput.toString());
        setShowData(addresses, roundInput);
    }

    const handleFileCapture = ({ target }) => {
        if (!isValidAddr(contract)) {
            alert("No contact address found!");
        }
        const fileReader = new FileReader();
        const type = target.files[0].type;
        console.log("type", type, target.accept);
        fileReader.readAsText(target.files[0]);
        fileReader.onload = (e) => {
            try {
                var addresses = [];
                if (type === 'application/json') {
                    const json = JSON.parse(e.target.result);
                    console.log('json global var has been set to parsed json of this file here it is unevaled = \n' + JSON.stringify(json));
                    for (const address in json) {
                        // console.log(json[address]);
                        addresses.push(json[address]);
                    }
                }
                else {
                    const lines = e.target.result.split("\n");
                    for (let line of lines) {
                        line = line.trim();
                        addresses.push(line);
                    }
                    console.log('pure text lines', lines);
                }
                // console.log(addresses);
                for (const index in addresses) {
                    // console.log(addresses[index]);
                    if (!isValidAddr(addresses[index])) {
                        console.log("invalid address", addresses[index]);
                        throw new Error("Invalid address in file");
                    }
                }
                handleAddressSetting(addresses);
            } catch (err) {
                console.error('ERROR = ' + err);
            }
        };
    };

    const handleRoundInputChange = (event) => {
        setRoundInput(event.target.value);
    }

    const checkAllowlistSyntax = (allowlistObj) => {
        for (let i in allowlistObj) {
            if (allowlistObj[i]) {
                var revisedListTmp = [];
                console.log(allowlistObj[i]);
                for (let j of allowlistObj[i]) {
                    const tmpAddr = j.trim();
                    if (!isValidAddr(tmpAddr)) {
                        throw new Error("Not a valid wallet address" + tmpAddr);
                    }
                    if (!revisedListTmp.includes(tmpAddr)) {
                        revisedListTmp.push(tmpAddr);
                    }
                    allowlistStrList[i] = revisedListTmp;
                    setAllowlistStrList((prevState) => ({
                        ...prevState,
                        [i]: allowlistStrList[i]
                    }));
                }

            }
            else {
                throw new Error("Not a valid array")
            }
        }
        generateMerkleRoot();
    }

    return (
        <div>
            <TextField fullWidth id="outlined-basic" label="roundInput" variant="outlined" value={roundInput}
                onChange={handleRoundInputChange} />
            <Button
                onClick={async () => {
                    const accounts = await web3.eth.getAccounts();
                    const account = accounts[0];
                    await getDataFromDB(account)
                }}
            >
                get file
            </Button>
            <Button
                onClick={async () => {
                    await getToken()
                }}
            >
                get token
            </Button>
            <Button
                variant="contained"
                component="label"
            >
                Upload File
                <input
                    type="file"
                    onChange={handleFileCapture}
                />
            </Button>
            <Button onClick={async () => {
                const accounts = await web3.eth.getAccounts();
                const account = accounts[0];
                checkAllowlistSyntax(allowlistStrList);
                const message = 'Update whitelist database ' + keccak256(JSON.stringify(allowlistStrList)).toString('hex');
                const signature = await web3.eth.personal.sign(message, account);
                const body = {
                    UserAddr: account,
                    ContractAddr: contract,
                    Signature: signature,
                    AllowlistData: JSON.stringify(allowlistStrList)
                };
                console.log("body", JSON.stringify(body));
                if (!auth0Token) {
                    const tokenTmp = await getToken();
                    setAuth0Token(tokenTmp);
                }

                try {
                    const response = await fetch(API_DB + "allowlist/" + account, {
                        method: 'PUT',
                        body: JSON.stringify(body),
                        headers: {
                            'Content-Type': 'application/json',
                            "authorization": auth0Token
                        }

                    })
                        .then(response => {
                            return response
                        })
                        .catch(error => {
                            console.error(error);
                        });

                    console.log(response);
                }
                catch (err) {
                    console.error(err);
                }
            }}>
                Sign
            </Button>
            <Typography>
                {merkleRoot}
            </Typography>
            <Button onClick={async () => {
                await MintTransaction(contract, "setMerkleRoot",
                    [merkleRoot],
                    0,
                );

            }}>
                Set Merkle Root
            </Button>
            <div>
                {Object.keys(allowlistStrList).map((row, index) => <div
                    key={index}
                >
                    <TextField
                        id={"outlined-multiline-static"}
                        label={"Round " + row}
                        multiline
                        fullWidth
                        // rows={10}
                        defaultValue="Default Value"
                        value={allowlistStrList[row].join('\n')}
                        // onChange={(event) => handleAllowlistChange(event, index)}
                        onChange={(event) => {
                            allowlistStrList[row] = event.target.value.split('\n');
                            setAllowlistStrList((prevState) => ({
                                ...prevState,
                                [row]: allowlistStrList[row]
                            }));
                        }}
                    />
                    {/* <TextField id="outlined-basic" label="round" variant="outlined" value={allowlistRoundList[index]} key={"round" + index} /> */}
                </div>)}
            </div>

            {/* <CacheProvider value={muiCache}>
                <ThemeProvider theme={createTheme()}>
                    <FormControl>
                        <InputLabel id="demo-simple-select-label">
                            Responsive Option
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={responsive}
                            style={{ width: "200px", marginBottom: "10px", marginRight: 10 }}
                            onChange={(e) => setResponsive(e.target.value)}
                        >
                            <MenuItem value={"vertical"}>vertical</MenuItem>
                            <MenuItem value={"standard"}>standard</MenuItem>
                            <MenuItem value={"simple"}>simple</MenuItem>

                            <MenuItem value={"scroll"}>scroll (deprecated)</MenuItem>
                            <MenuItem value={"scrollMaxHeight"}>
                                scrollMaxHeight (deprecated)
                            </MenuItem>
                            <MenuItem value={"stacked"}>stacked (deprecated)</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel id="demo-simple-select-label">
                            Table Body Height
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={tableBodyHeight}
                            style={{ width: "200px", marginBottom: "10px", marginRight: 10 }}
                            onChange={(e) => setTableBodyHeight(e.target.value)}
                        >
                            <MenuItem value={""}>[blank]</MenuItem>
                            <MenuItem value={"400px"}>400px</MenuItem>
                            <MenuItem value={"800px"}>800px</MenuItem>
                            <MenuItem value={"100%"}>100%</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel id="demo-simple-select-label">
                            Max Table Body Height
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={tableBodyMaxHeight}
                            style={{ width: "200px", marginBottom: "10px" }}
                            onChange={(e) => setTableBodyMaxHeight(e.target.value)}
                        >
                            <MenuItem value={""}>[blank]</MenuItem>
                            <MenuItem value={"400px"}>400px</MenuItem>
                            <MenuItem value={"800px"}>800px</MenuItem>
                            <MenuItem value={"100%"}>100%</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel id="demo-simple-select-label">Search Button</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={searchBtn}
                            style={{ width: "200px", marginBottom: "10px" }}
                            onChange={(e) => setSearchBtn(e.target.value)}
                        >
                            <MenuItem value={"true"}>{"true"}</MenuItem>
                            <MenuItem value={"false"}>{"false"}</MenuItem>
                            <MenuItem value={"disabled"}>disabled</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel id="demo-simple-select-label">Download Button</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={downloadBtn}
                            style={{ width: "200px", marginBottom: "10px" }}
                            onChange={(e) => setDownloadBtn(e.target.value)}
                        >
                            <MenuItem value={"true"}>{"true"}</MenuItem>
                            <MenuItem value={"false"}>{"false"}</MenuItem>
                            <MenuItem value={"disabled"}>disabled</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel id="demo-simple-select-label">Print Button</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={printBtn}
                            style={{ width: "200px", marginBottom: "10px" }}
                            onChange={(e) => setPrintBtn(e.target.value)}
                        >
                            <MenuItem value={"true"}>{"true"}</MenuItem>
                            <MenuItem value={"false"}>{"false"}</MenuItem>
                            <MenuItem value={"disabled"}>disabled</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel id="demo-simple-select-label">
                            View Column Button
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={viewColumnBtn}
                            style={{ width: "200px", marginBottom: "10px" }}
                            onChange={(e) => setViewColumnBtn(e.target.value)}
                        >
                            <MenuItem value={"true"}>{"true"}</MenuItem>
                            <MenuItem value={"false"}>{"false"}</MenuItem>
                            <MenuItem value={"disabled"}>disabled</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel id="demo-simple-select-label">Filter Button</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={filterBtn}
                            style={{ width: "200px", marginBottom: "10px" }}
                            onChange={(e) => setFilterBtn(e.target.value)}
                        >
                            <MenuItem value={"true"}>{"true"}</MenuItem>
                            <MenuItem value={"false"}>{"false"}</MenuItem>
                            <MenuItem value={"disabled"}>disabled</MenuItem>
                        </Select>
                    </FormControl>
                    <MUIDataTable
                        title={"ACME Employee list"}
                        data={allowlistData}
                        columns={columns}
                        options={options}
                    />
                </ThemeProvider>
            </CacheProvider> */}
        </div >
    );
}