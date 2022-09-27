import { GridToolbarContainer, GridToolbarExport,GridToolbar } from "@mui/x-data-grid";

const CustomToolbar = () => {
  return (
    <div>
      {/* <GridToolbarContainer>
        <GridToolbarExport variant="standard" sx={{ ml: "auto" }} />
      </GridToolbarContainer> */}
      <GridToolbar/>
    </div>
  );
};

export default CustomToolbar;
