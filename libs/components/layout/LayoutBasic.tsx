import { Stack } from "@mui/material";
import Head from "next/head";
import Chat from "../Chat";

const withLayoutBasic = (Component: any) => {
    return (props: any) => {
        return(
         <>
            <Head>
                <title>Cuben</title>
            </Head>
            <Stack id={"pc-wrap"}>
                <Stack sx={{ background: "#81c784"}}>Header Basic</Stack>

                <Stack id={"main"}>
                    <Component {...props}/>
                </Stack>

                <Chat />

                <Stack sx={{ background: "#a1887F" }}>Footer</Stack>
            </Stack>
         </>
        );
        
    };
};

export default withLayoutBasic;