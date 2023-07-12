import { useState } from "react";
import WaterQuality from "./WaterQuality";
import StockDensity from "./StockDensity";
import Feeding from "./Feeding";
import CreatedBadge from "./CreateBadge";
import { ModalsProvider } from "@mantine/modals";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab, { tabClasses } from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";
import Select, { selectClasses } from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import Typography from "@mui/joy/Typography";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../util/db";
import { Box } from "@mantine/core";
import { Divider } from "@mui/material";
import Sorting from "./Sorting";
import { BackIcon } from "./Icons";
import { useNavigate } from "react-router-dom";

function Navigation({ pond }) {
  const navigate = useNavigate();

  const [badgeID, setBadgeID] = useState();

  const badgeData = useLiveQuery(() =>
    db?.badges.where("fkey").equals(pond.id).toArray()
  );

  if (!badgeData) return;

  return (
    <>
      <Box sx={{ height: "100%" }}>
        <Tabs
          aria-label="Vertical tabs"
          orientation="vertical"
          sx={{
            // bgcolor: "#f0f7ff",
            width: "100%",
            height: "100vh",
          }}
        >
          <div style={{ height: "100vh" }}>
            <TabList
              variant="plain"
              sx={{
                // maxWidth: 400,
                // mx: "auto",
                // pt: 2,
                // bgcolor: "f0f7ff",
                alignSelf: "flex-start",
                [`& .${tabClasses.root}`]: {
                  bgcolor: "f0f7ff",
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: "transparent",
                  },
                  [`&.${tabClasses.selected}`]: {
                    color: "primary.plainColor",
                    fontWeight: "lg",
                    "&:before": {
                      // content: '""',
                      display: "block",
                      position: "absolute",
                      zIndex: 1,
                      bottom: "-1px",
                      left: "var(--ListItem-paddingLeft)",
                      right: "var(--ListItem-paddingRight)",
                      height: "3px",
                      borderTopLeftRadius: "3px",
                      borderTopRightRadius: "3px",
                      bgcolor: "primary.500",
                    },
                  },
                },
              }}
            >
              <div
                onClick={() => {
                  navigate(-1);
                }}
                style={{
                  marginLeft: "10px",
                  marginTop: "10px",
                  height: "20px",
                  width: "20px",
                  cursor: "pointer",
                }}
              >
                <BackIcon />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  paddingTop: "50px",
                  gap: "20px",
                }}
              >
                <ModalsProvider>
                  <CreatedBadge ID={pond.id} />
                </ModalsProvider>

                <Box sx={{ display: "flex" }}>
                  <Typography level="h3">{pond?.name}:</Typography>
                  <Select
                    placeholder="Select a Badge"
                    // startDecorator={pond?.name}
                    indicator={<KeyboardArrowDown />}
                    sx={{
                      width: 200,
                      [`& .${selectClasses.indicator}`]: {
                        transition: "0.2s",
                        [`&.${selectClasses.expanded}`]: {
                          transform: "rotate(-180deg)",
                        },
                      },
                    }}
                  >
                    {badgeData.map((badge) => (
                      <Option
                        key={badge.id}
                        value={badge.name}
                        onClick={() => {
                          setBadgeID(badge.id);
                        }}
                      >
                        {badge.name}
                      </Option>
                    ))}
                  </Select>
                </Box>
              </div>
              <div
                style={{
                  paddingTop: "10px",
                }}
              >
                <Divider orientation="horizontal" />
              </div>
              <Tab>Water Quality</Tab>
              <Tab>Stock Density</Tab>
              <Tab>Feeding</Tab>
              <Tab>Sorting</Tab>
            </TabList>
          </div>
          <Divider orientation="vertical" />
          <TabPanel sx={{ p: 2, minHeight: 200 }}>
            {badgeID ? <WaterQuality BadgeID={badgeID} /> : " "}
          </TabPanel>
          <TabPanel value={1} sx={{ p: 2, minHeight: 200 }}>
            {badgeID ? <StockDensity BadgeID={badgeID} /> : " "}
          </TabPanel>
          <TabPanel value={2} sx={{ p: 2, minHeight: 200 }}>
            {badgeID ? <Feeding BadgeID={badgeID} /> : " "}
          </TabPanel>
          <TabPanel value={3} sx={{ p: 2, minHeight: 200 }}>
            {badgeID ? <Sorting BadgeID={badgeID} /> : " "}
          </TabPanel>
        </Tabs>
      </Box>
    </>
  );
}

export default Navigation;
