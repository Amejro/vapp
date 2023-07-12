import { Splitter, SplitterPanel } from "primereact/splitter";
import { TabPanel, TabView } from "primereact/tabview";
import { useState } from "react";
import { db } from "../util/db";
import { useLiveQuery } from "dexie-react-hooks";
import ArchivedWaterQuality from "./archive/ArchivedWaterQuality";
import ArchivedFeeding from "./archive/ArchivedFeeding";
import ArchivedStockDensity from "./archive/ArchivedStockDensity";
import ArchivedSorting from "./archive/ArchivedSorting";
function Archive({ pond }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeArchive, setactiveArchive] = useState(0);
  const [active, setactive] = useState(0);
  const archives = useLiveQuery(() =>
    db.archive.where("fkey").equals(pond?.id).reverse().toArray()
  );

  const hightlight =
    "text-[#6366f1] capitalize bg-[#f0f7ff] font-bold px-5 py-1";

  const unhightlight = "text-[#6366f1] capitalize  font-bold px-5 py-1";

  if (!archives) return;
  return (
    <div>
      <Splitter style={{ height: "85vh" }}>
        <SplitterPanel
          size={20}
          // minSize={15}
        >
          <Splitter>
            <SplitterPanel
              size={50}
              // minSize={20}
            >
              <ul className="h-full  py-5">
                {archives?.map((data, index) => (
                  <li
                    role="button"
                    onClick={() => {
                      setactive(index);
                      setactiveArchive(index);
                      // console.log(data.id);
                    }}
                    key={data?.id}
                    className={active == index ? hightlight : unhightlight}
                  >
                    {data?.name}
                  </li>
                ))}
              </ul>
            </SplitterPanel>
            <SplitterPanel
              size={50}
              // minSize={70}
            >
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
            </SplitterPanel>
          </Splitter>
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
              <p className="m-0">Water quality</p>
              <ArchivedWaterQuality Data={archives[activeArchive]} />
            </TabPanel>
            <TabPanel>
              <p className="m-0">Feeding</p>
              <ArchivedFeeding Data={archives[activeArchive]} />
            </TabPanel>
            <TabPanel>
              <p className="m-0">Sorting</p>
              <ArchivedSorting Data={archives[activeArchive]} />
            </TabPanel>
            <TabPanel>
              <p className="m-0">Stock Density</p>
              <ArchivedStockDensity Data={archives[activeArchive]} />
            </TabPanel>
          </TabView>
        </SplitterPanel>
      </Splitter>
    </div>
  );
}

export default Archive;
