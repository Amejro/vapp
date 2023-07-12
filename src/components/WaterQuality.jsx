import { useCallback, useEffect, useMemo, useState } from "react";
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

function WaterQuality({ PondID }) {
  const [waterQLT, setwaterQLT] = useState([]);

  function processRowUpdate(newRow) {
    db.water_qualities.update(newRow.id, newRow).then(function (updated) {
      if (updated) console.log(`Row number ${newRow.id} was updated`);
      else
        console.log(
          "Nothing was updated - there were no row with primary key: .."
        );
    });
    const updatedRow = { ...newRow };
    setwaterQLT(
      waterQLT.map((row) => (row.id === newRow.id ? updatedRow : row))
    );
    return updatedRow;
  }

  const handleProcessRowUpdateError = useCallback((error) => {
    console.log(error.message);
  }, []);

  const handleDeleteClick = (id) => async () => {
    try {
      setwaterQLT(waterQLT.filter((row) => row.id !== id));

      db.water_qualities.delete(id).then(function (deleted) {
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
    try {
      const data = {
        createdAt: Date.now(),
        ph: 0,
        oxygen_level: 0,
        temparature: 0,
        fkey: PondID,
      };

      const recordID = await db.water_qualities.add(data);
      const createdData = await db.water_qualities.get(recordID);

      setwaterQLT((arr) => {
        return [...arr, createdData];
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    if (!PondID) return;
    db.water_qualities
      .where("fkey")
      .equals(PondID)
      .toArray(function (pondData) {
        setwaterQLT(pondData);
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
      field: "ph",
      headerName: "PH Level",
      type: "number",
      align: "center",
      width: 120,
      editable: true,
    },
    {
      field: "oxygen_level",
      headerName: "Oxygen Level",
      type: "number",
      align: "center",
      width: 120,
      editable: true,
    },

    {
      field: "temparature",
      headerName: "Temparature",
      type: "number",
      editable: true,
      align: "center",
      width: 120,
      valueFormatter: ({ value }) => `${value} °C`,
    },

    {
      field: "actions",
      type: "actions",
      width: 80,
      disableExport: true,
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
      <div className="h-[70vh]">
        <div style={{ padding: 10 }}>
          <Button
            onClick={() => {
              handleAddRecord();
            }}
            size="sm"
          >
            Add record
          </Button>
        </div>
        <DataGrid
          rows={waterQLT}
          columns={columns}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={handleProcessRowUpdateError}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: {
              setwaterQLT,
              PondID,
            },
          }}
        />
      </div>
    </>
  );
}

export default WaterQuality;

function EditToolbar(props) {
  const { setwaterQLT, PondID } = props;

  return (
    <GridToolbarContainer>
      <GridToolbarExport csvOptions={{ disableToolbarButton: true }} />
    </GridToolbarContainer>
  );
}

EditToolbar.propTypes = {
  setwaterQLT: PropTypes.func.isRequired,
};
