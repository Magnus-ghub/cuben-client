
import { Container } from "@mui/material";
import withLayoutMain from "../../libs/components/layout/LayoutHome";
import useDeviceDetect from "../../libs/hooks/useDeviceDetect";

const PropertyDetail = () => {
    const device = useDeviceDetect();

    if (device === "mobile") {
        return <Container>PROPERTY DETAIL MOBILE</Container>
    } else {
         return <Container>PROPERTY DETAIL</Container>
    } 
};

export default withLayoutMain(PropertyDetail);