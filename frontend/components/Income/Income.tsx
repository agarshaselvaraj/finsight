"use client"
import { useState, useEffect } from "react"
import IncomeForm from "./AddIncome"
import { Button, Box, Typography, IconButton } from '@mui/material';
import { useRouter } from "next/navigation";
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { DateTimePicker } from "@mui/x-date-pickers";
import { AccountBalanceWallet } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper } from "@mui/material";
import axios from "axios";
import AppSnackbar from "../common/AppSnackbar";
import { API_BASE_URL } from "../../services/api";

export default function Income() {
    const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs())
    const router = useRouter();
    const [deleteid, setDeleteId] = useState<string | null>(null);
    const [opendeletedialog, setopendeletedialog] = useState(false);
    const [editid, setEditId] = useState<string | null>(null);
    const [openeditdialog, setopeneditdialog] = useState(false);
    const [incomedata, setIncomeDate] = useState<any[]>([])
    const [totalincome, setTotalIncome] = useState(0);
    const [loading, setLoading] = useState(true);
    const [editsource, setEditSource] = useState('');
    const [editamount, setEditAmount] = useState('');
    const [editDescription, setEditDescription] = useState("");
    const [editIncomeDate, setEditIncomeDate] = useState("");
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" as "success" | "error" | "warning" | "info" });
    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    }
    const handleEdit = async (_id: string) => {
        try {
            const token = localStorage.getItem("token");
            const data = await axios.put(
                `${API_BASE_URL}/income/${_id}`,
                {
                    amount: Number(editamount),
                    source: editsource,
                    description: editDescription,
                    incomeDate: editIncomeDate,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setopeneditdialog(false);
            setEditId(null);
            setSnackbar({ open: true, message: data.data?.message || "Income updated successfully!", severity: "success" });
            await fetchIncome();
        }
        catch (error) {
            setSnackbar({
                open: true,
                message: "Failed to update income",
                severity: "error",
            });
        }
    }
    const fetchIncome = async () => {
        try {


            const token = localStorage.getItem("token");
            const data = await axios.get(`${API_BASE_URL}/income?month=${selectedMonth.format("YYYY-MM")}`, { headers: { Authorization: `Bearer ${token}` } });
            setTotalIncome(data.data?.totalincome || 0);
            setIncomeDate(data.data?.data || []);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    }
    const handleDelete = async (_id: string) => {
        try {
            const token = localStorage.getItem("token");
            const data = await axios.delete(`${API_BASE_URL}/income/${_id}`, { headers: { Authorization: `Bearer ${token}` } });
            setopendeletedialog(false);
            setDeleteId(null);
            setSnackbar({ open: true, message: data.data?.message || "Income deleted successfully!", severity: "success" });
            await fetchIncome();
        }
        catch (error) {
            setSnackbar({
                open: true,
                message: "Failed to delete income",
                severity: "error",
            });
        }
    }
    useEffect(() => {
        fetchIncome();
    }, [selectedMonth]);
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
                    <Typography variant="h5" sx={{ fontWeight: 600, fontSize: { xs: "24px", md: "30px" } }}>Income</Typography>
                    <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", width: { xs: "100%", sm: "auto" }, justifyContent: { xs: "space-between", sm: "flex-end" } }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Select Month"
                                views={["year", "month"]}
                                format="MMM YYYY"
                                value={selectedMonth}
                                onChange={(newval) => {
                                    if (newval) {
                                        setSelectedMonth(newval)
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

                        <Button onClick={() => router.push("/addIncome")} sx={{
                            borderRadius: 2, px: { xs: 1.5, sm: 2 },
                            py: 1,
                            backgroundColor: "#7C3AED",
                            color: "white",
                            fontSize: { xs: "0.8rem", sm: "0.875rem" },
                            whiteSpace: "nowrap",
                            "&:hover": {
                                backgroundColor: "#6D28D9",
                            },
                        }}>+ Add Income</Button>
                    </Box>
                </Box>

                {/* Total Income card */}
                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "minmax(260px, 340px)" },
                    gap: { xs: 1.5, sm: 2 },
                    width: "100%",
                }}>
                    <Box sx={{
                        borderRadius: 2,
                        backgroundColor: "#F0FDF4",
                        p: { xs: 2, sm: 2.5 },
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        minHeight: { xs: 110, md: 130 },
                        width: "100%",
                        borderLeft: "6px solid #10B981",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography sx={{ fontSize: { xs: 13, sm: 15, md: 16 }, fontWeight: 600, color: "#166534" }}>Total Income</Typography>
                            <Box sx={{ p: 0.75, borderRadius: "50%", bgcolor: "#DCFCE7", color: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <AccountBalanceWallet sx={{ fontSize: { xs: 18, md: 22 } }} />
                            </Box>
                        </Box>
                        <Typography sx={{ fontWeight: 700, fontSize: { xs: 20, sm: 24, md: 28 }, color: "#14532D", my: 0.5 }}>
                            ₹{totalincome.toLocaleString("en-IN")}
                        </Typography>
                        <Typography sx={{ color: "grey.600", fontWeight: 500, fontSize: { xs: 11, sm: 12, md: 13 } }}>
                            {selectedMonth.format("MMMM YYYY")}
                        </Typography>
                    </Box>
                </Box>

                {/* Income Entries */}
                <Box sx={{ mt: { xs: 3, md: 4 } }}>
                    <Typography sx={{ fontWeight: 600, fontSize: { xs: 18, md: 20 }, mb: 2 }}>Income Entries</Typography>
                    
                    {/* Desktop Table View */}
                    <TableContainer component={Paper} sx={{
                        display: { xs: "none", md: "block" },
                        maxHeight: "400px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#F5F3FF" }}>
                                    <TableCell sx={{ fontWeight: 600 }}>Source</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Income Date</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Edit</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Delete</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {incomedata?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 3, color: "text.secondary" }}>
                                            No income entries found for this month
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    incomedata?.map((item) => (
                                        <TableRow key={item._id} hover>
                                            <TableCell sx={{ fontWeight: 500 }}>{item.source}</TableCell>
                                            <TableCell sx={{ fontWeight: 600, color: "#16A34A" }}>₹{Number(item.amount).toLocaleString("en-IN")}</TableCell>
                                            <TableCell>{item.description || "—"}</TableCell>
                                            <TableCell>{dayjs(item.incomeDate).format("D MMM YYYY")}</TableCell>
                                            <TableCell>
                                                <IconButton size="small" onClick={() => {
                                                    setEditId(item._id);
                                                    setopeneditdialog(true);
                                                    setEditSource(item.source);
                                                    setEditAmount(String(item.amount));
                                                    setEditDescription(item.description || "");
                                                    setEditIncomeDate(dayjs(item.incomeDate).format("YYYY-MM-DD"));
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
                        {incomedata?.length === 0 ? (
                            <Paper sx={{ p: 3, textAlign: "center", color: "text.secondary", borderRadius: 2 }}>
                                No income entries found for this month
                            </Paper>
                        ) : (
                            incomedata?.map((item) => (
                                <Paper key={item._id} sx={{ p: 2, borderRadius: 2, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #F3F4F6" }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                                        <Box>
                                            <Typography sx={{ fontWeight: 600, fontSize: "0.95rem", color: "#1F2937" }}>
                                                {item.source}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                                {dayjs(item.incomeDate).format("D MMM YYYY")}
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ fontWeight: 700, fontSize: "1.05rem", color: "#16A34A" }}>
                                            + ₹{Number(item.amount).toLocaleString("en-IN")}
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
                                            setEditSource(item.source);
                                            setEditAmount(String(item.amount));
                                            setEditDescription(item.description || "");
                                            setEditIncomeDate(dayjs(item.incomeDate).format("YYYY-MM-DD"));
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

                    <Dialog open={opendeletedialog} onClose={() => { setopendeletedialog(false) }}>
                        <DialogTitle>Delete Income</DialogTitle>
                        <DialogContent>
                            Are you sure you want to delete this income?
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => { setopendeletedialog(false) }}>No</Button>
                            <Button onClick={() => {
                                if (deleteid) { handleDelete(deleteid) }
                            }}>Yes</Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={openeditdialog} onClose={() => { setopeneditdialog(false) }} fullWidth>
                        <DialogTitle>Edit Income</DialogTitle>
                        <DialogContent>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                                <TextField label="Amount" type="number" value={editamount} onChange={(e) => setEditAmount(e.target.value)} />
                                <TextField label="Source" type="text" value={editsource} onChange={(e) => setEditSource(e.target.value)} />
                                <TextField label="Description" type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                                <TextField
                                    label="Income Date"
                                    type="date"
                                    value={editIncomeDate}
                                    onChange={(e) => setEditIncomeDate(e.target.value)}
                                    slotProps={{
                                        inputLabel: {
                                            shrink: true,
                                        },
                                    }}
                                />
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