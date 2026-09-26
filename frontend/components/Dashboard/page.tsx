"use client";
import { Box, Button, Typography, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import SavingsIcon from "@mui/icons-material/Savings";
import dayjs, { Dayjs } from 'dayjs';
import { useState, useEffect, useCallback } from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import axios from "axios";
import { useRouter } from "next/navigation";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Bar, Label } from "recharts";
import { API_BASE_URL } from "../../services/api";

interface CategoryExpenseItem {
    name: string;
    amount: number;
    color: string;
}

const DEFAULT_PALETTE = ["#7C3AED", "#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#EC4899", "#8B5CF6", "#06B6D4"];

export default function Page() {
    const router = useRouter();
    const [totalincome, setTotalIncome] = useState(0);
    const [totalexpense, setTotalExpense] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs());
    const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryExpenseItem[]>([]);
    const [activeweek, setactiveweek] = useState<"this" | "last">("this");
    const [thisWeekExpenses, setthisWeekExpenses] = useState<any[]>([]);

    const weeklyData = thisWeekExpenses;

    const formatCurrency = (amount: number) =>
        `₹${amount.toLocaleString("en-IN")}`;

    const fetchDashboard = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const [ExpenseResponse, IncomeResponse] = await Promise.all([
                axios.get(`${API_BASE_URL}/expense?month=${selectedMonth.format("YYYY-MM")}&category=true`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${API_BASE_URL}/income?month=${selectedMonth.format("YYYY-MM")}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            const totalInc = Number(IncomeResponse.data?.totalincome) || 0;
            const totalExp = Number(ExpenseResponse.data?.totalexpense) || 0;
            setTotalIncome(totalInc);
            setTotalExpense(totalExp);

            const rawBreakdown = ExpenseResponse.data?.categoryBreakdown || [];
            const mappedCategories: CategoryExpenseItem[] = rawBreakdown.map((item: any, idx: number) => ({
                name: item.name || "Uncategorized",
                amount: Number(item.total) || 0,
                color: item.color || DEFAULT_PALETTE[idx % DEFAULT_PALETTE.length]
            }));

            setCategoryBreakdown(mappedCategories);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, [selectedMonth]);

    const date = new Date().toISOString().split("T")[0];
    const lastWeek = new Date(date);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const currentDate =
        activeweek === "this"
            ? date
            : lastWeek.toISOString().split("T")[0];

    const fetchChart = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const WeeklyResponse = await axios.get(
                `${API_BASE_URL}/expense/weekly-trends?week=${currentDate}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setthisWeekExpenses(WeeklyResponse.data?.data || []);
        } catch (error) {
            console.log(error);
        }
    }, [currentDate]);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    useEffect(() => {
        fetchChart();
    }, [fetchChart]);

    const balanceamount = totalincome - totalexpense;
    return (
        <>
            <Box sx={{
                ml: { xs: 0, md: "250px" },
                p: { xs: 1.5, sm: 2, md: 2.5 },
                pb: { xs: 12, md: 2.5 },
                width: { xs: "100%", md: "calc(100% - 250px)" },
                height: { xs: "auto", md: "100vh" },
                maxHeight: { md: "100vh" },
                overflowY: { xs: "auto", md: "hidden" },
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: { xs: 2, md: 1.5 },
            }}>
                {/* Header */}
                <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: { xs: 1.5, sm: 2 },
                    flexShrink: 0,
                }}>
                    <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: { xs: "20px", sm: "22px", md: "24px" } }}>Welcome</Typography>
                        <Typography sx={{ fontSize: { xs: "12px", sm: "13px" }, color: "text.secondary" }}>Here's your financial overview for this month</Typography>
                    </Box>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker label="Select Month" views={["year", "month"]} format="MMM YYYY" value={selectedMonth} onChange={(newval) => {
                            if (newval) {
                                setSelectedMonth(newval)
                            }
                        }} slotProps={{
                            textField: {
                                size: "small",
                                sx: {
                                    width: { xs: "100%", sm: 180, md: 200 },

                                    "& .MuiInputBase-root": {
                                        height: 38,
                                        fontSize: 13,
                                    },

                                    "& .MuiInputLabel-root": {
                                        fontSize: 13,
                                    },

                                    "& .MuiSvgIcon-root": {
                                        fontSize: 20,
                                    },
                                },
                            },
                        }}></DatePicker>
                    </LocalizationProvider>
                </Box>

                {/* Total cards */}
                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(3, 1fr)",
                    },
                    gap: { xs: 1.5, md: 1.5 },
                    width: "100%",
                    flexShrink: 0,
                }}>
                    {/* Total Income */}
                    <Box sx={{
                        borderRadius: 2,
                        p: { xs: 1.5, md: 1.5 },
                        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                        minHeight: { xs: 95, md: 85 },
                        width: "100%",
                        borderLeft: "5px solid #10B981",
                        backgroundColor: "#F0FDF4",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        "&:hover": {
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                        }
                    }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography sx={{ fontSize: { xs: 12, md: 13 }, fontWeight: 600, color: "#166534" }}>Total Income</Typography>
                            <Box sx={{ p: 0.5, borderRadius: "50%", bgcolor: "#DCFCE7", color: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <ArrowUpwardIcon sx={{ fontSize: 16 }} />
                            </Box>
                        </Box>
                        <Typography sx={{ fontWeight: 700, fontSize: { xs: 18, sm: 20, md: 22 }, color: "#14532D", my: 0.25 }}>
                            {formatCurrency(totalincome)}
                        </Typography>
                        <Typography sx={{ color: "grey.600", fontWeight: 500, fontSize: "11px" }}>
                            {selectedMonth.format("MMMM YYYY")}
                        </Typography>
                    </Box>

                    {/* Total Expense */}
                    <Box sx={{
                        borderRadius: 2,
                        p: { xs: 1.5, md: 1.5 },
                        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                        minHeight: { xs: 95, md: 85 },
                        width: "100%",
                        borderLeft: "5px solid #EF4444",
                        backgroundColor: "#FEF2F2",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        "&:hover": {
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                        }
                    }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography sx={{ fontSize: { xs: 12, md: 13 }, fontWeight: 600, color: "#991B1B" }}>Total Expense</Typography>
                            <Box sx={{ p: 0.5, borderRadius: "50%", bgcolor: "#FEE2E2", color: "#EF4444", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <ArrowDownwardIcon sx={{ fontSize: 16 }} />
                            </Box>
                        </Box>
                        <Typography sx={{ fontWeight: 700, fontSize: { xs: 18, sm: 20, md: 22 }, color: "#7F1D1D", my: 0.25 }}>
                            {formatCurrency(totalexpense)}
                        </Typography>
                        <Typography sx={{ color: "grey.600", fontWeight: 500, fontSize: "11px" }}>
                            {selectedMonth.format("MMMM YYYY")}
                        </Typography>
                    </Box>

                    {/* Balance */}
                    <Box sx={{
                        borderRadius: 2,
                        p: { xs: 1.5, md: 1.5 },
                        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                        minHeight: { xs: 95, md: 85 },
                        width: "100%",
                        borderLeft: "5px solid #7C3AED",
                        backgroundColor: "#F5F3FF",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gridColumn: { xs: "auto", sm: "span 2", md: "auto" },
                        transition: "transform 0.2s, box-shadow 0.2s",
                        "&:hover": {
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                        }
                    }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography sx={{ fontSize: { xs: 12, md: 13 }, fontWeight: 600, color: "#5B21B6" }}>Net Balance</Typography>
                            <Box sx={{ p: 0.5, borderRadius: "50%", bgcolor: "#EDE9FE", color: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <SavingsIcon sx={{ fontSize: 16 }} />
                            </Box>
                        </Box>
                        <Typography sx={{
                            fontWeight: 700,
                            fontSize: { xs: 18, sm: 20, md: 22 },
                            color: balanceamount >= 0 ? "#4C1D95" : "#DC2626",
                            my: 0.25
                        }}>
                            {formatCurrency(balanceamount)}
                        </Typography>
                        <Typography sx={{ color: "grey.600", fontWeight: 500, fontSize: "11px" }}>
                            {selectedMonth.format("MMMM YYYY")}
                        </Typography>
                    </Box>
                </Box>

                {/* Middle section: Category Chart & Quick Actions */}
                <Box sx={{
                    display: "flex",
                    flexDirection: { xs: "column", lg: "row" },
                    gap: 1.5,
                    alignItems: "stretch",
                    flexShrink: 0,
                }}>
                    {/* Spending by Category Chart */}
                    <Box sx={{
                        borderRadius: 2,
                        backgroundColor: "white",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                        flex: { xs: "1 1 100%", lg: 1.4 },
                        width: "100%",
                        p: { xs: 1.5, md: 1.5 },
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}>
                        <Typography sx={{ fontWeight: 600, fontSize: { xs: "0.9rem", sm: "0.95rem" }, mb: 0.5 }}>Spending by Category</Typography>

                        {categoryBreakdown.length === 0 ? (
                            <Box sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                minHeight: 145,
                                my: "auto",
                                py: 2,
                                textAlign: "center",
                            }}>
                                <Typography sx={{ fontSize: "0.85rem", color: "text.secondary", fontWeight: 500 }}>
                                    No category expenses recorded for {selectedMonth.format("MMM YYYY")}
                                </Typography>
                            </Box>
                        ) : (
                            <Box sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: { xs: "space-between", md: "flex-start" },
                                gap: { xs: 2, sm: 3, md: 5 },
                                my: "auto",
                                py: 0.5,
                            }}>
                                {/* Donut Chart with centered total */}
                                <Box sx={{ width: { xs: 135, sm: 145 }, height: { xs: 135, sm: 145 }, position: "relative", flexShrink: 0 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={categoryBreakdown}
                                                dataKey="amount"
                                                nameKey="name"
                                                innerRadius={40}
                                                outerRadius={62}
                                                cx="50%"
                                                cy="50%"
                                                paddingAngle={3}
                                                stroke="none"
                                            >
                                                {categoryBreakdown.map((item) => (
                                                    <Cell key={item.name} fill={item.color} />
                                                ))}
                                                <Label
                                                    value={`₹${totalexpense.toLocaleString("en-IN")}`}
                                                    position="center"
                                                    style={{
                                                        fontSize: "12px",
                                                        fontWeight: 700,
                                                        fill: "#1f2937",
                                                    }}
                                                />
                                            </Pie>
                                            <Tooltip
                                                formatter={(value) => formatCurrency(Number(value))}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Box>

                                {/* Legend List */}
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1,
                                    flex: { xs: 1, md: "0 1 240px" },
                                    width: { xs: "100%", md: "240px" },
                                    minWidth: 0,
                                    justifyContent: "center",
                                }}>
                                    {categoryBreakdown.map((item) => {
                                        const percentage =
                                            totalexpense > 0
                                                ? (item.amount / totalexpense) * 100
                                                : 0;

                                        return (
                                            <Box
                                                key={item.name}
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    gap: 1.5,
                                                }}
                                            >
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
                                                    <Box
                                                        sx={{
                                                            width: 8,
                                                            height: 8,
                                                            borderRadius: "50%",
                                                            bgcolor: item.color,
                                                            flexShrink: 0,
                                                        }}
                                                    />

                                                    <Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.82rem" }, fontWeight: 500, color: "#374151" }}>
                                                        {item.name}
                                                    </Typography>
                                                </Box>

                                                <Typography sx={{ fontSize: { xs: "0.72rem", sm: "0.8rem" }, fontWeight: 600, color: "#6B7280" }}>
                                                    {percentage.toFixed(1)}%
                                                </Typography>
                                            </Box>
                                        );
                                    })}
                                </Box>
                            </Box>
                        )}
                    </Box>

                    {/* Quick actions */}
                    <Box sx={{
                        display: { xs: "none", md: "flex" },
                        flexDirection: "column",
                        justifyContent: "space-between",
                        borderRadius: 2,
                        backgroundColor: "white",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                        flex: { xs: "1 1 100%", lg: 0.8 },
                        width: "100%",
                        p: { xs: 1.5, md: 1.5 }
                    }}>
                        <Typography sx={{ fontWeight: 600, fontSize: { xs: "0.9rem", sm: "0.95rem" } }}>Quick Actions</Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, my: "auto", py: 0.5 }}>
                            <Button variant="contained"
                                fullWidth startIcon={<ArrowUpwardIcon fontSize="small" />}
                                onClick={() => router.push("/addIncome")}
                                sx={{
                                    height: 42,
                                    justifyContent: "flex-start",
                                    px: 2,
                                    borderRadius: 2,
                                    borderColor: "#D1FAE5",
                                    backgroundColor: "#F0FDF4",
                                    color: "#15803D",
                                    fontSize: 14,
                                    fontWeight: 600,
                                    textTransform: "none",

                                    "&:hover": {
                                        backgroundColor: "#DCFCE7",
                                        borderColor: "#86EFAC",
                                    },
                                }}>Add Income</Button>
                            <Button variant="contained"
                                fullWidth startIcon={<ArrowDownwardIcon fontSize="small" />}
                                onClick={() => router.push("/addExpense")}
                                sx={{
                                    height: 42,
                                    justifyContent: "flex-start",
                                    px: 2,
                                    borderRadius: 2,
                                    borderColor: "#DDD6FE",
                                    backgroundColor: "#F5F3FF",
                                    color: "#7C3AED",
                                    fontSize: 14,
                                    fontWeight: 600,
                                    textTransform: "none",

                                    "&:hover": {
                                        backgroundColor: "#EDE9FE",
                                        borderColor: "#C4B5FD",
                                    },
                                }}>Add Expense</Button>
                        </Box>
                    </Box>
                </Box>

                {/* Weekly Expense Trends */}
                <Box sx={{
                    borderRadius: 2,
                    backgroundColor: "white",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                    width: "100%",
                    p: { xs: 1.5, md: 1.5 },
                    flex: { md: "1 1 auto" },
                    minHeight: { md: 140 },
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 1,
                        mb: 0.5,
                        flexShrink: 0,
                    }}>
                        <Typography sx={{ fontWeight: 600, fontSize: { xs: "0.9rem", sm: "0.95rem" } }}>
                            Weekly Expense Trend
                        </Typography>

                        <ToggleButtonGroup
                            value={activeweek}
                            exclusive
                            size="small"
                            onChange={(e, val) => {
                                if (val) setactiveweek(val);
                            }}
                            sx={{
                                height: 28,
                                "& .MuiToggleButton-root": {
                                    px: { xs: 1, sm: 1.25 },
                                    py: 0.25,
                                    fontSize: { xs: "0.72rem", sm: "0.75rem" },
                                    textTransform: "none",
                                    fontWeight: 500,
                                }
                            }}
                        >
                            <ToggleButton value="this">This week</ToggleButton>
                            <ToggleButton value="last">Last week</ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    {/* Bar Chart */}
                    <Box sx={{ width: "100%", height: { xs: 200, sm: 220, md: "calc(100% - 32px)" }, minHeight: { md: 110 } }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyData} margin={{ top: 8, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="day" tickLine={false} tick={{ fontSize: 11 }} />
                                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                                <Tooltip
                                    formatter={(value) => `₹${Number(value).toLocaleString("en-IN")}`}
                                />
                                <Bar
                                    dataKey="expense"
                                    fill="#7C3AED"
                                    radius={[5, 5, 0, 0]}
                                    maxBarSize={36}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </Box>
            </Box>
        </>)
}