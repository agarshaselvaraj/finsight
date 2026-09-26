"use client";
import React, { useState, useEffect } from 'react';
import AppSnackbar from '../common/AppSnackbar';
import axios from "axios";
import { Button, TextField, Box, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useRouter } from "next/navigation";
import { API_BASE_URL } from '../../services/api';

interface Category {
    _id: string;
    name: string;
    color?: string;
    isSystem?: boolean;
    isActive?: boolean;
}

export default function ExpenseForm() {
    const router = useRouter();
    const [amount, setAmount] = useState(0);
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [expensedate, setExpenseDate] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" as "success" | "error" | "warning" | "info" });
    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (amount <= 0) {
            setSnackbar({ open: true, message: "Amount should be greater than zero", severity: "error" })
            return;
        }

        if (!amount || !category) {
            setSnackbar({ open: true, message: "All fields required", severity: "error" })
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${API_BASE_URL}/expense`,
                {
                    amount,
                    category,
                    description,
                    date: expensedate,
                    paymentMethod
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSnackbar({ open: true, message: response.data?.message || "Expense added successfully!", severity: "success" });

            setAmount(0);
            setCategory("");
            setDescription("");
            setExpenseDate("");
            setPaymentMethod("");
            setTimeout(() => {
                router.push('/Expense');
            }, 800);
        } catch (error: any) {
            const errorMessage =
                typeof error.response?.data === "string"
                    ? error.response.data
                    : error.response?.data?.message || error.message || "Failed to add expense";
            setSnackbar({ open: true, message: errorMessage, severity: "error" });
        }
    }
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

    return (
        <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#9f01ff", px: 2 }}>
            < Box component="form" sx={{ width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: 2, p: 4, border: "1px solid #ddd", borderRadius: 3, boxShadow: 3, backgroundColor: "white" }} onSubmit={handleSubmit} >
                <Typography variant="h4" color="#9f01ff">Add Expense</Typography>

                <TextField label="Amount" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
                <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select value={category} label="Category" onChange={(e) => setCategory(e.target.value)}>
                        {Array.isArray(categories) && categories.map((item) => (
                            <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
                        ))}

                    </Select>
                </FormControl>

                <TextField label="Description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                <TextField label="Expense Date" type="date" value={expensedate} onChange={(e) => setExpenseDate(e.target.value)} slotProps={{
                    inputLabel: {
                        shrink: true,
                    },
                }} />
                <FormControl fullWidth>
                    <InputLabel>Payment Method</InputLabel>
                    <Select value={paymentMethod} label="Payment Method" onChange={(e) => setPaymentMethod(e.target.value)}>
                        <MenuItem value={"cash"}>Cash</MenuItem>
                        <MenuItem value={"card"}>Card</MenuItem>
                        <MenuItem value={"online"}>Online</MenuItem>
                    </Select>
                </FormControl>

                <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                    <Button onClick={() => router.push('/Expense')}>Cancel</Button>
                    <Button type='submit'>Submit</Button>
                </Box>

            </Box>
            <AppSnackbar open={snackbar.open} message={snackbar.message} severity={snackbar.severity} onClose={handleSnackbarClose} />
        </Box >
    );
} 