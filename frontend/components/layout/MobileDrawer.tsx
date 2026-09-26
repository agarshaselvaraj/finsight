"use client"
import { BottomNavigationAction, BottomNavigation, Paper } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { useRouter, usePathname } from "next/navigation";
export default function MobileDrawer() {
    const router = useRouter();
    const pathname = usePathname();

    const currentTab = pathname === "/Income" || pathname === "/Expense" ? pathname : "/dashboard";

    return (
        <Paper
            sx={{
                bottom: 0,
                left: 0,
                right: 0,
                position: "fixed",
                backgroundColor: "#6A1B9A",
                zIndex: 1400,
                display: { xs: "block", md: "none" },
            }}
            elevation={8}
        >
            <BottomNavigation
                showLabels
                value={currentTab}
                onChange={(event, newValue) => {
                    if (newValue) {
                        router.push(newValue);
                    }
                }}
                sx={{
                    backgroundColor: "#6A1B9A",
                    height: 60,
                    "& .MuiBottomNavigationAction-root": {
                        color: "rgba(255, 255, 255, 0.65)",
                        minWidth: "auto",
                        padding: "6px 2px",
                        "& .MuiBottomNavigationAction-label": {
                            fontSize: "0.68rem",
                            transition: "none",
                            "&.Mui-selected": {
                                fontSize: "0.72rem",
                                fontWeight: 600,
                            },
                        },
                        "&.Mui-selected": {
                            color: "#FFFFFF",
                        },
                    },
                }}
            >
                <BottomNavigationAction
                    label="Home"
                    value="/dashboard"
                    icon={<DashboardIcon />}
                />
                <BottomNavigationAction
                    label="Income"
                    value="/Income"
                    icon={<AccountBalanceWalletIcon />}
                />
                <BottomNavigationAction
                    label="Expense"
                    value="/Expense"
                    icon={<ReceiptLongIcon />}
                />
            </BottomNavigation>
        </Paper>
    );
}