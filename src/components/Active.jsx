import { Splitter, SplitterPanel } from "primereact/splitter";
import { useState } from "react";
import { Button } from "primereact/button";
import { TabPanel, TabView } from "primereact/tabview";
import WaterQuality from "./WaterQuality";
import { db } from "../util/db";
import Feeding from "./Feeding";
import Sorting from "./Sorting";
import StockDensity from "./StockDensity";
import Manage from "./Manage";
import CreateBatch from "./CreateBatch";
import { NewBatchIcon } from "./Icons";
import { useLiveQuery } from "dexie-react-hooks";
function Active({ pond }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [data, setdata] = useState();

  const archivedData = useLiveQuery(() =>
    db?.archive_join.where("fkey").equals(pond.id).toArray()
  );

  const hightlight =
    "text-[#6366f1] capitalize bg-[#f0f7ff] font-bold px-5 py-1";

  const unhightlight = "text-[#6366f1] capitalize  font-bold px-5 py-1";

  if (!archivedData) return null;

  return (
    <div>
      <Splitter style={{ height: "85vh" }}>
        <SplitterPanel size={20} minSize={15} className="">
          <div className="grid grid-cols-1 h-full">
            <div className="flex flex-col py-5">
              <div
                onClick={() => setActiveIndex(0)}
                role="button"
                className={activeIndex == 0 ? hightlight : unhightlight}
              >
                Water quality
              </div>

              <div
                onClick={() => setActiveIndex(1)}
                role="button"
                className={activeIndex == 1 ? hightlight : unhightlight}
              >
                Feeding
              </div>

              <div
                onClick={() => setActiveIndex(2)}
                role="button"
                className={activeIndex == 2 ? hightlight : unhightlight}
              >
                Sorting
              </div>

              <div
                onClick={() => setActiveIndex(3)}
                role="button"
                className={activeIndex == 3 ? hightlight : unhightlight}
              >
                Stock density
              </div>
            </div>

            <div className="self-end pb-5 px-4">
              {archivedData?.length == 0 ? (
                " "
              ) : (
                <Manage Archive={archivedData[0]} pond={pond} />
              )}
            </div>
          </div>
        </SplitterPanel>
        <SplitterPanel
          size={80}
          minSize={70}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "start",
          }}
        >
          <TabView
            className="customNav"
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
          >
            <TabPanel>
              {archivedData?.length == 0 ? (
                <CreateBatch pond={pond} />
              ) : (
                <WaterQuality PondID={pond.id} />
              )}
            </TabPanel>
            <TabPanel>
              <p className="m-0">Feeding</p>
              {archivedData?.length == 0 ? (
                <CreateBatch pond={pond} />
              ) : (
                <Feeding PondID={pond.id} />
              )}
            </TabPanel>
            <TabPanel>
              <p className="m-0">Sorting</p>

              {archivedData?.length == 0 ? (
                <CreateBatch pond={pond} />
              ) : (
                <Sorting PondID={pond.id} />
              )}
            </TabPanel>
            <TabPanel>
              <p className="m-0">Stock Density</p>

              {archivedData?.length == 0 ? (
                <CreateBatch pond={pond} />
              ) : (
                <StockDensity PondID={pond.id} />
              )}
            </TabPanel>
          </TabView>
        </SplitterPanel>
      </Splitter>
    </div>
  );
}

export default Active;
