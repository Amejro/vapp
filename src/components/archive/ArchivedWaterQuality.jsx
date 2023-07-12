import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";

function ArchivedWaterQuality({ Data }) {
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
      // editable: true,
    },
    {
      field: "oxygen_level",
      headerName: "Oxygen Level",
      type: "number",
      align: "center",
      width: 120,
      // editable: true,
    },

    {
      field: "temparature",
      headerName: "Temparature",
      type: "number",
      // editable: true,
      align: "center",
      width: 120,
      valueFormatter: ({ value }) => `${value} °C`,
    },
  ];

  if (!Data) return;
  return (
    <>
      <div className="h-[70vh]">
        <DataGrid
          rows={Data?.waterQuality ?? []}
          columns={columns}
          slots={{
            toolbar: EditToolbar,
          }}
        />
      </div>
    </>
  );
}

export default ArchivedWaterQuality;

function EditToolbar() {
  // const { setwaterQLT, Archive } = props;

  return (
    <GridToolbarContainer>
      <GridToolbarExport csvOptions={{ disableToolbarButton: true }} />
    </GridToolbarContainer>
  );
}
