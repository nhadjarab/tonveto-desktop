import { Typography, Box, Rating, Avatar } from "@mui/material";

const Review = ({ comment }) => {
  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center",mb:"10px" }}>
        <Avatar
          sx={{ width: 40, height: 40, backgroundColor: "#222f3e", mr: "10px" }}
        >
          {comment.owner.first_name[0]?.toUpperCase() || "?"}
        </Avatar>
        <Box>
          <Typography variant="body2">
            {comment.owner.first_name || comment.owner.last_name
              ? comment.owner.first_name.toUpperCase() +
                " " +
                comment.owner.last_name.toUpperCase()
              : comment.owner.email}
          </Typography>
          <Rating
            name="read-only"
            size="small"
            value={comment?.rating?.rating || 0}
            readOnly
            precision={0.1}
          />
        </Box>
      </Box>

      <Typography varinat="body2" color="text.secondary" paragraph>
        {comment.text}
      </Typography>
    </Box>
  );
};

export default Review;
