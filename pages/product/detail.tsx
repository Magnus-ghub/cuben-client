import { Container, Stack, Box, Typography, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ShareIcon from "@mui/icons-material/Share";
import withLayoutMain from "../../libs/components/layout/LayoutHome";
import useDeviceDetect from "../../libs/hooks/useDeviceDetect";

const MarketplaceDetail = () => {
    const device = useDeviceDetect();

    if (device === "mobile") {
        return <Container>MARKETPLACE DETAIL MOBILE</Container>
    } else {
        return (
            <div id="marketplace-detail-page">
                <Container className="product-detail-config">
                    <Stack className="product-info-config">
                        {/* Product Info Section */}
                        <Stack className="info">
                            <Stack className="left-box">
                                <Typography className="title-main">
                                    Calculus Textbook Bundle
                                </Typography>
                                <Stack className="top-box">
                                    <Typography className="location">
                                        Library, Main Campus
                                    </Typography>
                                    <div className="divider"></div>
                                    <Stack className="category-box">
                                        <Typography className="category">BOOK</Typography>
                                    </Stack>
                                    <Stack className="condition-box">
                                        <Typography className="condition">LIKE NEW</Typography>
                                    </Stack>
                                    <div className="divider"></div>
                                    <Typography className="date">2 days ago</Typography>
                                </Stack>
                                <Stack className="bottom-box">
                                    <Stack className="option">
                                        <img src="/img/icons/user.svg" alt="" />
                                        <Typography>John Doe</Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                            <Stack className="right-box">
                                <Stack className="buttons">
                                    <Stack className="button-box">
                                        <IconButton>
                                            <RemoveRedEyeIcon />
                                        </IconButton>
                                        <Typography>245</Typography>
                                    </Stack>
                                    <Stack className="button-box">
                                        <IconButton>
                                            <FavoriteIcon color="primary" />
                                        </IconButton>
                                        <Typography>12</Typography>
                                    </Stack>
                                    <IconButton>
                                        <ShareIcon />
                                    </IconButton>
                                </Stack>
                                <Stack className="status-badge">
                                    <span>AVAILABLE</span>
                                </Stack>
                                <Typography>₩45,000</Typography>
                            </Stack>
                        </Stack>

                        {/* Images Section */}
                        <Stack className="images">
                            <Stack className="main-image">
                                <img src="/img/banner/header1.svg" alt="" />
                            </Stack>
                            <Stack className="sub-images">
                                <Stack className="sub-img-box">
                                    <img src="/img/product/macbookpro.jpeg" alt="" />
                                </Stack>
                                <Stack className="sub-img-box">
                                    <img src="/img/product/macbookpro.jpeg" alt="" />
                                </Stack>
                                <Stack className="sub-img-box">
                                    <img src="/img/product/macbookpro.jpeg" alt="" />
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>

                    {/* Product Description Section */}
                    <Stack className="product-desc-config">
                        <Stack className="left-config">
                            {/* Description */}
                            <Stack className="prod-desc-config">
                                <Stack className="top">
                                    <Typography className="title">Description</Typography>
                                    <Typography className="desc">
                                        Complete Calculus textbook bundle including main textbook, 
                                        solution manual, and practice workbook. All books are in 
                                        excellent condition with minimal highlighting. Perfect for 
                                        students taking MATH 201 or MATH 301.
                                    </Typography>
                                </Stack>
                                <Stack className="bottom">
                                    <Typography className="title">Product Details</Typography>
                                    <Stack className="info-box">
                                        <Stack className="left">
                                            <Stack className="info">
                                                <Typography className="title">Category:</Typography>
                                                <Typography className="data">BOOK</Typography>
                                            </Stack>
                                            <Stack className="info">
                                                <Typography className="title">Condition:</Typography>
                                                <Typography className="data">Like New</Typography>
                                            </Stack>
                                            <Stack className="info">
                                                <Typography className="title">Type:</Typography>
                                                <Typography className="data">Educational</Typography>
                                            </Stack>
                                        </Stack>
                                        <Stack className="right">
                                            <Stack className="info">
                                                <Typography className="title">Location:</Typography>
                                                <Typography className="data">Library</Typography>
                                            </Stack>
                                            <Stack className="info">
                                                <Typography className="title">Status:</Typography>
                                                <Typography className="data">Available</Typography>
                                            </Stack>
                                            <Stack className="info">
                                                <Typography className="title">Views:</Typography>
                                                <Typography className="data">245</Typography>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Stack>

                            {/* Meetup Location */}
                            <Stack className="meetup-config">
                                <Typography className="title">Meetup Location</Typography>
                                <Stack className="meetup-info">
                                    <Stack className="meetup-item">
                                        <img src="/img/icons/location.svg" alt="" />
                                        <Typography>Main Library, 2nd Floor</Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>

                        {/* Seller Contact Section */}
                        <Stack className="right-config">
                            <Stack className="info-box">
                                <Typography className="main-title">Contact Seller</Typography>
                                <Stack className="image-info">
                                    <img src="/img/user/default.png" alt="" />
                                    <Stack className="name-phone-listings">
                                        <Typography className="name">John Doe</Typography>
                                        <Typography className="username">@johndoe</Typography>
                                        <Typography className="listings">View 5 listings</Typography>
                                    </Stack>
                                </Stack>
                                <Typography className="sub-title">Your Name</Typography>
                                <input type="text" placeholder="Enter your name" />
                                <Typography className="sub-title">Message</Typography>
                                <textarea placeholder="Hi, I'm interested in this item..."></textarea>
                                <button className="send-message">
                                    <Typography className="title">Send Message</Typography>
                                </button>
                            </Stack>
                        </Stack>
                    </Stack>
                </Container>
            </div>
        );
    } 
};

export default withLayoutMain(MarketplaceDetail);