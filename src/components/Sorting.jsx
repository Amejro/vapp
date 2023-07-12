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
import { useLiveQuery } from "dexie-react-hooks";
import Button from "@mui/joy/Button";

function Sorting({ PondID }) {
  console.log(PondID);
  const [sort, setsort] = useState([]);

  const badgeData = useLiveQuery(() => db.sortings.toArray());
  // console.log(badgeData)

  function processRowUpdate(newRow) {
    db.sortings.update(newRow.id, newRow).then(function (updated) {
      if (updated) console.log(`Row number ${newRow.id} was updated`);
      else
        console.log(
          "Nothing was updated - there were no row with primary key: .."
        );
    });
    const updatedRow = { ...newRow };
    setsort(sort.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  }

  const handleProcessRowUpdateError = useCallback((error) => {
    console.log(error.message);
  }, []);

  const handleDeleteClick = (id) => async () => {
    try {
      setsort(sort.filter((row) => row.id !== id));

      db.sortings.delete(id).then(function (deleted) {
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
        size: 0,
        pondNumber: 0,
        fkey: PondID,
      };

      const recordID = await db.sortings.add(data);
      const createdData = await db.sortings.get(recordID);

      console.log(createdData);
      setsort((arr) => {
        return [...arr, createdData];
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    if (!PondID) return;
    db.sortings
      .where("fkey")
      .equals(PondID)
      .toArray(function (badgeData) {
        setsort(badgeData);
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
      field: "size",
      headerName: "Size",
      type: "number",
      align: "right",
      // width: 120,
      editable: true,
    },
    {
      field: "pondNumber",
      headerName: "Pond Number",
      type: "number",
      align: "center",
      width: 120,
      editable: true,
    },

    {
      field: "role",
      headerName: "To",

      editable: true,
      type: "singleSelect",
      valueOptions: ["PondA", "PondB", "PondC"],
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
          rows={sort}
          columns={columns}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={handleProcessRowUpdateError}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setsort, PondID },
          }}
        />
      </div>
    </>
  );
}

export default Sorting;

function EditToolbar(props) {
  const { setsort, PondID } = props;

  return (
    <GridToolbarContainer>
      <GridToolbarExport csvOptions={{ disableToolbarButton: true }} />
    </GridToolbarContainer>
  );
}

EditToolbar.propTypes = {
  setsort: PropTypes.func.isRequired,
};
