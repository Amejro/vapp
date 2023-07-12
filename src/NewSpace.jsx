import { TabView, TabPanel } from "primereact/tabview";

import "primereact/resources/themes/lara-light-indigo/theme.css";

//core
import "primereact/resources/primereact.min.css";
import { db } from "./util/db";
import { useLiveQuery } from "dexie-react-hooks";
import { useNavigate, useParams } from "react-router-dom";
import Active from "./components/Active";
import Archive from "./components/archive";

function NewSpace() {
  const { pondName } = useParams();
  const pondData = useLiveQuery(() => db?.ponds.toArray());
  const pond = pondData?.find((pond) => pond.name === pondName);
  const navigate = useNavigate();

  // const badgeData = useLiveQuery(() =>
  //   db?.badges.where("fkey").equals(pond.id).toArray()
  // );

  if (!pond) return null;

  return (
    <TabView className="">
      <TabPanel header="Active">
        <Active pond={pond} />
      </TabPanel>
      <TabPanel header="Archive">
        <Archive pond={pond} />
      </TabPanel>
    </TabView>
  );
}

export default NewSpace;
