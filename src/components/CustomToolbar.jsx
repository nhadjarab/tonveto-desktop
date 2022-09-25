import { GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";

const CustomToolbar = () => {
  return (
    <div>
      <GridToolbarContainer>
        <GridToolbarExport variant="standard" sx={{ ml: "auto" }} />
      </GridToolbarContainer>
    </div>
  );
};

export default CustomToolbar;
