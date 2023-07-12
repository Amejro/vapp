import { Menu } from "primereact/menu";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { ManageIcon } from "./Icons";
import { Tooltip } from "primereact/tooltip";
import { db } from "../util/db";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
function Manage({ Archive, pond }) {
  // useEffect(() => {
  //   db.archive_join.toArray().then((res) => {
  //     setcheck(res);
  //     setarchivedData(res[0].name);
  //   });
  // }, [archivedData]);
  const menuLeft = useRef(null);
  const [visible, setVisible] = useState(false);
  const [confirm, setconfirm] = useState("");
  const toast = useRef(null);
  const msgRef = useRef(null);
  function handleSave() {
    db.transaction(
      "rw",
      db.ponds,
      db.water_qualities,
      db.stocking_densities,
      db.feedings,
      db.sortings,
      db.archive,
      // archive_join,
      async () => {
        const waterQuality = await db.water_qualities
          .where("fkey")
          .equals(pond?.id)
          .toArray();

        const feeding = await db.feedings
          .where("fkey")
          .equals(pond?.id)
          .toArray();

        const sorting = await db.sortings
          .where("fkey")
          .equals(pond?.id)
          .toArray();

        const stockDensity = await db.stocking_densities
          .where("fkey")
          .equals(pond?.id)
          .toArray();

        await db.archive
          .where("ar_joinFkey")
          .equals(Archive.id)
          .primaryKeys()
          .then((key) => {
            const data = {
              createdAt: Date.now(),
              name: Archive.name,
              waterQuality,
              stockDensity,
              feeding,
              sorting,
              fkey: pond.id,
              ar_joinFkey: Archive.id,
            };
            if (key.length == 0) {
              db.archive.add(data);
              console.log("adding..");
            } else {
              console.log("updating..");
              db.archive.update(key[0], data);
            }
          });
      }
    );
  }

  function handleSaveReset() {
    db.transaction(
      "rw",
      db.ponds,
      db.water_qualities,
      db.stocking_densities,
      db.feedings,
      db.sortings,
      db.archive,
      db.archive_join,
      async () => {
        const waterQuality = await db.water_qualities
          .where("fkey")
          .equals(pond?.id)
          .toArray();

        const feeding = await db.feedings
          .where("fkey")
          .equals(pond?.id)
          .toArray();

        const sorting = await db.sortings
          .where("fkey")
          .equals(pond?.id)
          .toArray();

        const stockDensity = await db.stocking_densities
          .where("fkey")
          .equals(pond?.id)
          .toArray();

        await db.archive
          .where("ar_joinFkey")
          .equals(Archive.id)
          .primaryKeys()
          .then((key) => {
            const data = {
              createdAt: Date.now(),
              name: Archive.name,
              waterQuality,
              stockDensity,
              feeding,
              sorting,
              fkey: pond.id,
              ar_joinFkey: Archive.id,
            };
            if (key.length == 0) {
              db.archive.add(data);
              db.archive_join.delete(Archive.id);
              db.water_qualities
                .where("fkey")
                .equals(pond.id)
                .each((res) => db.water_qualities.delete(res.id)),
                db.stocking_densities
                  .where("fkey")
                  .equals(pond.id)
                  .each((res) => db.stocking_densities.delete(res.id)),
                db.feedings
                  .where("fkey")
                  .equals(pond.id)
                  .each((res) => db.feedings.delete(res.id)),
                db.sortings
                  .where("fkey")
                  .equals(pond.id)
                  .each((res) => db.sortings.delete(res.id));
            } else {
              console.log("updating..");
              db.archive.update(key[0], data);
              db.archive_join.delete(Archive.id);
              db.water_qualities
                .where("fkey")
                .equals(pond.id)
                .each((res) => db.water_qualities.delete(res.id)),
                db.stocking_densities
                  .where("fkey")
                  .equals(pond.id)
                  .each((res) => db.stocking_densities.delete(res.id)),
                db.feedings
                  .where("fkey")
                  .equals(pond.id)
                  .each((res) => db.feedings.delete(res.id)),
                db.sortings
                  .where("fkey")
                  .equals(pond.id)
                  .each((res) => db.sortings.delete(res.id));
            }
          });
      }
    );
  }

  const footerContent = (
    <div>
      <Button
        label="Cancel"
        onClick={() => {
          setVisible(false);
          setconfirm("");
        }}
        className="p-button-text"
      />
      <Button
        label="Confirm"
        onClick={() => {
          if (confirm.trim() === Archive.name) {
            handleSaveReset();
            setVisible(false);
            toast.current.show({
              severity: "success",
              summary: "Saved",
              detail: "Data saved to archive and batch reset",
              life: 3000,
            });
            setconfirm("");
          } else {
            msgRef.current.className = "inline";
          }
          //
        }}
      />
    </div>
  );

  const items = [
    {
      label: "Manage",
      items: [
        {
          label: `Save (${Archive.name})`,
          icon: "pi pi-refresh",
          command: () => {
            handleSave();

            toast.current.show({
              severity: "success",
              summary: "Saved",
              detail: "Data saved to archive",
              life: 3000,
            });
          },
        },
        {
          label: `Save (${Archive.name}) & Reset`,
          icon: "pi pi-times",
          command: () => {
            setVisible(true);
          },
        },
      ],
    },
  ];

  return (
    <>
      <div className="card flex justify-content-center">
        <Tooltip target=".logo" mouseTrack mouseTrackLeft={10} />
        <Toast ref={toast}></Toast>
        <Menu model={items} popup ref={menuLeft} id="popup_menu_left" />
        <div
          className="logo"
          role="button"
          data-pr-tooltip="Manage"
          onClick={(event) => menuLeft.current.toggle(event)}
        >
          <ManageIcon />
        </div>
      </div>

      <Dialog
        header={`Enter (${Archive.name}) to confirm`}
        visible={visible}
        position={"bottom-left"}
        style={{ width: "40vw" }}
        onHide={() => {
          setVisible(false);
          setconfirm("");
        }}
        footer={footerContent}
        draggable={false}
        resizable={false}
      >
        <div className="flex flex-col space-x-1">
          <span className="p-float-label">
            <InputText
              autoFocus
              value={confirm}
              onChange={(e) => setconfirm(e.target.value)}
            />
            <div ref={msgRef} className="hidden">
              <Message
                severity="error"
                text={`Enter "${Archive.name}" to confirm`}
              />
            </div>
          </span>
        </div>
      </Dialog>
    </>
  );
}
export default Manage;
