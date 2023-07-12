import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";

import Button from "@mui/joy/Button";

function ArchivedFeeding({ Data }) {
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
      // editable: true,
    },
    {
      field: "size",
      headerName: "Size",
      type: "number",
      // align: "center",
      width: 120,
      // editable: true,
    },

    {
      field: "quantity",
      headerName: "Quantity",
      type: "number",
      // editable: true,
      // align: "center",
      width: 120,
      valueFormatter: ({ value }) => `${value} °C`,
    },

    {
      field: "fcr",
      headerName: "FCR",
      type: "number",
      // editable: true,
      // align: "center",
      width: 120,
    },
  ];

  return (
    <>
      <div style={{ height: "70vh" }}>
        <DataGrid
          rows={Data?.feeding ?? []}
          columns={columns}
          slots={{
            toolbar: EditToolbar,
          }}
        />
      </div>
    </>
  );
}

export default ArchivedFeeding;

function EditToolbar(props) {
  return (
    <GridToolbarContainer>
      <GridToolbarExport csvOptions={{ disableToolbarButton: true }} />
    </GridToolbarContainer>
  );
}
