"use client"
import { Drawer, Box, Typography, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { useRouter, usePathname } from "next/navigation";
export default function SideDrawer() {
    const router = useRouter();
    const pathname = usePathname();
    return (<Drawer variant="permanent" sx={{ width: "240px", color: "white", "& .MuiDrawer-paper": { width: "250px", backgroundColor: "#6A1B9A" }, }}>
        <Box sx={{ px: 2, py: 2 }}>
            <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>Expense Tracker</Typography>
        </Box>
        <List sx={{ px: 2 }}>
            <ListItemButton selected={pathname == "/dashboard"} onClick={() => { router.push("/dashboard") }} sx={{
                borderRadius: 2, mb: 1, "&.Mui-selected": {
                    backgroundColor: "#7C3AED",
                }, "&:hover": { backgroundColor: "#8B5CF6", }
            }}>
                <ListItemIcon sx={{ color: "white" }}>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" sx={{ color: "white" }}></ListItemText>
            </ListItemButton >
            <ListItemButton selected={pathname == "/Income"} onClick={() => { router.push("/Income") }} sx={{
                borderRadius: 2, mb: 1, "&.Mui-selected": {
                    backgroundColor: "#7C3AED",
                }, "&:hover": { backgroundColor: "#8B5CF6", }
            }}>
                <ListItemIcon sx={{ color: "white" }}>
                    <AccountBalanceWalletIcon />
                </ListItemIcon>
                <ListItemText primary="Income" sx={{ color: "white" }}></ListItemText>
            </ListItemButton>
            <ListItemButton selected={pathname == "/Expense"} onClick={() => { router.push("/Expense") }} sx={{
                borderRadius: 2, mb: 1, "&.Mui-selected": {
                    backgroundColor: "#7C3AED",
                }, "&:hover": { backgroundColor: "#8B5CF6", }
            }}>
                <ListItemIcon sx={{ color: "white" }}>
                    <ReceiptLongIcon />
                </ListItemIcon>
                <ListItemText primary="Expense" sx={{ color: "white" }}></ListItemText>
            </ListItemButton>
        </List >
    </Drawer >)
}