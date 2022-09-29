import { DataGrid } from "@mui/x-data-grid";
import { frFR } from "@mui/x-data-grid/locales";
import { CustomToolbar } from "./";
import { Alert } from "@mui/material";

const Table = ({ columns, rows, error, onRowClick, margin }) => {
  return (
    <>
      {error && <Alert severity="error">{error}</Alert>}
      <div
        style={{
          height: 'calc(100vh - 200px)',
          width: "100%",
          marginTop: margin || "0px",
          marginBottom: margin || "0px",
        }}
      >
        <DataGrid
          onRowClick={onRowClick}
          rows={rows}
          columns={columns}
          pageSize={20}
          rowsPerPageOptions={[20]}
          localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
          components={{
            Toolbar: CustomToolbar,
          }}
        />
      </div>
    </>
  );
};

export default Table;
