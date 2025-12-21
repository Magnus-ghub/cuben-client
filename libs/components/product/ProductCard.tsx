import React from "react";
import { Stack, Typography, Box, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Link from "next/link";

const ProductCard = () => {
  const imagePath: string = "/img/product/macbookpro.jpeg";
  
  return (
    <Stack className="card-config">
      <Stack className="top">
        <Link
          href={{
            pathname: "/marketplace/detail",
            query: { id: "product123" },
          }}
        >
          <img src={imagePath} alt="Product" />
        </Link>
        <Box className="top-badge">
          <img src="/img/icons/star.svg" alt="" />
          <Typography>Featured</Typography>
        </Box>
        <Box className="condition-badge">
          <Typography>Like New</Typography>
        </Box>
        <Box className="price-box">
          <Typography>₩45,000</Typography>
        </Box>
      </Stack>
      <Stack className="bottom">
        <Stack className="name-address">
          <Stack className="name">
            <Link
              href={{
                pathname: "/marketplace/detail",
                query: { id: "product123" }
              }}
            >
              <Typography>Calculus Textbook Bundle</Typography>
            </Link>
          </Stack>
          <Stack className="address">
            <Typography>Library, Campus</Typography>
          </Stack>
        </Stack>
        <Stack className="category-type">
          <Stack className="category-badge">
            <Typography>Book</Typography>
          </Stack>
          <Stack className="seller-info">
            <img src="/img/icons/user.svg" alt="" />
            <Typography>John Doe</Typography>
          </Stack>
        </Stack>
        <Stack className="type-buttons">
          <Stack className="status">
            <Typography>Available</Typography>
          </Stack>
          <Stack className="buttons">
            <IconButton color="default" size="small">
              <RemoveRedEyeIcon />
            </IconButton>
            <Typography className="view-cnt">245</Typography>
            <IconButton color="default" size="small">
              <FavoriteIcon sx={{ color: '#ef4444' }} />
            </IconButton>
            <Typography className="view-cnt">12</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ProductCard;