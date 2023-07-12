import { useCallback, useEffect, useState } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";

function ArchivedStockDensity({ Data }) {
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
      width: 120,
    },
    {
      field: "mortality",
      headerName: "Mortality",
      type: "number",
      align: "right",
      width: 120,
    },
  ];

  return (
    <>
      <div style={{ height: "70vh" }}>
        <DataGrid
          rows={Data?.stockDensity ?? []}
          columns={columns}
          slots={{
            toolbar: EditToolbar,
          }}
        />
      </div>
    </>
  );
}

export default ArchivedStockDensity;

function EditToolbar(props) {
  return (
    <GridToolbarContainer>
      <GridToolbarExport csvOptions={{ disableToolbarButton: true }} />
    </GridToolbarContainer>
  );
}
