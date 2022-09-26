import { useState } from "react";
import { TabPanel } from "./";
import { Box, Tab, Tabs } from "@mui/material";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const TonventoTabs = ({ tabsTiles, tabsContents }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {tabsTiles.map((tabTitle, index) => (
            <Tab key={tabTitle} label={tabTitle} {...a11yProps(index)} />
          ))}
        </Tabs>
      </Box>
      {tabsContents.map((tabContent, index) => (
        <TabPanel key={index} value={value} index={index}>
          {tabContent}
        </TabPanel>
      ))}
    </Box>
  );
};

export default TonventoTabs;
