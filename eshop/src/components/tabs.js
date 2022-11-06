import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import MultiActionAreaCard from "./grid";

export default function LabTabs() {
  const [value, setValue] = React.useState("1");
  // (event: React.SyntheticEvent, newValue: string)
  const handleChange = () => {
    setValue(value);
  };

  return (
    <Box
      sx={{
        width: "100%",
        typography: "body1",
        // position: "relative",
        // top: -100,
        // left: -100,
      }}
    >
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Products (#)" value="1" />
            <Tab label="Buyers" value="2" />
            <Tab label="Integrations" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">Images</TabPanel>
        <TabPanel value="2">List of Buyers</TabPanel>
        <TabPanel value="3">Integrations</TabPanel>
      </TabContext>
    </Box>
  );
}
