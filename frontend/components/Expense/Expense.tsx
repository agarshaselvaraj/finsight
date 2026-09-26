"use client"
import { useState, useEffect } from "react"
import ExpenseForm from "./AddExpense"
import { Button, Box, Typography } from '@mui/material';
import { useRouter } from "next/navigation";
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { DateTimePicker } from "@mui/x-date-pickers";
import { AccountBalanceWallet } from "@mui/icons-material";
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, IconButton, FormControl, MenuItem } from "@mui/material";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, InputLabel, Select } from "@mui/material";
import AppSnackbar from "../common/AppSnackbar";
import SavingsIcon from "@mui/icons-material/Savings";
import { API_BASE_URL } from "../../services/api";
interface Category {
    _id: string;
    name: string;
    color?: string;
    isSystem?: boolean;
    isActive?: boolean;
}

export default function Expense() {
    const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs())
    const router = useRouter();

    const [totalincome, setTotalIncome] = useState(0);
    const [totalexpense, setTotalExpense] = useState(0);
    const [loading, setLoading] = useState(true);
    const [expensedata, setExpenseData] = useState<any[]>([])
    const [deleteid, setDeleteId] = useState<string | null>(null);
    const [opendeletedialog, setopendeletedialog] = useState(false);
    const [editid, setEditId] = useState<string | null>(null);
    const [openeditdialog, setopeneditdialog] = useState(false);
    const [editamount, setEditAmount] = useState('');
    const [editpaymentMethod, seteditpaymentMethod] = useState('');
    const [editCategory, setEditCategory] = useState('')
    const [editDescription, setEditDescription] = useState("");
    const [editExpenseDate, setEditExpenseDate] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(totalRecords / limit);

    const [categories, setCategories] = useState<Category[]>([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" as "success" | "error" | "warning" | "info" });
    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    }
    const fetchExpense = async () => {
        try {


            const token = localStorage.getItem("token");
            const [ExpenseResponse, IncomeResponse] = await Promise.all([
                axios.get(`${API_BASE_URL}/expense?month=${selectedMonth.format("YYYY-MM")}&skip=${skip}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_BASE_URL}/income?month=${selectedMonth.format("YYYY-MM")}`, { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setTotalIncome(IncomeResponse.data?.totalincome || 0);
            setTotalExpense(ExpenseResponse.data?.totalexpense || 0);
            setExpenseData(ExpenseResponse.data?.data || []);
            setTotalRecords(ExpenseResponse.data?.totalRecords || 0);


        }
        catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchExpense();
    }, [selectedMonth, page]);
    useEffect(() => {
        getcategory();
    }, [])
    const getcategory = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_BASE_URL}/category`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = Array.isArray(response.data?.data)
                ? response.data.data
                : Array.isArray(response.data)
                    ? response.data
                    : [];
            setCategories(data);
        }
        catch (error) {
            console.log(error);
        }
    }
    const handleEdit = async (_id: string) => {
        try {
            const token = localStorage.getItem("token");
            const data = await axios.put(
                `${API_BASE_URL}/expense/${_id}`,
                {
                    amount: Number(editamount),
                    category: editCategory,
                    description: editDescription,
                    date: editExpenseDate,
                    paymentMethod: editpaymentMethod
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setopeneditdialog(false);
            setEditId(null);
            setSnackbar({ open: true, message: data.data?.message || "Expense updated successfully!", severity: "success" });
            await fetchExpense();
        }
        catch (error) {
            setSnackbar({
                open: true,
                message: "Failed to update expense",
                severity: "error",
            });
        }
    }
    const handleDelete = async (_id: string) => {
        try {
            const token = localStorage.getItem("token");
            const data = await axios.delete(`${API_BASE_URL}/expense/${_id}`, { headers: { Authorization: `Bearer ${token}` } });
            setopendeletedialog(false);
            setDeleteId(null);
            setSnackbar({ open: true, message: data.data?.message || "Expense deleted successfully!", severity: "success" });
            await fetchExpense();
        }
        catch (error) {
            setSnackbar({
                open: true,
                message: "Failed to delete expense",
                severity: "error",
            });
        }
    }
    const balanceamount = totalincome - totalexpense;
    return (
        <>
            <Box sx={{
                p: { xs: 1.5, sm: 2, md: 3 },
                ml: { xs: 0, md: "250px" },
                pb: { xs: 12, md: 4 },
            }}>
                <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 2, sm: 2 },
                    mb: 3
                }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, fontSize: { xs: "24px", md: "30px" } }}>Expense</Typography>
                    <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", width: { xs: "100%", sm: "auto" }, justifyContent: { xs: "space-between", sm: "flex-end" } }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Select Month"
                                views={["year", "month"]}
                                format="MMM YYYY"
                                value={selectedMonth}
                                onChange={(newval) => {
                                    if (newval) {
                                        setSelectedMonth(newval);
                                        setPage(1);
                                    }
                                }}
                                slotProps={{
                                    textField: {
                                        size: "small",
                                        sx: {
                                            width: { xs: 155, sm: 180, md: 200 },
                                            "& .MuiInputBase-root": {
                                                height: 38,
                                                fontSize: { xs: 13, sm: 14 },
                                            },
                                            "& .MuiInputLabel-root": {
                                                fontSize: { xs: 13, sm: 14 },
                                            },
                                            "& .MuiSvgIcon-root": {
                                                fontSize: 20,
                                            },
                                        }
                                    }
                                }}
                            />
                        </LocalizationProvider>

                        <Button onClick={() => router.push("/addExpense")} sx={{
                            borderRadius: 2, px: { xs: 1.5, sm: 2 },
                            py: 1,
                            backgroundColor: "#7C3AED",
                            color: "white",
                            fontSize: { xs: "0.8rem", sm: "0.875rem" },
                            whiteSpace: "nowrap",
                            "&:hover": {
                                backgroundColor: "#6D28D9",
                            },
                        }}>+ Add Expense</Button>
                    </Box>
                </Box>

                {/* Total Expense cards */}
                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                    gap: { xs: 1.5, sm: 2 },
                    width: "100%",
                }}>
                    <Box sx={{
                        borderRadius: 2,
                        backgroundColor: "#FEF2F2",
                        p: { xs: 2, sm: 2.5 },
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        minHeight: { xs: 110, md: 130 },
                        width: "100%",
                        borderLeft: "6px solid #EF4444",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography sx={{ fontSize: { xs: 13, sm: 15, md: 16 }, fontWeight: 600, color: "#991B1B" }}>Total Expense</Typography>
                            <Box sx={{ p: 0.75, borderRadius: "50%", bgcolor: "#FEE2E2", color: "#EF4444", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <AccountBalanceWallet sx={{ fontSize: { xs: 18, md: 22 } }} />
                            </Box>
                        </Box>
                        <Typography sx={{ fontWeight: 700, fontSize: { xs: 20, sm: 24, md: 28 }, color: "#7F1D1D", my: 0.5 }}>
                            ₹{totalexpense.toLocaleString("en-IN")}
                        </Typography>
                        <Typography sx={{ color: "grey.600", fontWeight: 500, fontSize: { xs: 11, sm: 12, md: 13 } }}>
                            {selectedMonth.format("MMMM YYYY")}
                        </Typography>
                    </Box>

                    <Box sx={{
                        borderRadius: 2,
                        backgroundColor: "#F5F3FF",
                        p: { xs: 2, sm: 2.5 },
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        minHeight: { xs: 110, md: 130 },
                        width: "100%",
                        borderLeft: "6px solid #7C3AED",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography sx={{ fontSize: { xs: 13, sm: 15, md: 16 }, fontWeight: 600, color: "#5B21B6" }}>Net Balance</Typography>
                            <Box sx={{ p: 0.75, borderRadius: "50%", bgcolor: "#EDE9FE", color: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <SavingsIcon sx={{ fontSize: { xs: 18, md: 22 } }} />
                            </Box>
                        </Box>
                        <Typography sx={{
                            fontWeight: 700,
                            fontSize: { xs: 20, sm: 24, md: 28 },
                            color: balanceamount >= 0 ? "#4C1D95" : "#DC2626",
                            my: 0.5
                        }}>
                            ₹{balanceamount.toLocaleString("en-IN")}
                        </Typography>
                        <Typography sx={{ color: "grey.600", fontWeight: 500, fontSize: { xs: 11, sm: 12, md: 13 } }}>
                            {selectedMonth.format("MMMM YYYY")}
                        </Typography>
                    </Box>
                </Box>

                {/* Expense Entries */}
                <Box sx={{ mt: { xs: 3, md: 4 } }}>
                    <Typography sx={{ fontWeight: 600, fontSize: { xs: 18, md: 20 }, mb: 2 }}>Expense Entries</Typography>
                    
                    {/* Desktop Table View */}
                    <TableContainer component={Paper} sx={{ display: { xs: "none", md: "block" }, maxHeight: "400px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#F5F3FF" }}>
                                    <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Payment Method</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Expense Date</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Edit</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Delete</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {expensedata?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 3, color: "text.secondary" }}>
                                            No expenses found for this month
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    expensedata?.map((item) => (
                                        <TableRow key={item._id} hover>
                                            <TableCell sx={{ fontWeight: 500 }}>{item.category?.name || item.category}</TableCell>
                                            <TableCell sx={{ fontWeight: 600, color: "#DC2626" }}>₹{Number(item.amount).toLocaleString("en-IN")}</TableCell>
                                            <TableCell>{item.description || "—"}</TableCell>
                                            <TableCell sx={{ textTransform: "capitalize" }}>{item.paymentMethod}</TableCell>
                                            <TableCell>{dayjs(item.date).format("D MMM YYYY")}</TableCell>
                                            <TableCell>
                                                <IconButton size="small" onClick={() => {
                                                    setEditId(item._id);
                                                    setopeneditdialog(true);
                                                    setEditCategory(item.category?._id || item.category);
                                                    setEditAmount(String(item.amount));
                                                    setEditDescription(item.description || "");
                                                    setEditExpenseDate(dayjs(item.date).format("YYYY-MM-DD"));
                                                    seteditpaymentMethod(item.paymentMethod);
                                                }}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                            <TableCell>
                                                <IconButton size="small" color="error" onClick={() => {
                                                    setDeleteId(item._id);
                                                    setopendeletedialog(true);
                                                }}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Mobile Card View */}
                    <Box sx={{ display: { xs: "flex", md: "none" }, flexDirection: "column", gap: 1.5 }}>
                        {expensedata?.length === 0 ? (
                            <Paper sx={{ p: 3, textAlign: "center", color: "text.secondary", borderRadius: 2 }}>
                                No expenses found for this month
                            </Paper>
                        ) : (
                            expensedata?.map((item) => (
                                <Paper key={item._id} sx={{ p: 2, borderRadius: 2, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #F3F4F6" }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                                        <Box>
                                            <Typography sx={{ fontWeight: 600, fontSize: "0.95rem", color: "#1F2937" }}>
                                                {item.category?.name || item.category}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                                {dayjs(item.date).format("D MMM YYYY")} • {item.paymentMethod}
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ fontWeight: 700, fontSize: "1.05rem", color: "#DC2626" }}>
                                            - ₹{Number(item.amount).toLocaleString("en-IN")}
                                        </Typography>
                                    </Box>

                                    {item.description && (
                                        <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.85rem", mb: 1 }}>
                                            {item.description}
                                        </Typography>
                                    )}

                                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, pt: 0.5, borderTop: "1px solid #F3F4F6" }}>
                                        <IconButton size="small" onClick={() => {
                                            setEditId(item._id);
                                            setopeneditdialog(true);
                                            setEditCategory(item.category?._id || item.category);
                                            setEditAmount(String(item.amount));
                                            setEditDescription(item.description || "");
                                            setEditExpenseDate(dayjs(item.date).format("YYYY-MM-DD"));
                                            seteditpaymentMethod(item.paymentMethod);
                                        }}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" color="error" onClick={() => {
                                            setDeleteId(item._id);
                                            setopendeletedialog(true);
                                        }}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Paper>
                            ))
                        )}
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mt: 2,
                            p: 2,
                        }}
                    >
                        <Typography variant="body2">
                            Page {page} of {totalPages || 1} | Total Expenses: {totalRecords}
                        </Typography>

                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Button
                                variant="outlined"
                                disabled={page === 1}
                                onClick={() => setPage((prev) => prev - 1)}
                            >
                                Previous
                            </Button>

                            <Button
                                variant="contained"
                                disabled={page >= totalPages || totalPages === 0}
                                onClick={() => setPage((prev) => prev + 1)}
                                sx={{
                                    backgroundColor: "#7C3AED",
                                    "&:hover": {
                                        backgroundColor: "#6D28D9",
                                    },
                                }}
                            >
                                Next
                            </Button>
                        </Box>
                    </Box>
                    <Dialog open={opendeletedialog} onClose={() => { setopendeletedialog(false) }}>
                        <DialogTitle>Delete Expense</DialogTitle>
                        <DialogContent>
                            Are you sure you want to delete this expense?
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => { setopendeletedialog(false) }}>No</Button>
                            <Button onClick={() => {
                                if (deleteid) { handleDelete(deleteid) }
                            }}>Yes</Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={openeditdialog} onClose={() => { setopeneditdialog(false) }} fullWidth>
                        <DialogTitle>Edit Expense</DialogTitle>
                        <DialogContent>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                                <TextField label="Amount" type="number" value={editamount} onChange={(e) => setEditAmount(e.target.value)} />
                                <FormControl fullWidth>
                                    <InputLabel>Category</InputLabel>
                                    <Select value={editCategory} label="Category" onChange={(e) => setEditCategory(e.target.value)}>
                                        {Array.isArray(categories) && categories.map((item) => (
                                            <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
                                        ))}

                                    </Select>
                                </FormControl>

                                <TextField label="Description" type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                                <TextField label="Expense Date" type="date" value={editExpenseDate} onChange={(e) => setEditExpenseDate(e.target.value)} slotProps={{
                                    inputLabel: {
                                        shrink: true,
                                    },
                                }} />
                                <FormControl fullWidth>
                                    <InputLabel>Payment Method</InputLabel>
                                    <Select value={editpaymentMethod} label="Payment Method" onChange={(e) => seteditpaymentMethod(e.target.value)}>
                                        <MenuItem value={"cash"}>Cash</MenuItem>
                                        <MenuItem value={"card"}>Card</MenuItem>
                                        <MenuItem value={"online"}>Online</MenuItem>
                                    </Select>
                                </FormControl >
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => { setopeneditdialog(false) }}>No</Button>
                            <Button onClick={() => {
                                if (editid) { handleEdit(editid) }
                            }}>Yes</Button>
                        </DialogActions>
                    </Dialog>

                </Box>
                <AppSnackbar open={snackbar.open} message={snackbar.message} severity={snackbar.severity} onClose={handleSnackbarClose} />
            </Box >
        </>

    )

}