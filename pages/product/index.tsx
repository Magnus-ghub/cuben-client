import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { Box, Button, Pagination, Stack, Typography } from "@mui/material";
import { NextPage } from "next";
import { useState } from "react";
import useDeviceDetect from "../../libs/hooks/useDeviceDetect";
import Filter from "../../libs/components/product/Filter";
import ProductCard from "../../libs/components/product/ProductCard";
import withLayoutMain from "../../libs/components/layout/LayoutHome";

const PropertyList: NextPage = () => {
  const device = useDeviceDetect();
  const [properties, setProperties] = useState<number[]>([1, 2, 3, 4, 5, 6]);

  if (device === "mobile") {
    return <Stack>PROPERTYLIST MOBILE</Stack>;
  } else {
    return (
      <div id={"property-list-page"} style={{ position: "relative" }}>
        <Stack className="container">
          <Box className={"right"}>
            <span>Sorty by</span>
            <div>
              <Button endIcon={<KeyboardArrowDownRoundedIcon />}>New</Button>
            </div>
          </Box>
          <Stack className={"property-page"}>
            <Stack className={"filter-config"}>
              <Filter />
            </Stack>
            <Stack className={"main-config"} mb={"76px"}>
              <Stack className={"list-config"}>
                {properties.map((property, index) => {
                  return <ProductCard key={index} />;
                })}
              </Stack>
              <Stack className={"pagination-config"}>
                <Stack className="pagination-box">
                  <Pagination
                    page={1}
                    count={5}
                    shape="circular"
                    color="primary"
                  />
                </Stack>
                <Stack className="total-result">
                  <Typography>Total 5 properties aviable</Typography>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </div>
    );
  }
};

export default withLayoutMain(PropertyList);
