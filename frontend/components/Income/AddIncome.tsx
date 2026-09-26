"use client";
import React, { useState } from 'react';
import AppSnackbar from '../common/AppSnackbar';
import axios from "axios";
import { Button, TextField, Box, Typography } from '@mui/material';
import { useRouter } from "next/navigation";
import { API_BASE_URL } from '../../services/api';

export default function IncomeForm() {
    const router = useRouter();
    const [amount, setAmount] = useState(0);
    const [source, setSource] = useState("");
    const [description, setDescription] = useState("");
    const [incomedate, setIncomeDate] = useState("");
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
        if (!amount || !source) {
            setSnackbar({ open: true, message: "All fields required", severity: "error" })
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${API_BASE_URL}/income`,
                {
                    amount,
                    source,
                    description,
                    incomeDate: incomedate
                }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            );

            setSnackbar({ open: true, message: response.data?.message || "Income added successfully!", severity: "success" });

            setAmount(0);
            setSource("");
            setDescription("");
            setIncomeDate("");
            setTimeout(() => {
                router.push('/Income');
            }, 800);
        } catch (error: any) {
            const errorMessage =
                typeof error.response?.data === "string"
                    ? error.response.data
                    : error.response?.data?.message || error.message || "Failed to add income";
            setSnackbar({ open: true, message: errorMessage, severity: "error" });
        }
    }
    return (
        <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#9f01ff", px: 2 }}>
            < Box component="form" sx={{ width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: 2, p: 4, border: "1px solid #ddd", borderRadius: 3, boxShadow: 3, backgroundColor: "white" }} onSubmit={handleSubmit} >
                <Typography variant="h4" color="#9f01ff">Add Income</Typography>

                <TextField label="Amount" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
                <TextField label="Source" type="text" value={source} onChange={(e) => setSource(e.target.value)} />
                <TextField label="Description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                <TextField label="Income Date" type="date" value={incomedate} onChange={(e) => setIncomeDate(e.target.value)} slotProps={{
                    inputLabel: {
                        shrink: true,
                    },
                }} />
                <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                    <Button onClick={() => router.push('/Income')}>Cancel</Button>
                    <Button type='submit'>Submit</Button>
                </Box>

            </Box>
            <AppSnackbar open={snackbar.open} message={snackbar.message} severity={snackbar.severity} onClose={handleSnackbarClose} />
        </Box >
    );
}