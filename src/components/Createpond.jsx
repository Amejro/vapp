import { useRef, useState } from "react";

import { db } from "../util/db";
import { useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { Button } from "primereact/button";

function Createpond() {
  const inputRef = useRef();
  const navigate = useNavigate();

  const buttonRef = useRef();
  const [visible, setVisible] = useState(false);
  const [pondName, setpondName] = useState("");
  const msgRef = useRef(null);

  const inputStyle = {
    borderRadius: "5px",
    width: "300px",
    height: "30px",
    boder: "solide",
    paddingLeft: "10px",
  };

  const footerContent = (
    <div>
      <Button
        label="Cancel"
        onClick={() => {
          setVisible(false);
          setpondName("");
        }}
        className="p-button-text"
      />
      <Button
        label="Create"
        onClick={() => {
          if (pondName.trim() == "") {
            msgRef.current.className = "inline";
          } else {
            HandleCreate(pondName);

            setVisible(false);
          }
          //
        }}
      />
    </div>
  );

  async function HandleCreate(name) {
    try {
      // Add the new pond!
      const id = await db.ponds.add({
        name,
        slug: name,
        createdAt: Date.now(),
      });

      // console.log(await id)
      const index = await id;
      const createdPond = await db.ponds.get(index);
      navigate(`/NewSpace/${createdPond.name}`);
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <>
      <p
        onClick={() => {
          setVisible(true);
        }}
        role="button"
        className="py-2 pl-8 pr-10 font-bold bg-[#6d7af3] text-white rounded-md"
      >
        <span>+</span> New pond
      </p>

      <Dialog
        header="Enter pond name"
        visible={visible}
        position={"top-right"}
        style={{ width: "30vw" }}
        onHide={() => {
          setVisible(false);
          setpondName("");
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
              value={pondName}
              onChange={(e) => setpondName(e.target.value)}
            />
            <label htmlFor="batch-input">Pond name</label>
          </span>
        </div>
        <div ref={msgRef} className="hidden">
          <Message severity="error" text={`Enter a name.`} />
        </div>
      </Dialog>
    </>
  );
}

export default Createpond;
