import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";

function ArchivedSorting({ Data }) {
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
    },
    {
      field: "pondNumber",
      headerName: "Pond Number",
      type: "number",
      align: "center",
      width: 120,
    },

    {
      field: "role",
      headerName: "To",

      // editable: true,
      type: "singleSelect",
      valueOptions: ["PondA", "PondB", "PondC"],
    },
  ];

  return (
    <>
      <div style={{ height: "70vh" }}>
        <DataGrid
          rows={Data?.sorting ?? []}
          columns={columns}
          slots={{
            toolbar: EditToolbar,
          }}
        />
      </div>
    </>
  );
}

export default ArchivedSorting;

function EditToolbar(props) {
  return (
    <GridToolbarContainer>
      <GridToolbarExport csvOptions={{ disableToolbarButton: true }} />
    </GridToolbarContainer>
  );
}
