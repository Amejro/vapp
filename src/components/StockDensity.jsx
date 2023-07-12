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

function StockDensity({ PondID }) {
  const [stock, setstock] = useState([]);

  const badgeData = useLiveQuery(() => db.stocking_densities.toArray());
  // console.log(badgeData)

  function processRowUpdate(newRow) {
    db.stocking_densities.update(newRow.id, newRow).then(function (updated) {
      if (updated) console.log(`Row number ${newRow.id} was updated`);
      else
        console.log(
          "Nothing was updated - there were no row with primary key: .."
        );
    });
    const updatedRow = { ...newRow };
    setstock(stock.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  }

  const handleProcessRowUpdateError = useCallback((error) => {
    console.log(error.message);
  }, []);

  const handleDeleteClick = (id) => async () => {
    try {
      setstock(stock.filter((row) => row.id !== id));

      db.stocking_densities.delete(id).then(function (deleted) {
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
        stocks: 0,
        mortality: 0,
        fkey: PondID,
      };

      const recordID = await db.stocking_densities.add(data);
      const createdData = await db.stocking_densities.get(recordID);

      setstock((arr) => {
        return [...arr, createdData];
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    if (!PondID) return;
    db.stocking_densities
      .where("fkey")
      .equals(PondID)
      .toArray(function (badgeData) {
        setstock(badgeData);
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
      field: "stocks",
      headerName: "stocks",
      type: "number",
      align: "right",
      // width: 120,
      editable: true,
    },
    {
      field: "mortality",
      headerName: "Mortality",
      type: "number",
      align: "right",
      // width: 120,
      editable: true,
    },

    {
      field: "actions",
      type: "actions",
      width: 120,
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
          rows={stock}
          columns={columns}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={handleProcessRowUpdateError}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setstock, PondID },
          }}
        />
      </div>
    </>
  );
}

export default StockDensity;

function EditToolbar(props) {
  const { setstock, PondID } = props;

  return (
    <GridToolbarContainer>
      <GridToolbarExport csvOptions={{ disableToolbarButton: true }} />
    </GridToolbarContainer>
  );
}

EditToolbar.propTypes = {
  setstock: PropTypes.func.isRequired,
};
