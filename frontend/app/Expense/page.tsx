import Expense from "@/components/Expense/Expense";
import MobileDrawer from "@/components/layout/MobileDrawer";
import SideDrawer from "@/components/layout/SideDrawer";
import { Box } from "@mui/material";

export default function ExpensePage() {
    return (
        <>
            <Box sx={{ display: { xs: "block", md: "none" } }}>
                <MobileDrawer />
            </Box>
            <Box sx={{ display: { xs: "none", md: "block" } }}>
                <SideDrawer />
            </Box>

            <Expense />
        </>
    )
}