import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { NewBatchIcon } from "./Icons";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useRef, useState } from "react";
import { db } from "../util/db";
import { Message } from "primereact/message";

function CreateBatch({ pond }) {
  const [batchName, setbatchName] = useState("");
  const [stock, setStock] = useState();
  const [visible, setVisible] = useState(false);
  const msgRef = useRef(null);
  async function createArchiveJoint() {
    const data = {
      createdAt: Date.now(),
      name: batchName,
      stock,
      fkey: pond.id,
    };

    await db.archive_join.add(data);
  }

  const footerContent = (
    <div>
      <Button
        label="Cancel"
        onClick={() => {
          setVisible(false);
          setbatchName("");
          setStock("");
        }}
        className="p-button-text"
      />
      <Button
        label="Create"
        onClick={() => {
          if (batchName.trim() == "" || stock == null) {
            msgRef.current.className = "inline";
          } else {
            createArchiveJoint();
            setVisible(false);
          }
          //
        }}
      />
    </div>
  );
  return (
    <>
      <div className="pt-40 flex flex-col items-center">
        <div role="button" className=" ">
          <NewBatchIcon />
        </div>
        <p className="text-xl font-bold pb-3">
          Create new batch to get started
        </p>
        <p
          onClick={() => {
            setVisible(true);
          }}
          role="button"
          className="py-2 px-10 font-bold border-4 border-[#6d7af3] rounded-md"
        >
          Create
        </p>
      </div>
      <Dialog
        header="Enter Batch name"
        visible={visible}
        position={"Centter"}
        style={{ width: "40vw" }}
        onHide={() => {
          setVisible(false);
          setbatchName("");
          setStock("");
        }}
        footer={footerContent}
        draggable={false}
        resizable={false}
      >
        <div className="flex flex-col space-y-5 pt-5">
          <span className="p-float-label">
            <InputText
              autoFocus
              id="batch-input"
              value={batchName}
              onChange={(e) => setbatchName(e.target.value)}
            />
            <label htmlFor="batch-input">Batch name</label>
          </span>
          <span className="p-float-label">
            <InputNumber
              id="stock-input"
              value={stock}
              onValueChange={(e) => setStock(e.value)}
            />
            <label htmlFor="stock-input">Stock</label>
          </span>
        </div>
        <div ref={msgRef} className="hidden">
          <Message severity="error" text={`Make entry to all field`} />
        </div>
      </Dialog>
    </>
  );
}

export default CreateBatch;
