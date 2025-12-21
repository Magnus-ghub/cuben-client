import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { Box, Button, Pagination, Stack, Typography } from "@mui/material";
import { NextPage } from "next";
import { useState } from "react";
import useDeviceDetect from "../../libs/hooks/useDeviceDetect";
import withLayoutMain from "../../libs/components/layout/LayoutHome";
import Filter from "../../libs/components/product/Filter";
import ProductCard from "../../libs/components/product/ProductCard";

const MarketplaceList: NextPage = () => {
  const device = useDeviceDetect();
  const [products, setProducts] = useState<number[]>([1, 2, 3, 4, 5, 6]);

  if (device === "mobile") {
    return <Stack>MARKETPLACE MOBILE</Stack>;
  } else {
    return (
      <div id="marketplace-main">
        <div id="main-section">
          <div id="marketplace-page" style={{ position: "relative" }}>
            <Stack className="container">
              <Box className="right">
                <span>Sort by</span>
                <div>
                  <Button endIcon={<KeyboardArrowDownRoundedIcon />}>New</Button>
                </div>
              </Box>
              <Stack className="marketplace-page">
                <Stack className="filter-config">
                  <Filter />
                </Stack>
                <Stack className="main-config" mb="76px">
                  <Stack className="list-config">
                    {products.map((product, index) => {
                      return <ProductCard key={index} />;
                    })}
                  </Stack>
                  <Stack className="pagination-config">
                    <Stack className="pagination-box">
                      <Pagination
                        page={1}
                        count={5}
                        shape="circular"
                        color="primary"
                      />
                    </Stack>
                    <Stack className="total-result">
                      <Typography>Total 6 products available</Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </div>
        </div>
      </div>
    );
  }
};

export default withLayoutMain(MarketplaceList);