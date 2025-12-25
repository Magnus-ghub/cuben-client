import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import { Box, Button, Pagination, Stack, Typography, IconButton } from "@mui/material";
import { NextPage } from "next";
import { useState } from "react";
import useDeviceDetect from "../../libs/hooks/useDeviceDetect";
import withLayoutMain from "../../libs/components/layout/LayoutHome";
import Filter from "../../libs/components/product/Filter";
import ProductCard from "../../libs/components/product/ProductCard";

const MarketplaceList: NextPage = () => {
  const device = useDeviceDetect();
  const [products, setProducts] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const [showFilter, setShowFilter] = useState(true);

  if (device === "mobile") {
    return <Stack>MARKETPLACE MOBILE</Stack>;
  } else {
    return (
      <div id="marketplace-page">
        <Stack className="container">
          {/* Header Section */}
          <Stack className="marketplace-header">
            <Stack className="header-left">
              <Typography className="page-title">Marketplace</Typography>
              <Typography className="page-subtitle">
                Discover great deals from fellow students
              </Typography>
            </Stack>
            <Stack className="header-right">
              <Button
                className="filter-toggle-btn"
                startIcon={<TuneRoundedIcon />}
                onClick={() => setShowFilter(!showFilter)}
              >
                {showFilter ? 'Hide Filters' : 'Show Filters'}
              </Button>
              <Stack className="sort-box">
                <Typography className="sort-label">Sort by</Typography>
                <Button 
                  className="sort-btn"
                  endIcon={<KeyboardArrowDownRoundedIcon />}
                >
                  New
                </Button>
              </Stack>
            </Stack>
          </Stack>

          {/* Main Content */}
          <Stack className="marketplace-content">
            {/* Filter Sidebar */}
            {showFilter && (
              <Stack className="filter-sidebar">
                <Filter />
              </Stack>
            )}

            {/* Products Grid */}
            <Stack className="products-container">
              <Stack className="products-grid">
                {products.map((product, index) => (
                  <ProductCard key={index} />
                ))}
              </Stack>

              {/* Pagination */}
              <Stack className="pagination-wrapper">
                <Stack className="pagination-info">
                  <Typography className="result-count">
                    Showing <strong>1-9</strong> of <strong>245</strong> products
                  </Typography>
                </Stack>
                <Stack className="pagination-controls">
                  <Pagination
                    page={1}
                    count={28}
                    shape="rounded"
                    color="primary"
                    size="large"
                  />
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </div>
    );
  }
};

export default withLayoutMain(MarketplaceList);