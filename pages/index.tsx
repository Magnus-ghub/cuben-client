import { Box, Container, Stack } from "@mui/material";
import { green } from "@mui/material/colors";




export default function Home() {
  return (
    <>
    <Stack sx={{ background: green[300] }}>Header</Stack>
    <Container>
      <Stack flexDirection={"column"}>
        <Box>Popular product</Box>
        <Box>Top Agents</Box>
        <Box>Events</Box>
      </Stack>
    </Container>
    </>
  );
}
