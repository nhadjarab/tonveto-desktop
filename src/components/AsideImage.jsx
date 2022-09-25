import bg from "../assets/bg.svg";
import { Box } from "@mui/material";

const AsideImage = () => {
  return (
    <Box
      component="img"
      src={bg}
      alt="welcome image"
      sx={{ height: "100%", width: "100%", objectFit: "contain" }}
    />
  );
};

export default AsideImage;
