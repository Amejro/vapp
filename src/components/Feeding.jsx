import { useCallback, useEffect, useState } from "react";
import {
  DataGrid,
  GridActionsCellItem,
  GridDeleteIcon,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import PropTypes from "prop-types";
import { db } from "../util/db";
import Button from "@mui/joy/Button";

function Feeding({ PondID }) {
  const [feed, setfeed] = useState([]);

  function processRowUpdate(newRow) {
    db.feedings.update(newRow.id, newRow).then(function (updated) {
      if (updated) console.log(`Row number ${newRow.id} was updated`);
      else
        console.log(
          "Nothing was updated - there were no row with primary key: .."
        );
    });
    const updatedRow = { ...newRow };
    setfeed(feed.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  }

  const handleProcessRowUpdateError = useCallback((error) => {
    console.log(error.message);
  }, []);

  const handleDeleteClick = (id) => async () => {
    try {
      setfeed(feed.filter((row) => row.id !== id));

      db.feedings.delete(id).then(function (deleted) {
        if (deleted) console.log(`Row number ${id} was deleted`);
        else
          console.log(
            "Nothing was deleted - there were no row with primary key: .."
          );
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleAddRecord = async () => {
    console.log(PondID);
    try {
      const data = {
        createdAt: Date.now(),
        feed_type: "..",
        size: 0,
        quantity: 0,
        fcr: 0,
        fkey: PondID,
      };

      const recordID = await db.feedings.add(data);
      const createdData = await db.feedings.get(recordID);

      // console.log(createdData);
      setfeed((arr) => {
        return [...arr, createdData];
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    if (!PondID) return;
    db.feedings
      .where("fkey")
      .equals(PondID)
      .toArray(function (badgeData) {
        setfeed(badgeData);
        // console.log(badgeData);
      })
      .catch(function (err) {
        console.error(err);
      });
  }, [PondID]);

  const columns = [
    {
      field: "createdAt",
      headerName: "Date Created",
      type: "dateTime",
      width: 180,
      valueGetter: ({ value }) => value && new Date(value),
    },
    {
      field: "feed_type",
      headerName: "Feed Typel",
      type: "string",
      // align: "center",
      width: 120,
      editable: true,
    },
    {
      field: "size",
      headerName: "Size",
      type: "number",
      // align: "center",
      width: 120,
      editable: true,
    },

    {
      field: "quantity",
      headerName: "Quantity",
      type: "number",
      editable: true,
      // align: "center",
      width: 120,
      //   valueFormatter: ({ value }) => `${value} °C`,
    },

    {
      field: "fcr",
      headerName: "FCR",
      type: "number",
      editable: true,
      // align: "center",
      width: 120,
    },

    {
      field: "actions",
      type: "actions",
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          key={params.id}
          icon={<GridDeleteIcon />}
          onClick={handleDeleteClick(params.id)}
          label="Delete"
        />,
      ],
    },
  ];

  return (
    <>
      <div className="p-2">
        <Button
          onClick={() => {
            handleAddRecord();
          }}
          size="sm"
        >
          Add record
        </Button>
      </div>
      <div style={{ height: "70vh" }}>
        <DataGrid
          rows={feed}
          columns={columns}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={handleProcessRowUpdateError}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setfeed, PondID },
          }}
        />
      </div>
    </>
  );
}

export default Feeding;

function EditToolbar(props) {
  const { setfeed, PondID } = props;

  return (
    <GridToolbarContainer>
      <GridToolbarExport csvOptions={{ disableToolbarButton: true }} />
    </GridToolbarContainer>
  );
}

EditToolbar.propTypes = {
  setfeed: PropTypes.func.isRequired,
};
