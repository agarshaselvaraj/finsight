import Income from "@/components/Income/Income";
import MobileDrawer from "@/components/layout/MobileDrawer";
import SideDrawer from "@/components/layout/SideDrawer";
import { Box } from "@mui/material";

export default function IncomePage() {
    return (
        <>
            <Box sx={{ display: { xs: "block", md: "none" } }}>
                <MobileDrawer />
            </Box>
            <Box sx={{ display: { xs: "none", md: "block" } }}>
                <SideDrawer />
            </Box>

            <Income />
        </>
    )
}