import SideDrawer from "@/components/layout/SideDrawer";
import MobileDrawer from "@/components/layout/MobileDrawer";
import { Box } from "@mui/material"
import Page from "@/components/Dashboard/page";
export default function dashboard() {
    return (
        <>
            <Box sx={{ display: { xs: "block", md: "none" } }}>
                <MobileDrawer />
            </Box>
            <Box sx={{ display: { xs: "none", md: "block" } }}>
                <SideDrawer />
            </Box>
            <Page />
        </>
    )

}