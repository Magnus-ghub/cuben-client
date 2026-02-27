import { Stack, Box } from "@mui/material";
import Head from "next/head";
import { PublicFooter, PublicHeader } from "../common/UnivoLogo";

const withLayoutPublic = (Component: any) => {
	return (props: any) => {
		return (
			<>
				<Head>
					<title>Univo | Smart Campus Companion</title>
				</Head>
				<Stack
					id="public-wrap"
					sx={{
						minHeight: "100vh",
						bgcolor: "#fff",
						display: "flex",
						flexDirection: "column",
					}}
				>
					<PublicHeader />
					<Box component="main" sx={{ flex: 1 }}>
						<Component {...props} />
					</Box>
					<PublicFooter />
				</Stack>
			</>
		);
	};
};

export default withLayoutPublic;